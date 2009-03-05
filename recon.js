// ========================================================================
// Copyright (c) 2008-2009, Metaweb Technologies, Inc.
// All rights reserved.
// 
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions
// are met:
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above
//       copyright notice, this list of conditions and the following
//       disclaimer in the documentation and/or other materials provided
//       with the distribution.
// 
// THIS SOFTWARE IS PROVIDED BY METAWEB TECHNOLOGIES AND CONTRIBUTORS
// ``AS IS'' AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL METAWEB
// TECHNOLOGIES OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
// INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
// BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS
// OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
// ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
// TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE
// USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH
// DAMAGE.
// ========================================================================


var totalRecords = 0;

var manualQueue = [];
var automaticQueue = [];
var freebase_url = "http://www.freebase.com/"
var reconciliation_url = "";
var headers;
var rows;
var mqlProps;
var mqlMetadata = {};
var complexHeaders = [];
var simpleHeaders = [];


function setReconciliationURL() {
    if (window.location.href.substring(0,4) == "file") {
        reconciliation_url = "http://www.mqlx.com/reconciliation/";
        return;
    }
    var url_parts = window.location.href.split("/");
    url_parts.pop();
    reconciliation_url = url_parts.join("/") + "/";
}

var entities = [];
var internalIDCounter = 0;
function newEntity(initialVals) {
    var result = {"/rec_ui/id":internalIDCounter++}
    entities[result["/rec_ui/id"]] = result;
    for (var key in initialVals)
        result[key] = initialVals[key];
    return result;
}

/*
** Parsing and munging the input
*/

function parseSpreadsheet(spreadsheet) {
    var position = 0;
    
    function parseLine() {
        var fields = [];
        var inQuotes = false;
        var field = "";
        function nextField() {
            fields.push(field);
            field = "";
            position++;
        }
        function isEndOfLine() {
            var c = spreadsheet.charAt(position);
            if (c == "\r" && spreadsheet.charAt(position+1) == "\n"){
                position++; return true;
            }
            return c == "" || spreadsheet.charAt(position) == "\n" ;
        }
        //If this gives me any more trouble, I'm just doing a state machine
        while(true) {
            var c = spreadsheet.charAt(position);
            if (inQuotes){
                //quotes are quoted with two adjacent quotes
                if (c == '"' && spreadsheet.charAt(position+1) == '"'){
                    field += c;
                    position += 2;
                    continue;
                }
                //end of the quoted field
                if (c == '"'){
                    inQuotes = false;
                    position++;
                    if (isEndOfLine()){
                        fields.push(field);
                        position++;
                        return fields;
                    }
                    nextField();
                    continue;
                }
                
                //just a character in the quoted field
                field += c;
                position++;
                continue;
            }
            
            //the field is quoted
            if (spreadsheet.charAt(position) == '"'){
                inQuotes = true;
                position++;
                continue;
            }
            
            //end of the field
            if (c == "\t"){
                nextField();
                continue;
            }
            
            //end of the line
            if (isEndOfLine()){
                fields.push(field);
                position += 1;
                return fields;
            }
            
            //just a character in the field
            field += c;
            position += 1;
        }
    }
    
    headers = parseLine();
    //get, or make the id column
    if (!contains(headers, "id"))
        headers.push("id");
    
    $.each(headers, function(i,header) {
        if (charIn(header,":"))
            complexHeaders.push(header);
        else
            simpleHeaders.push(header);
    });
    
    mqlProps = [];
    $.each(simpleHeaders, function(i,header) {
        if (!contains(["/type/object/name","/type/object/type","id","/type/object/id"], header) && header.charAt(0) == "/")
            mqlProps.push(headers[i]);
    });
    
    rows = [];
    var rowHeaders  = simpleHeaders.slice();
    var rowMqlProps = mqlProps.slice();
    while(spreadsheet.charAt(position) != ""){
        var rowArray = parseLine();
        var entity = newEntity({"/rec_ui/headers": rowHeaders,
                                "/rec_ui/mql_props": rowMqlProps});
        for (var i=0; i < headers.length; i++)
            if (rowArray[i] != "")
                entity[headers[i]] = rowArray[i];
        rows.push(entity);
    }
}

function combineRows() {
    var rowIndex = undefined;
    while(rowIndex = getAmbiguousRowIndex(rowIndex)) {
        var mergeRow = rows[rowIndex];
        var i;
        for (i = rowIndex+1; i < rows.length && rows[i][headers[0]] == undefined;i++) {
            for (var j = 0; j<headers.length; j++) {
                var col = headers[j];
                if (rows[i][col] == undefined)
                    continue;
                if (typeof(mergeRow[col]) == "string")
                    mergeRow[col] = [mergeRow[col], rows[i][col]];
                else
                    mergeRow[col].push(rows[i][col]);
            }
        }
        //remove the rows that we've combined in
        rows.splice(rowIndex+1, (i - rowIndex) - 1);
    }
}

function getAmbiguousRowIndex(from) {
    /* 
    Starting at `from+1`, look for the first row that has an entry in the
    first column which is followed by a row without an entry in the first
    column. 
    */
    if (from == undefined)
        from = -1;
    from++;

    var startingRowIdx;
    for(var i = from; i < rows.length; i++) {
        if (rows[i][headers[0]] != "" && rows[i][headers[0]] != undefined)
            startingRowIdx = i;
        else if (startingRowIdx != undefined)
            return startingRowIdx;
    }
    return undefined;
}

function spreadsheetParsed(callback) {
    function isUnreconciled(entity) {
        return contains([undefined,null,"indeterminate",""], entity["id"]);
    }
    totalRecords = rows.length;
    automaticQueue = $.grep(rows,isUnreconciled);
    fetchMQLPropMetadata(callback);
}

function fetchMQLPropMetadata(callback) {
    function getQuery(propID) {
        return {
              "expected_type" : {
                  "extends" : [],
                  "id" : null
              },
              "reverse_property" : null,
              "type" : "/type/property",
              "id" : propID
        };
    }
    var envelope = {};
    for (var i = 0; i < mqlProps.length; i++)
        envelope["q" + i] = {"query": getQuery(mqlProps[i])};
    function handler(results) {
        handleMQLPropMetadata(results);
        callback();
    }
    $.getJSON(freebase_url + "/api/service/mqlread?callback=?&", {queries:JSON.stringify(envelope)}, handler);
}

function isValueType(type) {
    return contains(type['extends'], "/type/value");
}
function handleMQLPropMetadata(results) {
    console.assert(results.code == "/api/status/ok", results);
    var i = 0;
    var result = results["q" + i++];
    
    while (result != undefined) {
        console.assert(result.code == "/api/status/ok", result)
        result = result.result;
        mqlMetadata[result['id']] = result;
        if (!isValueType(result.expected_type) && !contains(headers,result.id + ":id" ))
//             insertAfter(headers, result.id, result.id + ":id");
            headers.push(result.id + ":id");
        if (mqlMetadata[result.expected_type] == undefined)
            mqlMetadata[result.expected_type] = {reverse_property: result.id};
        result = results["q" + i++];
    }
    objectifyRows();
}

function objectifyRows() {
    $.each(rows, function(i,row) {
        for (var prop in row) {
            function objectifyRowProperty(value) {
                var result = newEntity({'/type/object/name':row[prop],
                              '/type/object/type':meta.expected_type['id'],
                              '/rec_ui/headers': ['/type/object/name','/type/object/type'],
                              '/rec_ui/mql_props': [],
                              "/rec_ui/column_val": true});
                if (meta.reverse_property != null){
                    result[meta.reverse_property] = row;
                    result['/rec_ui/headers'].push(meta.reverse_property);
                    result['/rec_ui/mql_props'].push(meta.reverse_property);
                }
                return result;
            }
            
            var meta = mqlMetadata[prop];
            if (meta == undefined || isValueType(meta.expected_type))
                continue;
            if ($.isArray(row[prop]))
                row[prop] = $.map(row[prop], objectifyRowProperty)
            else
                row[prop] = objectifyRowProperty(row[prop]);
        }
        $.each(complexHeaders, function(j,complexHeader) {
            var value = row[complexHeader];
            var parts = complexHeader.split(":");
            var slot = row;
            $.each(parts.slice(0,parts.length-1), function(k,part) {
                if (slot[part] == undefined){
                    console.error("error accessing" + part + " part of " + complexHeader);
                    console.error(row);
                }
                slot = slot[part];
            });
            slot[parts[parts.length-1]] = value;
        });
    });
}


/*
**  Automatic reconciliation
*/
function beginAutoReconciliation() {
    $(".nowReconciling").show();
    $(".notReconciling").hide();
    $("#gettingInput").remove();
    autoReconcile();
}

function finishedAutoReconciling() {
    $(".nowReconciling").hide();
    $('.notReconciling').show();
}

function autoReconcile() {
    if (automaticQueue.length == 0) {
        finishedAutoReconciling();
        return;
    }
    updateUnreconciledCount();
    getCandidates(automaticQueue[0], autoReconcileResults);
}

function getCandidates(entity, callback) {
    var query = {}
    var headers = entity["/rec_ui/headers"];
    for (var i = 0; i < headers.length; i++) {
        var prop = headers[i];
        var value = entity[prop];
        
        function constructQueryPart(value) {
            if (value.id != undefined && value.id != "" && value.id != "None")
                return {"id":value.id, "name":value["/type/object/name"]}
            return value["/type/object/name"] || value;
        }
        if (value != undefined && value != null && value != "" && prop != "id") {
            if(query[prop] == undefined)
                query[prop] = [];
            query[prop] = query[prop].concat($.map($.makeArray(value), constructQueryPart));
        }
    }
    function handler(results) {
        entity.reconResults = results; 
        callback(entity);
    }
    $.getJSON(reconciliation_url + "query?jsonp=?", {q:JSON.stringify(query), limit:4}, handler);
}

function autoReconcileResults(entity) {
    automaticQueue.shift();
    // no results, set to None:
    if(entity.reconResults.length == 0) {
        entity["id"] = "None";
        console.warn("No results:");
        console.warn(entity);
        addColumnRecCases(entity);
    }        
    // match found:
    else if(entity.reconResults[0]["match"] == true) {
        entity["id"] = entity.reconResults[0]["id"];
        addColumnRecCases(entity);
    }
    else {
        var wasEmpty = isObjectEmpty(manualQueue);
        manualQueue[entity["/rec_ui/id"]] = entity;
        if (wasEmpty)
            manualReconcile();
    }
    autoReconcile();
}

/*
** Manual Reconciliation
*/

function manualReconcile() {
    var val = getFirstValue(manualQueue);
    if(val != undefined) {
        $.historyLoad(val["/rec_ui/id"])
        renderReconChoices(getSecondValue(manualQueue)); //render-ahead the next one
    }
    else{
        $(".manualQueueEmpty").show();
        $(".manualReconciliation").hide();
        $(".manualReconChoices:visible").remove();
    }
}

function displayReconChoices(entityID) {
    var entity = entities[entityID];
    if (entity === undefined) return;
    $(".manualQueueEmpty").hide();
    $(".manualReconciliation").show();
    //remove rather than hide to prevent memory leaks
    $(".manualReconChoices:visible").remove();
    
    if (! $("#manualReconcile" + entityID)[0])
        renderReconChoices(entity);
    $("#manualReconcile" + entityID).show();
}

function renderReconChoices(entity) {
    if (entity == undefined) return;
    var template = $("#manualReconcileTemplate").clone();
    template[0].id = "manualReconcile" + entity['/rec_ui/id'];
    var headers = entity["/rec_ui/headers"];
    var mqlProps = entity["/rec_ui/mql_props"];
    
    var currentRecord = $(".recordVals",template);
    for(var i = 0; i < headers.length; i++) {
        currentRecord.append(node("label", headers[i] + ":", {"for":idToClass(headers[i])}));
        currentRecord.append(node("div",displayValue(entity[headers[i]])));
    }
    
    var tableHeader = $(".reconciliationCandidates table thead", template);
    var columnHeaders = ["","Image","Names","Types"].concat(mqlProps).concat(["Score"]);
    for (var i = 0; i < columnHeaders.length; i++)
        tableHeader.append(node("th",columnHeaders[i]));
    
    var tableBody = $(".reconciliationCandidates table tbody", template);
    for (var i = 0; i < entity.reconResults.length; i++)
        tableBody.append(renderCandidate(entity.reconResults[i], mqlProps));

    $('.reconciliationCandidates table tbody tr:odd', template).addClass('odd');
    $('.reconciliationCandidates table tbody tr:even', template).addClass('even');
    $(".find_topic", template)
        .freebaseSuggest()
        .bind("fb-select", function(e, data) { 
          handleReconChoice(entity["/rec_ui/id"], data.id);
        });
    $(".manualSelection", template).click(function(val) {handleReconChoice(entity, this.name)});
    template.insertAfter("#manualReconcileTemplate")

    fetchMqlProps(entity);
}

function renderCandidate(result, mqlProps) {
    var url = freebase_url + "/view/" + result['id'];
    var tableRow = node("tr", {"class":idToClass(result["id"])});
    
    var button = node("button", "Select", 
       {"class":'manualSelection', 
        "name":result.id})
    tableRow.append(node("td",button));
    
    node("td",
         node("img",{src:freebase_url + "/api/trans/image_thumb/"+result['id']+"?maxwidth=100&maxheight=100"})
    ).appendTo(tableRow);
    
    var names = node("td").appendTo(tableRow);
    for(var j = 0; j < result["name"].length; j++) {
        names.append(node("a",result["name"][j], {target:"_blank", href:url})).append(node("br"));
    }
    
    tableRow.append(node("td",result["type"].join("<br/>")));
    
    for(var j = 0; j < mqlProps.length; j++)
        tableRow.append(
            node("td", node("img",{src:"spinner.gif"}),
                 {"class":"replaceme "+idToClass(mqlProps[j])})
        );
    tableRow.append(node("td",result["score"]));
    return tableRow;
}

function fetchMqlProps(entity) {
    var mqlProps = entity["/rec_ui/mql_props"];
    for (var i = 0; i < entity.reconResults.length; i++) {
        var result = entity.reconResults[i];
        var query = {"id":result["id"],
                     "/type/reflect/any_master" : [
                       {
                         "link|=" : mqlProps,
                         "link" : null,
                         "id" : null,
                         "name" : null,
                         "optional" : true
                       }
                     ],
                     "/type/reflect/any_value" : [
                       {
                         "link|=" : mqlProps,
                         "link" : null,
                         "value" : null,
                         "optional" : true
                       }
                     ],
                     "/type/reflect/any_reverse" : [
                        {
                          "link" : {"master_property":{"reverse_property|=":mqlProps,
                                    "reverse_property":null}},
                          "id" : null,
                          "name" : null,
                          "optional" : true
                        }
                      ],
                    };
        var envelope = {query:query};
        function handler(results) {
            fillInMQLProps(entity, results);
        }
        $.getJSON(freebase_url + "/api/service/mqlread?callback=?&", {query:JSON.stringify(envelope)}, handler);
    }
}

function fillInMQLProps(entity, mqlResult) {
    var context = $("#manualReconcile" + entity["/rec_ui/id"]);
    if (mqlResult["code"] != "/api/status/ok" || mqlResult["result"] == null) {
        //don't show annoying loading symbols indefinitely if there's an error
        $(".replaceme",context).empty();
        console.error(mqlResult);
        return;
    }

    var result = mqlResult.result;
    var entity = $("tr." + idToClass(result.id),context);
    $(".replaceme", entity).empty();
    
    var props = result["/type/reflect/any_master"].concat(
                result["/type/reflect/any_value"]).concat(
                result["/type/reflect/any_reverse"]);
    for (var i = 0; i < props.length; i++) {
        var prop = props[i];
        var link = prop.link;
        if (link.master_property != undefined)
            link = link.master_property.reverse_property;
        var cell = $("td." + idToClass(link), entity);
        if (prop.value != undefined)
            cell.html(cell.html() + prop.value + " <br/>");
        else
            cell.html(cell.html() + freebaseLink(prop.id, prop.name) + "<br/>")
    }
}

function handleReconChoice(entity,freebaseId) {
    delete manualQueue[entity["/rec_ui/id"]];
    if (freebaseId != undefined)
        entity.id = freebaseId;
    addColumnRecCases(entity);
    updateUnreconciledCount();
    manualReconcile();
}

/*
**  Rendering the spreadsheet back to the user
*/

function renderSpreadsheet() {
    function encodeLine(arr) {
        var values = [];
        for(var i = 0; i < headers.length; i++){
            var val = arr[i];
            if (typeof val == "undefined") {
                values.push("");
                continue;
            }
            val = val.replace(/"/g, '""');
            values.push('"' + val + '"');
        }
        return values.join("\t");
    }
    function getNestedVal(obj, prop) {
        var parts = prop.split(":");
        var slot = obj;
        $.each(parts.slice(0,parts.length-1), function(k,part) {
            if (slot[part] == undefined)
                return undefined;
            slot = slot[part];
        });
        return slot[parts[parts.length-1]];
    }
    function encodeRow(row) {
        var lines = [[]];
        for (var i = 0; i < headers.length; i++){
            var val = getNestedVal(row, headers[i]);
            if (typeof val == "string")
                lines[0][i] = val;
            else if (typeof val == "undefined")
                lines[0][i] = "";
            else if ($.isArray(val)){
                for (var j = 0; j < val.length; j++) {
                    if (lines[j] == undefined) lines[j] = [];
                    lines[j][i] = val[j];
                }
            }
            else {
                //an object
                lines[0][i] = textValue(val);
            }
        }
        return $.map(lines,encodeLine);
    }
    var lines = [];
    lines.push(encodeLine(headers));
    for (var i = 0; i < rows.length; i++)
        lines = lines.concat(encodeRow(rows[i]));

    $("#outputSpreadSheet")[0].value = lines.join("\n");
}

/*
** Progress indication
*/ 
function updateUnreconciledCount() {
    var pctProgress = (((totalRecords - automaticQueue.length) / totalRecords) * 100);
    $("#progressbar").progressbar("value", pctProgress);
    $("#progressbar label").html(pctProgress.toFixed(1) + "%")
    $(".manual_count").html("("+numProperties(manualQueue)+")");
}

/*
**  Misc utility functions
*/

//perform a shallow copy of a JS object
function clone(obj) {
    var copy = {};
    for (var i in obj)
        copy[i] = obj[i];
    return copy;
}

//constructs a DOM node
function node(kind) {
    var node = $(document.createElement(arguments[0]));
    var options = arguments[arguments.length-1]
    var len = arguments.length - 1;
    if (typeof options == "object" && options.insertAfter == undefined){
        if (options["onclick"] != undefined) {
            node.click(options["onclick"]);
            delete options["onclick"];
        }
        node.attr(options);
    }
    else
        len = arguments.length;
    
    for (var i = 1; i < len; i++)
        node.append(arguments[i]);
    return node;
}

//Uniquely maps MQL ids to valid CSS class names
function idToClass(idName) {
    return idName.replace(/\//g,"_");
}

//Is value in array?
function contains(array, value) {
    for(var i = 0; i < array.length; i++)
        if (array[i] == value)
            return true;
    return false;
}

function charIn(string, chr) {
    for(var i = 0; i < string.length; i++)
        if (string.charAt(i) === chr)
            return true;
    return false;
}

function textValue(value) {
    if ($.isArray(value))
        return "[" + $.map(value, textValue).join(", ") + "]";
    if (value == undefined || value == null)
        return "";
    return value['/type/object/name'] || value;
}

function displayValue(value) {
    if ($.isArray(value))
        return $.map(value, displayValue).join("<br/>");
    if (value == undefined || value == null)
        return "[null]";
    if (value.id != undefined && value.id != "None")
        return freebaseLink(value.id, textValue(value["/type/object/name"]));
    return textValue(value);
}

function freebaseLink(id, text) {
    return "<a target='_blank' href='"+freebase_url+"/view"+id+"'>" + text + "</a>"
}

function addColumnRecCases(row) {
    if (! row["/rec_ui/column_val"]) {
        var autoQueueLength = automaticQueue.length;
        for (var i = 0; i < mqlProps.length; i++) {
            var values = $.makeArray(row[mqlProps[i]]);
            for (var j = 0; j < values.length; j++) {
                if (values[j]['/type/object/name'] != undefined){
                    automaticQueue.push(values[j]);
                    totalRecords++;
                }
            }
        }
        if (autoQueueLength == 0)
            beginAutoReconciliation();
    }
}


//I can't believe I can't find a better way of doing these:
function getFirstValue(obj) {
    for (var key in obj)
        return obj[key];
    return undefined;
}

function getSecondValue(obj) {
    var i = 1;
    for (var key in obj){
        if (i > 1)
            return obj[key];
        i++;
    }
    return undefined
    
}

function isObjectEmpty(obj) {
    for (var key in obj)
        return false;
    return true;
}

function numProperties(obj) {
    var i = 0;
    for (var key in obj)
        i++;
    return i;
}


/*
** create debugging tools if they're not available
*/

if (console == undefined)
    var console = {}
if (console.assert == undefined)
    console.assert = function(bool,message){if (!bool) console.error(message)}
//These messages don't go anywhere at the moment, but it'd be very easy to create the
// places where they'd go
if (console.error == undefined)
    console.error = function(message){node("div",JSON.stringify(message)).appendTo("#errors"); return message;}
if (console.warn == undefined)
    console.warn = function(message){node("div",JSON.stringify(message)).appendTo("#warnings"); return message;}
if (console.log == undefined)
    console.log = function(message){node("div",JSON.stringify(message)).appendTo("#log"); return message;}

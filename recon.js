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
var mqlMetadataReady = false;
var internalIDCounter = 0;

function setReconciliationURL() {
    if (window.location.href.substring(0,4) == "file") {
        reconciliation_url = "http://www.mqlx.com/reconciliation/";
        return;
    }
    var url_parts = window.location.href.split("/");
    url_parts.pop();
    reconciliation_url = url_parts.join("/") + "/";
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
    
    mqlProps = [];
    for(var i =0; i < headers.length; i++)
        if (!contains(["/type/object/name","/type/object/type","id","/type/object/id"], headers[i]) && headers[i][0] == "/")
            mqlProps.push(headers[i]);
    
    rows = [];
    while(spreadsheet.charAt(position) != ""){
        var rowArray = parseLine();
        var row = {};
        for (var i=0; i < headers.length; i++)
            if (rowArray[i] != "")
                row[headers[i]] = rowArray[i];
        row.internalId = internalIDCounter++;
        rows.push(row);
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
    function isUnreconciled(row) {
        return contains([undefined,null,"indeterminate",""], row["id"]);
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

function handleMQLPropMetadata(results) {
    assert(results.code == "/api/status/ok", results);
    var i = 0;
    var result = results["q" + i++];
    
    while (result != undefined) {
        assert(result.code == "/api/status/ok", result)
        mqlMetadata[result.result['id']] = result.result;
        if (mqlMetadata[result.result.expected_type] == undefined)
            mqlMetadata[result.result.expected_type] = {reverse_property: result.result.id};
        result = results["q" + i++];
    }
    objectifyRows();
}

function objectifyRows() {
    function isValueType(type) {
        return contains(type['extends'], "/type/value");
    }
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        for (var prop in row) {
            function objectifyRowProperty(value) {
                var result = {'/type/object/name':row[prop],
                              '/type/object/type':meta.expected_type['id'],
                              '/rec_ui/headers': ['/type/object/name','/type/object/type'],
                              '/rec_ui/mql_props': [],
                              "internalId":internalIDCounter++};
                if (meta.reverse_property != null){
                    result[meta.reverse_property] = row;
                    result['/rec_ui/reverse'] = meta.reverse_property;
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
    }
}


/*
**  Automatic reconciliation
*/
function beginAutoReconciliation() {
    $(".nowReconciling").show();
    $(".notReconciling").hide();
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

function getCandidates(row, callback) {
    var query = {}
    var headers = getHeaders(row);
    for (var i = 0; i < headers.length; i++) {
        var prop = headers[i];
        var value = row[prop];
        
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
        row.reconResults = results; 
        callback(row);
    }
    log(query);
    $.getJSON(reconciliation_url + "query?jsonp=?", {q:JSON.stringify(query), limit:4}, handler);
}

function autoReconcileResults(row) {
    automaticQueue.shift();
    // no results, set to None:
    if(row.reconResults.length == 0) {
        row["id"] = "None";
        warn("No results:");
        warn(row);
    }
        
    // match found:
    else if(row.reconResults[0]["match"] == true) {
        row["id"] = row.reconResults[0]["id"];
    }
    else {
        manualQueue.push(row);
        if (manualQueue.length == 1)
            manualReconcile();
    }
    addColumnRecCases(row);
    autoReconcile();
}

/*
** Manual Reconciliation
*/

function manualReconcile() {
    if(manualQueue[0] != undefined) {
        $(".manualQueueEmpty").hide();
        $(".manualReconciliation").show();
        displayReconChoices(manualQueue[0]);
        renderReconChoices(manualQueue[1]); //render-ahead the next one
    }
    else{
        $(".manualQueueEmpty").show();
        $(".manualReconciliation").hide();
    }
}

function displayReconChoices(row) {
    if (! $("#manualReconcile" + row.internalId)[0])
        renderReconChoices(row);
    $("#manualReconcile" + row.internalId).show();
}

function renderReconChoices(row) {
    if (row == undefined) return;
    var template = $("#manualReconcileTemplate").clone();
    template[0].id = "manualReconcile" + row.internalId;
    var headers = getHeaders(row);
    var mqlProps = getMQLProps(row);
    
    var currentRecord = $(".recordVals",template);
    for(var i = 0; i < headers.length; i++) {
        currentRecord.append(node("label", headers[i] + ":", {"for":idToClass(headers[i])}));
        currentRecord.append(node("div",displayValue(row[headers[i]])));
    }
    
    var tableHeader = $(".reconciliationCandidates table thead", template);
    var columnHeaders = ["","Image","Names","Types"].concat(mqlProps).concat(["Score"]);
    for (var i = 0; i < columnHeaders.length; i++)
        tableHeader.append(node("th",columnHeaders[i]));
    
    var tableBody = $(".reconciliationCandidates table tbody", template);
    for (var i = 0; i < row.reconResults.length; i++)
        tableBody.append(renderCandidate(row.reconResults[i], mqlProps));

    $('.reconciliationCandidates table tbody tr:odd', template).addClass('odd');
    $('.reconciliationCandidates table tbody tr:even', template).addClass('even');
    $(".find_topic", template)
        .freebaseSuggest()
        .bind("fb-select", function(e, data) { 
          handleReconChoice(data.id);
        });
    
    template.insertAfter("#manualReconcileTemplate")

    fetchMqlProps(row);
}

function renderCandidate(result, mqlProps) {
    var url = freebase_url + "/view/" + result['id'];
    var row = node("tr", {"class":idToClass(result["id"])});
    
    var button = node("button", "Select", 
       {"class":'manualSelection', 
        "onclick":function() {handleReconChoice(result["id"])}})
    row.append(node("td",button));
    
    node("td",
         node("img",{src:freebase_url + "/api/trans/image_thumb/"+result['id']+"?maxwidth=100&maxheight=100"})
    ).appendTo(row);
    
    var names = node("td").appendTo(row);
    for(var j = 0; j < result["name"].length; j++) {
        names.append(node("a",result["name"][j], {target:"_blank", href:url})).append(node("br"));
    }
    
    row.append(node("td",result["type"].join("<br/>")));
    
    for(var j = 0; j < mqlProps.length; j++)
        row.append(
            node("td", node("img",{src:"spinner.gif"}),
                 {"class":"replaceme "+idToClass(mqlProps[j])})
        );
    row.append(node("td",result["score"]));
    return row;
}

function fetchMqlProps(row) {
    var mqlProps = getMQLProps(row);
    for (var i = 0; i < row.reconResults.length; i++) {
        var result = row.reconResults[i];
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
            fillInMQLProps(row, results);
        }
        $.getJSON(freebase_url + "/api/service/mqlread?callback=?&", {query:JSON.stringify(envelope)}, handler);
    }
}

function fillInMQLProps(row, mqlResult) {
    var context = $("#manualReconcile" + row.internalId);
    if (mqlResult["code"] != "/api/status/ok" || mqlResult["result"] == null) {
        //don't show annoying loading symbols indefinitely if there's an error
        $(".replaceme",context).empty();
        error(mqlResult);
        return;
    }

    var result = mqlResult.result;
    var row = $("tr." + idToClass(result.id),context);
    $(".replaceme", row).empty();
    
    var props = result["/type/reflect/any_master"].concat(
                result["/type/reflect/any_value"]).concat(
                result["/type/reflect/any_reverse"]);
    for (var i = 0; i < props.length; i++) {
        var prop = props[i];
        var link = prop.link;
        if (link.master_property != undefined)
            link = link.master_property.reverse_property;
        var cell = $("td." + idToClass(link), row);
        if (prop.value != undefined)
            cell.html(cell.html() + prop.value + " <br/>");
        else
            cell.html(cell.html() + freebaseLink(prop.id, prop.name) + "<br/>")
    }
}

function handleReconChoice(id) {
    var row = manualQueue.shift();
    if (id != undefined)
        row["id"] = id;
    addColumnRecCases(row);
    $("#manualReconcile" + row.internalId).remove();
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
    function encodeRow(row) {
        var lines = [[]];
        for (var i = 0; i < headers.length; i++){
            var val = row[headers[i]];
            if (typeof val == "string")
                lines[0][i] = val;
            else if (typeof val == "undefined")
                lines[0][i] = "";
            else {
                //val is an array
                for (var j = 0; j < val.length; j++) {
                    if (lines[j] == undefined) lines[j] = [];
                    lines[j][i] = val[j];
                }
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
    $(".manual_count").html("("+manualQueue.length+")");
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

function assert(bool, message) {
    if (console.assert != undefined)
        console.assert(bool, message);
    else
        if (!bool) error(message);
}
function error(message) {
    if (console.error != undefined)
        console.error(message);
    else
        node("div",JSON.stringify(message)).appendTo("#errors");
}
function warn(message) {
    if (console.warn != undefined)
        console.warn(message);
    else
        node("div",JSON.stringify(message)).appendTo("#warnings");
}
function log(message) {
    if (console.log != undefined)
        console.log(message);
    else
        node("div",JSON.stringify(message)).appendTo("#log");
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

function getHeaders(row) {
    return row['/rec_ui/headers'] || headers;
}
function getMQLProps(row) {
    return row['/rec_ui/mql_props'] || mqlProps;
}

function freebaseLink(id, text) {
    return "<a target='_blank' href='"+freebase_url+"/view"+id+"'>" + text + "</a>"
}

function addColumnRecCases(row) {
    //if this isn't a property off of a row, but a row itself
    if (row["/rec_ui/headers"] == undefined) {
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
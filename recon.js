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
var id_column = "id";
var headers;
var rows;
var mqlProps;
var mqlMetadataReady = false;

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

function setReconciliationURL() {
    if (window.location.href.substring(0,4) == "file") {
        reconciliation_url = "http://www.mqlx.com/reconciliation/";
        return;
    }
    var url_parts = window.location.href.split("/");
    url_parts.pop();
    reconciliation_url = url_parts.join("/") + "/";
}

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
    if (!contains(headers, "id") && !contains(headers, "/type/object/id"))
        headers.push(id_column);
    else if (contains(headers, "/type/object/id"))
        id_column = "/type/object/id"
    
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
        
        rows.push(row);
    }
}

function spreadsheetParsed() {
    function isUnreconciled(row) {
        return contains([undefined,null,"indeterminate",""], row[id_column]);
    }
    totalRecords = rows.length;
    automaticQueue = $.grep(rows,isUnreconciled);
    fetchMQLPropMetadata();
}

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

function autoReconcileResults(results) {
    var currentRow = automaticQueue.shift();
    // no results, set to None:
    if(results.length == 0)
        currentRow[id_column] = "None";
    // match found:
    else if(results[0]["match"] == true) {
        currentRow[id_column] = results[0]["id"];
    }
    else {
        manualQueue.push([currentRow, results]);
        if (manualQueue.length == 1)
            manualReconcile();
    }
    autoReconcile();
}

function getCandidates(row, callback) {
    var query = {}
    for(var i = 0; i < headers.length - 1; i++) {
        var prop = headers[i];
        var value = row[prop];
        if (value != undefined && value != null && value != "") {
            if(query[prop] == undefined)
                query[prop] = [];
            query[prop] = query[prop].concat($.makeArray(value));
        }
    }
    $.getJSON(reconciliation_url + "query?jsonp=?", {q:JSON.stringify(query), limit:4}, callback);
}

function manualReconcile() {
    var currentRecon = manualQueue[0];
    if(currentRecon != undefined) {
        $(".manualQueueEmpty").hide();
        $(".manualReconciliation").show();
        prefetchImages(manualQueue[1]);
        renderReconChoices(currentRecon[1], currentRecon[0]);
    }
    else{
        $(".manualQueueEmpty").show();
        $(".manualReconciliation").hide();
    }
}

function prefetchImages(pair) {
    if (pair === undefined) return;
    var reconResults = pair[1];
    var body = $("body");
    for (var i = 0; i < reconResults.length; i++)
        node("img",{src:imageURLForID(reconResults[i]['id']), "class":"invisible"}).appendTo(body);
}

function fetchMQLPropMetadata() {
    function getQuery(propID) {
        return {
              "/type/property/expected_type" : [
                {
                  "extends" : [],
                  "id" : null
                }
              ],
              "/type/property/reverse_property" : [],
              "id" : propID
        };
    }
    var envelope = {};
    for (var i = 0; i < mqlProps.length; i++)
        envelope["q" + i] = {"query": getQuery(mqlProps[i])};
    console.log(envelope);
    $.getJSON(freebase_url + "/api/service/mqlread?callback=?&", {queries:JSON.stringify(envelope)}, handleMQLPropMetadata);
}

function handleMQLPropMetadata(results) {
    console.log(results);
}

function contains(array, value) {
    for(var i = 0; i < array.length; i++)
        if (array[i] == value)
            return true;
    return false;
}

function imageURLForID(idName) {
    return freebase_url + "/api/trans/image_thumb/"+idName+"?maxwidth=100&maxheight=100";
}

function idToClass(idName) {
    return idName.replace(/\//g,"_");
}

function renderReconChoices(results, row) {    
    var currentRecord = $("#recordVals").empty();
    for(var i = 0; i < headers.length; i++){
        currentRecord.append(node("label", headers[i] + ":", {"for":idToClass(headers[i])}));
        currentRecord.append(node("div",row[headers[i]]));
    }
    var tableHeader = $(".reconciliationCandidates table thead").empty();
    var columnHeaders = ["","Image","Names","Types"].concat(mqlProps).concat(["Score"]);
    for (var i = 0; i < columnHeaders.length; i++)
        tableHeader.append(node("th",columnHeaders[i]));
    
    var tableBody = $(".reconciliationCandidates table tbody").empty();
    for (var i = 0; i < results.length; i++)
        tableBody.append(renderCandidate(results[i]));

    $('.reconciliationCandidates table tbody tr:odd').addClass('odd');
    $('.reconciliationCandidates table tbody tr:even').addClass('even');
     
    fetchMqlProps(results);
}

function renderCandidate(result) {
    var url = freebase_url + "/view/" + result['id'];
    var row = node("tr", {"class":idToClass(result["id"])});
    
    var button = node("button", "Select", 
       {"class":'manualSelection', 
        "onclick":function() {handleReconChoice(result["id"])}})
    row.append(node("td",button));
    
    node("td",
         node("img",{src:imageURLForID(result['id'])})
    ).appendTo(row);
    
    var names = node("td").appendTo(row);
    for(var j = 0; j < result["name"].length; j++) {
        names.append(node("a",result["name"][j], {target:"_blank", href:url})).append(node("br"));
    }
    
    row.append(node("td",result["type"].join("<br/>")));
    
    for(var j = 0; j < mqlProps.length; j++)
        row.append(
            node("td", 
                node("img",{src:"spinner.gif"}),
                {"class":"replaceme "+idToClass(mqlProps[j])})
        );
    row.append(node("td",result["score"]));
    return row;
}

function fetchMqlProps(results) {
    for (var i = 0; i < results.length; i++) {
        var result = results[i];
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
                     ]
                    };
        var envelope = {query:query};
        $.getJSON(freebase_url + "/api/service/mqlread?callback=?&", {query:JSON.stringify(envelope)}, fillInMQLProps);
    }
}

function fillInMQLProps(mqlResult) {
    if (mqlResult["code"] != "/api/status/ok" || mqlResult["result"] == null) {
        //don't show annoying loading symbols indefinitely if there's an error
        $(".replaceme").html("");
        return;
    }

    var result = mqlResult["result"];
    var selector = "tr." + idToClass(result["id"]);
    var row = $(selector);
    $(selector + " .replaceme").html("");
    
    var props = result["/type/reflect/any_master"].concat(
                result["/type/reflect/any_value"]);
    for (var i = 0; i < props.length; i++) {
        var prop = props[i];
        var cell = row.children("td." + idToClass(prop["link"]));
        if (prop["value"] != undefined)
            cell.html(cell.html() + prop["value"] + " <br/>");
        else
            cell.html(cell.html() + "<a target='_blank' href='"+freebase_url+"/view"+prop["id"]+"'>" + prop["name"] + "</a><br/>")
    }
}

function handleReconChoice(id) {
    if (id != undefined)
        manualQueue[0][0][id_column] = id;
    manualQueue.shift();
    updateUnreconciledCount();
    manualReconcile();
}


function updateUnreconciledCount() {
    var pctProgress = (((totalRecords - automaticQueue.length) / totalRecords) * 100);
    $("#progressbar").progressbar("value", pctProgress);
    $("#progressbar label").html(pctProgress.toFixed(1) + "%")
    $(".manual_count").html("("+manualQueue.length+")");
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

function clone(obj) {
    var copy = {};
    for (var i in obj)
        copy[i] = obj[i];
    return copy;
}
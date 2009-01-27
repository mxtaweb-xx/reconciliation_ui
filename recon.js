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
var remainingAutoRec = 0;

var manualQueue = [];
var freebase_url = "http://www.freebase.com/"
var reconciliation_url = "";
var id_column = "id";
var headers;
var rows;
var mqlProps;

var currentRow = null;
var spreadSheetData = null;
var spreadSheetTable;
var currentReconRowId = -1;


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
            return spreadsheet[position] == undefined 
                || spreadsheet[position] == "\n" 
                || (  spreadsheet[position] == '\r' 
                   && spreadsheet[position+1] == "\n")
        }
        //If this gives me any more trouble, I'm just doing a state machine
        while(true) {
            var c = spreadsheet[position];
            if (inQuotes){
                //quotes are quoted with two adjacent quotes
                if (c == '"' && spreadsheet[position+1] == '"'){
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
            if (spreadsheet[position] == '"'){
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

        
    var id_column_num = headers.indexOf(id_column);
    rows = [];
    while(spreadsheet[position] != undefined){
        var row = parseLine();
        //displaying "undefined" is ugly, empty string is better
        row[id_column_num] = row[id_column_num] || "";
        rows.push(row);
    }
}

function renderSpreadsheet() {
    function encodeLine(arr) {
        var values = [];
        for(var i = 0; i < arr.length; i++){
            var val = arr[i];
            val.replace(/"/g, '""');
            values.push('"' + val + '"');
        }
        return values.join("\t");
    }
    var lines = [];
    lines.push(encodeLine(headers));
    for (var i = 0; i < rows.length; i++)
        lines.push(encodeLine(rows[i]));

    $("#outputSpreadSheet")[0].value = lines.join("\n");
}

var autoReconciling = false;
function beginAutoReconciliation() {
    if (autoReconciling) return;
    beginningAutoReconcile();
    autoReconcile();
}

function beginningAutoReconcile() {
    stopReconciling = false;
    autoReconciling = true;
    $(".nowReconciling").show();
    $(".notReconciling").hide();
}

function finishedAutoReconciling() {
    autoReconciling = false;
    $(".nowReconciling").hide();
    $('.notReconciling').show();
}

var stopReconciling = false;
function stopReconciliation() {
    stopReconciling = true;
    $('.nowReconciling').hide();
    $('.notReconciling').show();
}

function autoReconcile() {    
    currentRow = getNextAutoReconRow();
    if(currentRow == null) {
        finishedAutoReconciling();
        return;
    }
    getCandidates(currentRow, autoReconcileResults);
}

function autoReconcileResults(results) {
    // no results, set to None:
    if(results.length == 0) {
        setId(currentRow, "None");
    }
    // match found:
    else if(results[0]["match"] == true) {
        setId(currentRow, results[0]["id"]);
    }
    else {
        manualQueue.push([currentRow, results]);
        if (manualQueue.length == 1)
            manualReconcile();
    }
    remainingAutoRec--;
    currentRow = null;
    if (stopReconciling) {
        finishedAutoReconciling();
        return;
    }
    autoReconcile();
}

function getNextAutoReconRow() {
    // we've walked the list, terminate:
    if(currentReconRowId >= rows.length) {
        currentRowId = -1;
        return null;
    }
    
    // we're just starting out:
    if(currentReconRowId < 0) 
        currentReconRowId = 0;
    // skip already reconciled stuff:
    while(currentReconRowId < rows.length && !isUnreconciled(rows[currentReconRowId])) {
        remainingAutoRec--;
        currentReconRowId++;
    }
    updateUnreconciledCount();
    if(currentReconRowId >= rows.length)
        return null;

    currentReconRowId++;
    return rows[currentReconRowId-1];;
}

function getCandidates(row, callback) {
    var query = {}
    for(var i = 0; i < headers.length - 1; i++) {
        var prop = headers[i];
        var value = row[i];
        if(!(value == undefined || value == null || value == "")) {
            if(!(prop in query)) query[prop] = [];
            var values = query[prop];
            values[values.length] = value;
        }
    }
    $.getJSON(reconciliation_url + "query?jsonp=?", {q:JSON.stringify(query), limit:4}, callback);
}

function manualReconcile() {
    
    var currentRecon = manualQueue[0];
    if(currentRecon != undefined) {
        $(".manualQueueEmpty").hide();
        currentManualReconRow = currentRecon[0];
        renderReconChoices(currentRecon[1]);
    }
    else
        $(".manualQueueEmpty").show();
}

function getFirstUnreconRow() {
    if (rows != null) {
        for(var i = 0; i < rows.length; i++)
            if(isUnreconciled(rows[i]))
                return rows[i];
    }
    return null;
}

function contains(array, value) {
    for(var i = 0; i < array.length; i++)
        if (array[i] == value)
            return true;
    return false;
}

function idToClass(idName) {
    return idName.replace(/\//g,"_")
}

function renderReconChoices(results) {    
    var html = "";
    
    html = '<div class="currentRecord"><h4>Current Record:</h4>';
    for(var i = 0; i < headers.length; i++)
        html += '<label for=' + idToClass(headers[i]) + ">" + headers[i] + ":</label><div>" + currentManualReconRow[i] + '</div>';
    html += '</div><div class="reconciliationCandidates">';
    
        
    html += "<h4>Select one of these Freebase topics:</h4>";
    html += "<table class='manualReconciliationChoices'><thead>";
    var columnHeaders = ["","Image","Names","Types"].concat(mqlProps).concat(["Score"]);
    for (var i = 0; i < columnHeaders.length; i++)
        html += "<th>" + columnHeaders[i] + "</th>";
    html += "</thead><tbody>";
    
    for (var i = 0; i < results.length; i++)
        html += renderCandidate(results[i]);
    html += "</tbody></table>";
    html += "<h4>Or:</h4>";
    html += '<button class="skipButton" onclick="handleReconChoice()">Skip This Item</button>';
    html += ' | <label class="findItem" for="find_topic">Search For Another Topic:</label><input type="text" name="find_topic" id="find_topic"></div>';
    html += "<div class='clear'></div>";
    
    $('#reconcileDiv').html(html);
    $("#find_topic")
      .freebaseSuggest()
      .bind("fb-select", function(e, data) { 
        handleReconChoice(data.id);
      });
    
    $('.reconciliationCandidates table tbody tr:odd').addClass('odd');
    $('.reconciliationCandidates table tbody tr:even').addClass('even');
     
    fetchMqlProps(results);
}

function renderCandidate(result) {
    var url = freebase_url + "/view/" + result['id'];
    var html = "<tr class='"+idToClass(result["id"]) + "'>";
    html += '<td><button class=\'manualSelection\' onclick="handleReconChoice(\'' + result['id'] + '\')">Select</button></td>'
    html += "<td><img src='"+freebase_url+"/api/trans/image_thumb/"+result['id']+"?maxwidth=100&maxheight=100'></td>";
    html += "<td>";
    for(var j = 0; j < result["name"].length; j++) html += "<a target='_blank' href='"+url+"'>" + result["name"][j] + "</a><br/>";
    html += "</td><td>";
    for(var j = 0; j < result["type"].length; j++) html += result["type"][j] + "<br/>";
    for(var j = 0; j < mqlProps.length; j++) html += "</td><td class='replaceme "+idToClass(mqlProps[j])+"'><img src='spinner.gif'>";
    html += "</td><td>" + result["score"] + "</td></tr>";
    return html;
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
    manualQueue.shift();
    if (id != undefined)
        setId(currentManualReconRow, id);
    currentManualReconRow = null;
    $('#reconcileDiv').html("");
    $("#additionalReconcile").hide();
    manualReconcile();
}

function isUnreconciled(row) {
    var id = row[headers.indexOf(id_column)];
    return id == undefined || id == null || id == "indeterminate" || id == "";
}

function setId(row, id) {
    row[headers.indexOf(id_column)] = id;
    spreadSheetTable.fnDraw();
    updateUnreconciledCount();
}

function updateUnreconciledCount() {
    $("#progressbar").reportprogress((((totalRecords - remainingAutoRec) / totalRecords) * 100));
    $(".manual_count").html("("+manualQueue.length+")");
}

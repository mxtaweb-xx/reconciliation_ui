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
var mqlProps;
var mqlMetadata = {};
var headers;
var rows;
var complexHeaders;
var simpleHeaders;

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
            switch(spreadsheet.charAt(position)){
              case "": 
              case "\n": return true;
              case "\r": if (spreadsheet.charAt(position+1) == "\n") {
                            position++; return true;                            
                         }
              default: return false;
            }
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
                
                if (c == ""){
                    console.error("unexpected end of input, no closing double-quote marks found");
                    fields.push(field);
                    position+=1;
                    return fields;
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
    
    var part = partition(headers, function(header) {return charIn(header,":");});
    complexHeaders = part[0];
    simpleHeaders = part[1];
    
    mqlProps = filter(headers, function(header) {
        if (header.charAt(0) !== "/")
            return false;
        var invalidList = ["/type/object/name","/type/object/type","/type/object/id",/(^|:)id$/];
        for (var i = 0; i<invalidList.length; i++){
            if (header.match(invalidList[i]))
                return false;
        }
        return true;
    });
    rows = [];
    var rowHeaders  = simpleHeaders.slice();
    var rowMqlProps = mqlProps.slice();
    while(spreadsheet.charAt(position) != ""){
        var rowArray = parseLine();
        var entity = newEntity({"/rec_ui/headers": rowHeaders,
                                "/rec_ui/mql_props": rowMqlProps});
        for (var i=0; i < headers.length; i++){
            var val = rowArray[i];
            if (rowArray[i] === "")
                val = undefined;
            entity[headers[i]] = [val];
        }   
        rows.push(entity);
    }
}

function combineRows() {
    var rowIndex = undefined;
    while(rowIndex = getAmbiguousRowIndex(rowIndex)) {
        var mergeRow = rows[rowIndex];
        var i;
        for (i = rowIndex+1; i < rows.length && rows[i][headers[0]][0] == undefined;i++) {
            for (var j = 0; j<headers.length; j++) {
                var col = headers[j];
                mergeRow[col].push(rows[i][col][0]);
            }
        }
        //remove the rows that we've combined in
        rows.splice(rowIndex+1, (i - rowIndex) - 1);
    }
}

/*
*  Starting at `from+1`, look for the first row that has an entry in the
*  first column which is followed by a row without an entry in the first
*  column.
*/
function getAmbiguousRowIndex(from) {
    if (from == undefined)
        from = -1;
    from++;

    var startingRowIdx;
    for(var i = from; i < rows.length; i++) {
        if (rows[i][headers[0]][0] != "" && rows[i][headers[0]][0] != undefined)
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
    function getQuery(prop) {
        return {
            "expected_type" : {
                "extends" : [],
                "id" : null
            },
            "reverse_property" : null,
            "type" : "/type/property",
            "id" : prop
        }
    }
    var envelope = {};
    $.each(mqlProps, function(i, mqlProp) {
        $.each(mqlProp.split(":"), function(i, simpleProp) {
            envelope[simpleProp.replace(/\//g,'Z')] = {"query": getQuery(simpleProp)};
        })
    })
    console.log(envelope);
    function handler(results) {
        handleMQLPropMetadata(results);
        callback();
    }
    $.getJSON(freebase_url + "/api/service/mqlread?callback=?&", {queries:JSON.stringify(envelope)}, handler);
}

function handleMQLPropMetadata(results) {
    console.assert(results.code == "/api/status/ok", results);    
    $.each(mqlProps, function(_,complexProp){
        var partsSoFar = [];
        $.each(complexProp.split(":"), function(_, mqlProp) {
            var result = results[mqlProp.replace(/\//g,'Z')];
            partsSoFar.push(mqlProp);
            if (result.code != "/api/status/ok"){
                console.error(result);
                return
            }
            result = result.result;
            mqlMetadata[result['id']] = result;
            if (!isValueType(result.expected_type) && !contains(headers,result.id + ":id" ))
//                 insertAfter(headers, result.id, result.id + ":id");
                headers.push(partsSoFar.join(":") + ":id");
            if (mqlMetadata[result.expected_type] == undefined)
                mqlMetadata[result.expected_type] = {reverse_property: result.id};
        });
    })
    objectifyRows();
    $(".initialLoadingMessage").hide();
}

function objectifyRows() {
    $.each(rows, function(_,row) {
        for (var prop in row) {
            function objectifyRowProperty(value) {
                var result = newEntity({'/type/object/name':row[meta.id],
                              '/type/object/type':meta.expected_type.id,
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
        $.each(complexHeaders, function(_,complexHeader) {
            var valueArray = row[complexHeader];
            var parts = complexHeader.split(":");
            var slot;
            function cvtEntity(meta, parent) {
                var cvt = newEntity({"/type/object/type":meta.expected_type.id,
                                     "/rec_ui/is_cvt":true});
                if (meta.reverse_property != null)
                    cvt[meta.reverse_property] = parent;
                return cvt;
            }
            var firstPart = parts[0];
            $.each(valueArray, function(i,value) {
                if (value === undefined)
                    return; //read as continue
                var cvt = cvtEntity(mqlMetadata[firstPart], row);
                if (firstPart in row){
                    if (row[firstPart][i] === undefined)
                        row[firstPart][i] = cvt;
                    else
                        cvt = row[firstPart][i];
                }
                else
                    row[firstPart] = [cvt];
                slot = cvt;
                $.each(parts.slice(1,parts.length-1), function(_,part) {
                    if (!part in slot)
                        slot[part] = cvtEntity(mqlMetadata[part], slot);
                    slot = slot[part];
                });
                var lastPart = parts[parts.length-1];
                var meta = mqlMetadata[lastPart];
                if (meta === undefined)
                    return; //if we don't know what it is, leave it as it is
                if (isValueType(meta.expected_type))
                    slot[lastPart] = value;
                else
                    slot[lastPart] = newEntity({"/type/object/type":meta.expected_type.id,
                                                "/type/object/name":value})
                slot[parts[parts.length-1]] = value;
            });
            delete row[complexHeader];
        });
        
        /* Recursively removes undefined objects from arrays anywhere in an object.
            Also, collapses singleton lists to single objects, to work around a bug in
            the reconciliation service.
            Supports self referential objects (though not self referential arrays)*/
        function cleanup(obj, closed) {
            if (closed === undefined) closed = {};
            if (closed[obj])
                return obj; //already processed this object
            if (typeof(obj) === "String")
                return obj
            else if (obj === undefined)
                return obj
            else if ($.isArray(obj)) {
                var arr = filter(obj, function(val){return val !== undefined});
                if (arr.length === 1)
                    return cleanup(arr[0], closed);
                else
                    return $.map(arr, function (val) {return cleanup(val,closed);});
            }
            closed[obj] = true;
            for (var key in obj){
                obj[key] = cleanup(obj[key], closed);
                if (obj[key] == undefined || ($.isArray(obj[key]) && obj[key].length == 0))
                    delete obj[key];
            }
            return obj
        }
        cleanup(row);
    });
}

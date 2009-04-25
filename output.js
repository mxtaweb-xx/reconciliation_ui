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
            if ($.isArray(slot[part]))
                slot = slot[part][0];
            else
                slot = slot[part];
        });
        return slot[parts[parts.length-1]];
    }
    function encodeRow(row) {
        var lines = [[]];
        for (var i = 0; i < headers.length; i++){
            var val = getNestedVal(row, headers[i]);
            if ($.isArray(val)) {
                for (var j = 0; j < val.length; j++) {
                    if (lines[j] == undefined) lines[j] = [];
                    lines[j][i] = textValue(val[j]);
                }
            }
            else
                lines[0][i] = textValue(val);
        }
        return $.map(lines,encodeLine);
    }
    var lines = [];
    lines.push(encodeLine(headers));
    for (var i = 0; i < rows.length; i++)
        lines = lines.concat(encodeRow(rows[i]));

    $("#outputSpreadSheet")[0].value = lines.join("\n");
    triples = getTriples(rows);
    $(".triple_count").html(triples.length)
}

var triples;
function getTriples(rows) {
    var triples = [];
    function isValidID(id) {
        if ($.isArray(id))
            id = id[0];
        return id !== undefined && id !== "None" && $.trim(id) !== "";
    }
    $.each(rows, function(_,subject) {
        if (!isValidID(subject.id)) {
//             console.log("subject blank - " + subject['/rec_ui/id']);
            return;
        }
        $.each(subject['/rec_ui/mql_props'], function(_, predicate) {
            $.each($.makeArray(subject[predicate]), function(_, object) {
                if  (isValueType(mqlMetadata[predicate].expected_type) || !isValidID(object.id)) {
//                    console.log("object blank or value - " + predicate + " " + subject['/rec_ui/id']);
                   return;
                }

                triples.push(subject.id + " " + predicate + " " + object.id);
            })
        });
    });
    return triples;
}

var uploadResult;
function freeqWrite() {
    var payload = triples.join("\n")
    var freeq_server = "http://oat.corp:8080/"
    var freeq_instance = "test"

    var params = { 'action_type': 'LOAD_TRIPLE',
                   'graphport': 'graph01.sandbox.sjc1:8100',
                   //'user': '/user/spreadsheet_bot',
                   'user': '/user/mw_autobot',
                   'operator': '/user/rictic',
                   'comments': 'testing reconciliation ui spreadsheet loader',
                   'payload': payload
                 }
    $(".uploadingTriples").show();
    $.post(freeq_server + freeq_instance, params, function(data, type) {
        var message;
        if (data.status.code !== 200) {
            console.error(data);
            message = "There was an error with your upload.";
        }
        else{
            uploadResult = data.result;
            message = "Your data is being entered into freebase now.  <a href='" + data.result.status_url + "' target='_blank'>Click here</a> to see the status of your upload.";
        }
        $(".tripleStatus").html(message);
        $(".uploadingTriples").hide();
    }, "json");
}

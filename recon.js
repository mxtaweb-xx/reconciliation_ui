var totalRecords = 0;
var remainingAutoRec = 0;

var manualQueueSize = 0;
var freebase_url = "http://www.freebase.com/"
var reconciliation_url = "";

function setReconciliationURL()
{
    if (window.location.href.substring(0,4) == "file")
    {
        reconciliation_url = "http://www.mqlx.com/reconciliation/";
        return;
    }
    var url_parts = window.location.href.split("/");
    url_parts.pop();
    reconciliation_url = url_parts.join("/") + "/";
}

function parseSpreadsheet(spreadsheet)
{
    var lines = spreadsheet.split("\n");
    var columns = [];
    var data = [];
    totalRecords = lines.length - 1;
    remainingAutoRec = totalRecords;
    for(var i = 0; i < lines.length; i++)
    {
        var fields = lines[i].split("\t");
        if(i == 0)
        {
            for(var j = 0; j < fields.length; j++)
            {
                columns[j] = {"sTitle":fields[j]};
            }
        }
        else
        {
            if(fields.length != columns.length) break;
            fields[fields.length] = ""
            data[i - 1] = fields;
        }
    }
    columns[columns.length] = {"sTitle":"id"}
    return {"aoColumns":columns, "aaData":data}
}

function renderSpreadsheet()
{
    if(spreadSheetData != null)
    {
        var ret = "";
        var columns = spreadSheetData["aoColumns"];
        for(var i = 0; i < columns.length; i++)
        {
            ret += columns[i]["sTitle"];
            if(i < columns.length) ret += "\t";
        }
        ret += "\n";
        var rows = spreadSheetData["aaData"];
        for(var i = 0; i < rows.length; i++)
        {
            var row = rows[i];
            for(var j = 0; j < row.length; j++)
            {
                ret += row[j];
                if(j < row.length) ret += "\t";
            }
            ret += "\n";
        }
        $("#outputSpreadSheet")[0].value = ret;
    }
}

var autoReconciling = false;
function beginAutoReconciliation()
{
    if (autoReconciling) return;
    beginningAutoReconcile();
    autoReconcile();
}

function beginningAutoReconcile()
{
    stopReconciling = false;
    autoReconciling = true;
    $(".nowReconciling").show();
    $(".notReconciling").hide();
}

function finishedAutoReconciling()
{
    autoReconciling = false;
    $(".nowReconciling").hide();
    $('.notReconciling').show();
}

var stopReconciling = false;
function stopReconciliation()
{
    stopReconciling = true;
    $('.nowReconciling').hide();
    $('.notReconciling').show();
}

function autoReconcile()
{    
    currentRow = getNextAutoReconRow();
    if(currentRow == null)
    {
        finishedAutoReconciling();
        return;
    }
    getCandidates(currentRow, autoReconcileResults);
}

function autoReconcileResults(results)
{
    // no results, set to None:
    if(results.length == 0)
    {
        setId(currentRow, "None");
    }
    // match found:
    else if(results[0]["match"] == true)
    {
        setId(currentRow, results[0]["id"]);
    }
    else 
    {
        setId(currentRow, "indeterminate");
        manualQueueSize += 1;
    }
    remainingAutoRec -= 1;
    currentRow = null;
    if (stopReconciling) 
    {
        finishedAutoReconciling();
        return;
    }
    autoReconcile();
}

function getNextAutoReconRow()
{
    var rows = spreadSheetData["aaData"]
    // we've walked the list, terminate:
    if(currentReconRowId >= rows.length)
    {
        currentRowId = -1;
        return null;
    }
    // we're just starting out:
    if(currentReconRowId < 0) currentReconRowId = 0;
    // skip already reconciled stuff:
    while(currentReconRowId < rows.length && !isUnreconciled(rows[currentReconRowId])) currentReconRowId++;
    if(currentReconRowId < rows.length)
    {
        var ret = rows[currentReconRowId];
        currentReconRowId++;
        return ret;
    }
    else return null;
}

function getCandidates(row, callback)
{
    var query = {}
    var props = getProps();
    for(var i = 0; i < props.length - 1; i++)
    {
        var prop = props[i];
        var value = row[i];
        if(!(value == undefined || value == null || value == ""))
        {
            if(!(prop in query)) query[prop] = [];
            var values = query[prop];
            values[values.length] = value;
        }
    }
    $.getJSON(reconciliation_url + "query?jsonp=?", {q:JSON.stringify(query), limit:5}, callback);
}

function manualReconcile()
{
    currentManualReconRow = getFirstUnreconRow();
    if(currentManualReconRow != null)
    {
        getCandidates(currentManualReconRow, renderReconChoices)
    }
}

function getFirstUnreconRow()
{
    if(spreadSheetData != null)
    {
        var rows = spreadSheetData["aaData"];
        for(var i = 0; i < rows.length; i++)
        {
            var row = rows[i];
            if(isUnreconciled(row)) return row;
        }
    }
    return null;
}

function contains(array, value)
{
    for(var i = 0; i < array.length; i++)
        if (array[i] == value)
            return true;
    return false;
}

function renderReconChoices(results)
{
    $('#reconcileDiv').empty();
    var html = "";
    html = '<b>Current Record:</b><br/><table class="display currentRecord"><thead><tr>';

    var props = getProps();
    for(var i = 0; i < props.length; i++) 
        html += '<th>' + props[i] + '</th>';
    html += '</tr></thead><tbody><tr>';

    for(var i = 0; i < currentManualReconRow.length; i++)
        html += '<td>' + currentManualReconRow[i] + '</td>';
    html += '</tr></tbody></table><p/>';
    
    
    html += "<b>Candidates:</b><br/>";
    html += "<table class='display manualReconciliationChoices'><thead>";
    
    var mqlProps = getMqlProps();
    
    var headers = ["","Image","Names","Types"].concat(mqlProps).concat(["Score"]);
    for (var i = 0; i < headers.length; i++)
        html += "<th>" + headers[i] + "</th>";
    html += "</thead><tbody>";
    
    for (var i = 0; i < results.length; i++) {
        var result = results[i];
        var url = freebase_url + "/view/" + result['id'];
        
        
        html += "<tr class='"+result["id"].replace(/\//g,"_") + " " + ["even","odd"][i % 2] +"'>";
        html += '<td><button class=\'manualSelection\' onclick="handleReconChoice(\'' + result['id'] + '\')">Select</button></td>'
        html += "<td><img src='"+freebase_url+"/api/trans/image_thumb/"+result['id']+"?maxwidth=100&maxheight=100'></td>";
        html += "<td><a target='_blank' href='"+url+"'>";
        for(var j = 0; j < result["name"].length; j++) html += result["name"][j] + "<br/>";
        html += "</a></td><td>";
        for(var j = 0; j < result["type"].length; j++) html += result["type"][j] + "<br/>";
        for(var j = 0; j < mqlProps.length; j++) html += "</td><td class='"+mqlProps[j].replace(/\//g,"_")+"'>";
        html += "</td><td>" + result["score"] + "</td></tr>";
    }
    html += "</tbody></table>";
    html += '<button onclick="handleReconChoice(\'None\')">Skip Record</button>';

    $('#reconcileDiv').html(html);
    $("#additionalReconcile").show();
    
    for (var i = 0; i < results.length; i++) 
    {
        var result = results[i];
        var query = {id:result["id"]};
        for (var j = 0; j < mqlProps.length; j++)
            query[mqlProps[j]] = [{"id":null, "name":null}];
        var envelope = {query:query};
        $.getJSON(freebase_url + "/api/service/mqlread?callback=?&", {query:JSON.stringify(envelope)}, fillInMQLProps);
    }
}

function handleReconChoice(id)
{
    if (currentManualReconRow[currentManualReconRow.length-1] == "indeterminate")
        manualQueueSize -= 1;
        
    setId(currentManualReconRow, id);
    currentManualReconRow = null;
    $('#reconcileDiv').html("Loading...");
    $("#additionalReconcile").hide();
    manualReconcile();
}

function fillInMQLProps(mqlResult, status)
{
    var mqlProps = getMqlProps();
    if (mqlResult["code"] == "/api/status/ok" && mqlResult["result"] != null) 
    {
        var result = mqlResult["result"];
        var row = $("tr." + result["id"].replace(/\//g,"_"));
        for (var i = 0; i < mqlProps.length; i++)
        {
            var props = result[mqlProps[i]];
            var propHTML = "";
            
            for (var j = 0; j < props.length; j++)
            {
                propHTML = "<a target='_blank' href='"+freebase_url+"/view" + props[j]["id"] + "'>" + props[j]["name"] + "</a><br/>";
            }
            row.children("td." + mqlProps[i].replace(/\//g,"_")).html(propHTML);
        }
    }
}

function getProps()
{
    var props = [];
    for(var i = 0; i < spreadSheetData["aoColumns"].length; i++) props[i] = spreadSheetData["aoColumns"][i]["sTitle"];
    return props;
}

function getMqlProps()
{
    var props = getProps();
    var mqlProps = [];
    for(var i =0; i < props.length; i++)
        if (!contains(["/type/object/name","/type/object/type","id"], props[i]))
            mqlProps.push(props[i]);
    return mqlProps;
}

function isUnreconciled(row)
{
    var id = row[row.length - 1];
    return id == undefined || id == null || id == "indeterminate" || id == "";
}

function setId(row, id)
{
    row[row.length - 1] = id;
    spreadSheetTable.fnDraw();
    updateUnreconciledCount();
}

function updateUnreconciledCount()
{
    $("#progressbar").reportprogress((((totalRecords - remainingAutoRec) / totalRecords) * 100));
    $(".manual_count").html("("+manualQueueSize+")");
}

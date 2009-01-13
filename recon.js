
function parseSpreadsheet(spreadsheet)
{
    var lines = spreadsheet.split("\n");
    var columns = [];
    var data = [];
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
    autoReconciling = true;
    $(".nowReconciling").show();
    $(".notReconciling").hide();
}

function finishedAutoReconciling()
{
    autoReconciling = false;
    $('.stoppingReconciliation').hide();
    $(".nowReconciling").hide();
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
    getCandidates(getProps(), currentRow, autoReconcileResults)
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
    currentRow = null;
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

function getCandidates(props, row, callback)
{
    var query = {}
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
    $.post("query", {"q":JSON.stringify(query), "limit":50}, callback, "json")
}

function manualReconcile()
{
    currentManualReconRow = getFirstUnreconRow();
    if(currentManualReconRow != null)
    {
        getCandidates(getProps(), currentManualReconRow, renderReconChoices)
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

function renderReconChoices(results)
{
    var columns = [{"sTitle":""}, {"sTitle":"Score", "sType":"numeric"}, {"sTitle":"Names"}, {"sTitle":"Types"}, {"sTitle":"id"}]
    var data = []
    for(var i = 0; i < results.length; i++)
    {
        var result = results[i];
        var score = result["score"]
        var names = "";
        for(var j = 0; j < result["name"].length; j++) names += result["name"][j] + "<br/>";
        var types = "";
        for(var j = 0; j < result["type"].length; j++) types += result["type"][j] + "<br/>";
        var id = result["id"];
        var choice = '<button onclick="handleReconChoice(\'' + id + '\')">Select</button>'
        data[data.length] = [choice, score, names, types, id]
    }

    reconHtml = '<b>Current Record:</b><br/><table cellpadding="0" cellspacing="0" border="0" class="display" style="background-color: #E7EEF3"><thead><tr>';
    var props = getProps()
    
    for(var i = 0; i < props.length; i++) 
        reconHtml += '<th>' + props[i] + '</th>';
    reconHtml += '</tr></thead><tbody><tr>';
    
    for(var i = 0; i < currentManualReconRow.length; i++)
        reconHtml += '<td>' + currentManualReconRow[i] + '</td>';
    reconHtml += '</tr></tbody></table><p/>';

    reconHtml += '<b>Query Results:</b><br/><table cellpadding="0" cellspacing="0" border="0" class="display" id="reconTable"/><br/><button onclick="handleReconChoice(\'None\')">Skip Record</button>';

    $('#reconcileDiv').html(reconHtml);
    $('#reconTable').dataTable({"aoColumns":columns, "aaData":data, "bAutoWidth":false, "bSort":false});
    
    tabs.tabs("select", 1);
}

function handleReconChoice(id)
{
    setId(currentManualReconRow, id);
    currentManualReconRow = null;
    $('#reconcileDiv').html("");
    manualReconcile();
}

function getProps()
{
    var props = []
    for(var i = 0; i < spreadSheetData["aoColumns"].length; i++) props[i] = spreadSheetData["aoColumns"][i]["sTitle"];
    return props
}

function isUnreconciled(row)
{
    var id = row[row.length - 1];
    return id == undefined || id == null || id == "";
}

function setId(row, id)
{
    row[row.length - 1] = id;
    spreadSheetTable.fnDraw();
    updateUnreconciledCount();
}

function updateUnreconciledCount()
{
    var unreconciledCount = 0;
    if(spreadSheetData != null)
    {
        var rows = spreadSheetData["aaData"];
        for(var i = 0; i < rows.length; i++)
        {
            if(isUnreconciled(rows[i])) unreconciledCount++;
        }
    }
    $(".unreconciledCount").html("" + unreconciledCount + " unreconciled records")
}


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

function autoReconcile()
{
    currentRow = getNextAutoReconRow();
    if(currentRow != null)
    {
        getCandidates(getProps(), currentRow, autoReconcileResults)
    }
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
    for(var i = 0; i < props.length; i++) reconHtml += '<th>' + props[i] + '</th>';
    reconHtml += '</tr></thead><tbody><tr>';
    for(var i = 0; i < currentManualReconRow.length; i++) reconHtml += '<td>' + currentManualReconRow[i] + '</td>';
    reconHtml += '</tr></tbody></table><p/>';

    reconHtml += '<b>Query Results:</b><br/><table cellpadding="0" cellspacing="0" border="0" class="display" id="reconTable"/><br/><button onclick="handleReconChoice(\'None\')">Skip Record</button>';

    $('#reconcileDiv').html(reconHtml);
    $('#reconTable').dataTable({"aoColumns":columns, "aaData":data, "bAutoWidth":false, "bSort":false});
    tabs.tabs("select", 2);
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

var sampleData =
"/type/object/name	/type/object/type	/film/film/directed_by\n" +
"Stolen Kisses	/film/film	Francois Truffaut\n" +
"The Stoned Age	/film/film	James Melkonian\n" +
"Stonewall	/film/film	Nigel Finch\n" +
"Strange Days	/film/film	Kathryn Bigelow\n" +
"The Strange Love of Martha Ivers	/film/film	Lewis Milestone\n" +
"Straw Dogs	/film/film	Sam Peckinpah\n" +
"A Streetcar Named Desire	/film/film	Elia Kazan\n" +
"Stripes	/film/film	Ivan Reitman\n" +
"Stroker Ace	/film/film	Hal Needham\n" +
"Summertime	/film/film	David Lean\n" +
"Sunday in the Country	/film/film	Bertrand Tavernier\n" +
"Surviving the Game	/film/film	Ernest R. Dickerson\n" +
"Swashbuckler	/film/film	James Goldstone\n" +
"Sweet Dreams	/film/film	Karel Reisz\n" +
"Swingers	/film/film	Doug Liman\n" +
"Hard Eight	/film/film	Paul Thomas Anderson\n" +
"Take the Money and Run	/film/film	Woody Allen\n" +
"Tale of Two Sisters	/film/film	Adam Rifkin\n" +
"Tales from the Crypt: Demon Knight	/film/film	Ernest R. Dickerson\n" +
"Tampopo	/film/film	Juzo Itami\n" +
"Tango & Cash	/film/film	Andrei Konchalovsky\n" +
"Tequila Sunrise	/film/film	Robert Towne\n" +
"The Terminator	/film/film	James Cameron\n" +
"Terror of Mechagodzilla	/film/film	Ishiro Honda\n" +
"Tess of the Storm Country	/film/film	John S. Robertson\n" +
"Tetsuo 2: Body Hammer	/film/film	Shinya Tsukamoto\n" +
"Tetsuo: The Iron Man	/film/film	Shinya Tsukamoto\n" +
"They Might Be Giants	/film/film	Anthony Harvey\n" +
"The Thief of Bagdad	/film/film	Raoul Walsh\n" +
"The Thing	/film/film	John Carpenter\n" +
"Things to Do in Denver When You're Dead	/film/film	Gary Fleder\n" +
"This Sporting Life	/film/film	Lindsay Anderson\n" +
"The Thomas Crown Affair	/film/film	Norman Jewison\n" +
"Three Amigos	/film/film	John Landis\n" +
"Three Days of the Condor	/film/film	Sydney Pollack\n" +
"The Three Musketeers	/film/film	Stephen Herek\n" +
"Thunder Road	/film/film	Robert Mitchum\n" +
"Thunderball	/film/film	Terence Young\n" +
"Thunderheart	/film/film	Michael Apted\n" +
"Tiger Bay	/film/film	J. Lee Thompson\n" +
"Tim	/film/film	Michael Pate\n" +
"Timecop	/film/film	Peter Hyams\n" +
"Tin Cup	/film/film	Ron Shelton\n" +
"The Tingler	/film/film	William Castle\n" +
"To Die For	/film/film	Gus Van Sant\n" +
"Tokyo Fist	/film/film	Shinya Tsukamoto\n" +
"Tol'able David	/film/film	Henry King\n" +
"Tora! Tora! Tora!	/film/film	Kinji Fukasuka\n" +
"Tornado!	/film/film	Noel Nosseck\n";


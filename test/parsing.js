TestCase("ParsingTest",{
    testParseSimpleTSV: function() {
        var simpleTSV = "\
name\ttype\n\
Stevie Wonder\t/people/person\n\
\"Tabs '\t' Mcgee\"\t/people/person\n\
\"\"\"Weird Al\"\" Yankovic\"\t/people/person\n";
        var expectedRows = [
            ["name","type"],
            ["Stevie Wonder","/people/person"],
            ["Tabs '\t' Mcgee","/people/person"],
            ['"Weird Al" Yankovic',"/people/person"]
        ]
        expectAsserts(1);
        parseTSV(simpleTSV, function(rows){
            assertEq("rows",expectedRows,rows);
        });
    },
    testGetAmbiguousRowIndex: function() {
        headers = ["a","b","c"];
        rows = [{a:["a"],b:["b"],c:[3]},
                {a:["a2"]}];
        expectAsserts(1)
        getAmbiguousRowIndex(undefined, function(){fail("ambiguous row found in unambiguous data")},function(){assertTrue("success",true);});
    },
    testCombineRows: function() {
        headers = ["a","b","c"];
        rows = [{a:["a"],b:["b"],c:[3]},
                {a:[undefined],b:["b2"],c:[undefined]}];
        expectAsserts(1);
        combineRows(function(combinedRows) {
            assertEq("",[{"a":["a",null],"b":["b","b2"],"c":[3,null]}],rows);
        })
    }
});


TestCase("ParsingTest",{
    testParseSimpleTSV: function() {
        var simpleTSV = "\
name\ttype\n\
Stevie Wonder\t/people/person\n\
\"Tabs '\t' Mcgee\"\t/people/person\n\
\"\"\"Weird Al\"\" Yankovic\"\t/people/person\n";
        parseSpreadsheet(simpleTSV);
        
    }
});


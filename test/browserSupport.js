TestCase("BrowserSupportTest",{
    testStringIndexOf: function() {
        assertEquals(3,"abcd".indexOf('d'));
        assertEquals(-1,"abcd".indexOf('e'));
        assertEquals(3,"abcd abcd".indexOf('d'));
    }
});
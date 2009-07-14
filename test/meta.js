//define and test our testing helpers

function assertEq(msg, a1, a2) {
    assertEquals(typeof a1, typeof a2);
    if ($.isArray(a1) || $.isArray(a2)){
        $.each([a1,a2], function(_,a){
            assertTrue(msg + " expected an array but got " + a, $.isArray(a));
        })

        assertEquals(msg + " lengths of arrays were different.", a1.length, a2.length);
        for (var i = 0; i < a1.length; i++)
            assertEq(msg, a1[i], a2[i]);
        return;
    }
    if (typeof a1 != "object")
        return assertEquals(msg, a1, a2);
    
    if ("equals" in a1)
        return assertTrue(msg, a1.equals(a2));
    
    for (var prop in a1)
        assertEq(msg, a1[prop], a2[prop]);
    for (var prop in a2)
        assertEq(msg, a1[prop], a2[prop]);
}



TestCase("MetaTest",{
    testIntEq: function() {
        assertEq("one is one",1,1);
    },
    testStringEq: function() {
        assertEq("'a' is 'a'",'a','a');
    },
    testBooleanEq: function() {
        assertEq("true is true",true,true);
        assertEq("false is false",false,false);
    },
    testArrayEq: function() {
        assertEq("empty list is empty list",[],[]);
        assertEq("[1,2,3] is [1,2,3]",[1,2,3],[1,2,3]);
    },
    testObjEq:function() {
        assertEq("{} is {}",{},{});
        assertEq("{a:1} is {a:1}",{a:1},{a:1});
        assertEq("{a:[1,2,3]} is {a:[1,2,3]}",{a:[1,2,3]},{a:[1,2,3]});
    }
});


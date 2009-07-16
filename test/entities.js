TestCase("EntityTest",{
    testSimpleChainedPropertyAccess: function() {
        var e = newEntity({"a":1});
        assertEq("", getChainedProperty(e,'a'), [1]);
        e.a = [1,2]
        assertEq("", getChainedProperty(e,'a'), [1,2]);
        e.a = {};
        e.a.b = 3;
        assertEq("", getChainedProperty(e,'a:b'), [3]);
    },
    testComplexChainedPropertyAccess: function() {
        var e = newEntity({});
        e.a = [{b:1},{b:2}];
        assertEq("", getChainedProperty(e,'a:b'), [1,2]);
    },
    testUnreasonablyComplexChainedPropertyAccess: function() {
        var e = newEntity({});
        e.a = [{b:[{c:1},{c:2}]},{b:{c:3}}];
        assertEq("", getChainedProperty(e,'a:b:c'), [1,2,3]);
    }
});


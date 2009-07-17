
/* A simple database of all entities */
var entities;
var internalIDCounter;
function resetEntities() {
    entities = [];
    internalIDCounter = 0;
}
resetEntities();

function Entity(initialVals) {
    this["/rec_ui/id"] = internalIDCounter++
    entities[this["/rec_ui/id"]] = this;
    for (var key in initialVals)
        this[key] = initialVals[key];
}

Entity.prototype.getChainedProperty = function(prop) {
    return getChainedProperty(this,prop);
}

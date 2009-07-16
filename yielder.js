function time() {
    return new Date().valueOf();
}

function Yielder() {
    this.startTime = time();
    this.yield = function(continueFunction) {
        if (time() <= this.startTime + 100)
            return false;
        
        info("yielding to UI thread");
        this.startTime = time();
        this.nextAction = setTimeout(continueFunction, 0);
        return true;
    }
    this.cancel = function() {
        if (this.nextAction)
            clearTimeout(this.nextAction);
    }
    this.dispose = function() {
        this.cancel();
    }
}
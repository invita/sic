sic.object.sicEventBase = function(args)
{
    // Init
    var _p = this;
    this.events = {};

    // Settings
    this.enabled = sic.getArg(args, "enabled", true);

    // Implementation
    this.subscribe = function(eName, eFunction) {
        if (!_p.events[eName]) _p.events[eName] = {};
        var subscriptionId = _p.nextSubscriptionId();
        _p.events[eName][subscriptionId] = eFunction;
        return subscriptionId;
    };

    this.unsubscribe = function(eName, subscriptionId) {
        if (!_p.events[eName]) _p.events[eName] = [];
        if (_p.events[eName][subscriptionId]){
            delete _p.events[eName][subscriptionId];
        }
    };

    this.subscribeToAll = function(eFunction) {
        _p.subscribe("__all", eFunction);
    };

    this.trigger = function(eName, args){
        if (!this.enabled) return null;

        // always trigger subscribers to __all
        if (_p.events["__all"]) {
            for (var idx in _p.events["__all"]) {
                var f = _p.events["__all"][idx];
                f(eName, args);
            }
        }

        // trigger subscribers for eName
        if (!_p.events[eName]) return 0;
        for (var idx in _p.events[eName]){
            var f = _p.events[eName][idx];
            f(args);
        }
        return _p.events[eName].length;
    };

    this.eventHasSubscribers = function(eName){
        return (_p.events[eName] && Object.keys(_p.events[eName]).length > 0);
    };

    this.setEnabled = function(newEnabled){
        this.enabled = newEnabled;
    };

    this._lastSubscriptionId = 0;
    this.nextSubscriptionId = function(){
        _p._lastSubscriptionId += 1;
        return _p._lastSubscriptionId;
    };

    return this;
}

sic.widget.sicInputArray = function(args)
{
    // Init
    var _p = this;
    this._cons = sic.widget.sicElement;
    this._cons({parent: args.parent});

    this._eventb = sic.object.sicEventBase;
    this._eventb();

    this.selector.addClass("sicInputArray");
    this.inputs = [];

    // Settings
    this.name = sic.getArg(args, "name", null);
    this.caption = sic.getArg(args, "caption", null);
    this.inputArgs = sic.getArg(args, "inputArgs", {});
    this.inputConstruct = sic.getArg(args, "inputConstruct", sic.widget.sicInput);

    // Events
    this.onKeyDown = function(f) { _p.subscribe("onKeyDown", f); };
    this.onKeyPressed = function(f) { _p.subscribe("onKeyPressed", f); };
    this.onKeyUp = function(f) { _p.subscribe("onKeyUp", f); };

    // Implementation
    if (!this.name) this.name = sic.widget._nextInputId();
    if (this.caption === null) this.caption = sic.captionize(this.name);

    this.addInput = function(){
        var inputId = _p.inputs.length + "";
        var caption = _p.inputs.length > 0 ? " " : _p.caption;
        var input = new _p.inputConstruct(sic.mergeObjects(_p.inputArgs, { parent:_p.selector,
            name:_p.name+"_"+inputId, caption:caption }));
        input.onKeyDown(function(e) { e.sicInput = _p; _p.trigger('onKeyDown', e); });
        input.onKeyPressed(function(e) { e.sicInput = _p; _p.trigger('onKeyPressed', e); });
        input.onKeyUp(function(e) { e.sicInput = _p; _p.trigger('onKeyUp', e); });
        _p.inputs.push(input);
        return input;

    };

    this.getValue = function(){
        var result = [];
        for (var i in _p.inputs) result.push(_p.inputs[i].getValue());
        return result;
    };

    this.setValue = function(value){
        if (value && value.length > _p.inputs.length) {
            while (_p.inputs.length < value.length) _p.addInput();
        }
        for (var i in value) {
            if (_p.inputs[i]) _p.inputs[i].setValue(value[i]);
        }
    };

    this.calcModified = function(){
        for (var i in _p.inputs) _p.inputs[i].calcModified();
    };

    this.mainInput = this.addInput();

    this.delButton = new sic.widget.sicElement({ parent:this.mainInput.selector, tagName:"div" });
    this.delButton.selector.addClass("inputButton delButton").html("-");
    this.delButton.selector.click(function(e){
        if (_p.inputs.length > 1) {
            var delInput = _p.inputs[_p.inputs.length -1];
            delInput.selector.remove();
            _p.inputs.splice(_p.inputs.length -1, 1);
        }
    });
    this.addButton = new sic.widget.sicElement({ parent:this.mainInput.selector, tagName:"div" });
    this.addButton.selector.addClass("inputButton addButton").html("+");
    this.addButton.selector.click(function(e){
        var newInput = _p.addInput();
    });

}
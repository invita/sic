sic.widget.sicInputArray = function(args)
{
    // Init
    var _p = this;
    this._cons = sic.widget.sicElement;
    this._cons({parent: args.parent});

    this._eventb = sic.object.sicEventBase;
    this._eventb();

    this.selector.addClass("sicInputArray");
    this.inputs = {};
    this.tempDisableAutoFocus = true;

    // Settings
    this.name = sic.getArg(args, "name", null);
    this.caption = sic.getArg(args, "caption", null);
    this.inputArgs = sic.getArg(args, "inputArgs", {});
    this.autoFocus = sic.getArg(args, "autoFocus", true);
    this.withCode = sic.getArg(args, "withCode", null);
    this.inputConstruct = sic.getArg(args, "inputConstruct", sic.widget.sicInput);

    // Events
    this.onKeyDown = function(f) { _p.subscribe("onKeyDown", f); };
    this.onKeyPressed = function(f) { _p.subscribe("onKeyPressed", f); };
    this.onKeyUp = function(f) { _p.subscribe("onKeyUp", f); };
    this.onPaste = function(f) { _p.subscribe("onPaste", f); };

    // Implementation
    if (!this.name) this.name = sic.widget._nextInputId();
    if (this.caption === null) this.caption = sic.captionize(this.name);

    this.inputCount = function() {
        return Object.keys(_p.inputs).length;
    };

    this.addInput = function(){
        var inputId = sic.widget._nextInputId();
        var caption = _p.inputCount() > 0 && !_p.withCode ? " " : _p.caption;
        var input = new _p.inputConstruct(sic.mergeObjects(_p.inputArgs, { parent:_p.selector,
            name:_p.name+"_"+inputId, caption:caption, inputArray: _p }));
        input.inputId = inputId;
        input.onKeyDown(function(e) { e.sicInput = _p; _p.trigger('onKeyDown', e); });
        input.onKeyPressed(function(e) { e.sicInput = _p; _p.trigger('onKeyPressed', e); });
        input.onKeyUp(function(e) { e.sicInput = _p; _p.trigger('onKeyUp', e); });
        input.onPaste(function(e) { e.sicInput = _p; _p.trigger('onPaste', e); });

        input.delButton = new sic.widget.sicElement({ parent:input.selector, tagName:"div" });
        input.delButton.selector.addClass("inputButton delButton").html("-");
        input.delButton.selector[0].inputId = inputId;
        input.delButton.selector.click(function(e){
            _p.removeInput(this.inputId);
        });

        delete _p.inputArgs.focus;
        if (_p.autoFocus && _p.inputCount() > 0 && !_p.tempDisableAutoFocus) input.input.selector.focus();

        _p.inputs[inputId] = input;
        return input;

    };

    this.removeInput = function(inputId) {
        if (inputId === undefined) inputId = _p.inputs[Object.keys(_p.inputs).reverse()[0]].inputId;
        if (_p.inputs[inputId]) {
            var delInput = _p.inputs[inputId];
            if (delInput.isMainInput) {
                if (_p.inputCount() > 1) {
                    var value = _p.getValue();
                    value.splice(0,1);
                    _p.setValue(value);
                } else {
                    delInput.setValue('');
                }
            } else {
                delInput.selector.remove();
                delete _p.inputs[inputId];
            }
        }
    };

    this.clear = function() {
        for (var i in Object.keys(_p.inputs)) {
            var inputId = _p.inputs[i];
            _p.removeInput(inputId);
        }
    };

    this.getValue = function(){
        var result = [];
        for (var i in _p.inputs) result.push(_p.inputs[i].getValue());
        return result;
    };

    this.setValue = function(value){
        _p.tempDisableAutoFocus = true;
        var oldLength = _p.inputCount();
        if (!value || !value.length) {
            _p.clear();
            return;
        }
        if (typeof(value) == "string") {
            value = [value];
        }
        while (value && value.length && _p.inputCount() < value.length) {
            _p.addInput(false);
            if (_p.inputCount() == oldLength) break;
        }
        for (var i in value) {
            var inputKeys = Object.keys(_p.inputs);
            if (_p.inputs[inputKeys[i]]) _p.inputs[inputKeys[i]].setValue(value[i]);
        }
        oldLength = _p.inputCount();
        while (value && _p.inputCount() > value.length) {
            _p.removeInput();
            if (_p.inputCount() == oldLength) break;
        }
        _p.tempDisableAutoFocus = false;
    };

    this.calcModified = function(){
        for (var i in _p.inputs) _p.inputs[i].calcModified();
    };

    this.mainInput = this.addInput();

    /*
    this.delButton = new sic.widget.sicElement({ parent:this.mainInput.selector, tagName:"div" });
    this.delButton.selector.addClass("inputButton delButton").html("-");
    this.delButton.selector.click(function(e){
        _p.removeInput(0);
    });
    */
    this.mainInput.isMainInput = true;
    this.addButton = new sic.widget.sicElement({ parent:this.mainInput.selector, tagName:"div" });
    this.addButton.selector.addClass("inputButton addButton").html("+");
    this.addButton.selector.click(function(e){
        var newInput = _p.addInput();
    });

}
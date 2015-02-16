sic.widget.sicForm = function(args)
{
    // Init
    var _p = this;
    this._cons = sic.widget.sicElement;
    this._cons({ parent:args.parent, tagName:"div" });

    this._eventb = sic.object.sicEventBase;
    this._eventb();

    this.selector.addClass("sicForm");

    this.inputs = {};
    this._submitInput = null;

    // Settings
    this.enterSubmits = sic.getArg(args, "enterSubmits", true);
    this.showModified = sic.getArg(args, "showModified", true);
    this.skipTypes = ["submit", "button"];

    // Events
    this.onSubmit = function(f) { _p.subscribe("onSubmit", f); };

    // Implementation
    this.addInput = function(args){
        var input;
        if (args.isArray) {
            input = new sic.widget.sicInputArray({ parent:_p.selector, name:args.name, inputArgs:args });
        } else {
            input = new sic.widget.sicInput(sic.mergeObjects({ parent:_p.selector, type:"text"}, args));
        }
        input.onKeyPressed(_p._onKeyPressed);
        if (args.type == "submit") {
            _p._submitInput = input;
            _p._submitInput.selector.click(_p._onSubmit);
        }
        _p.inputs[input.name] = input;
        return input;
    };

    // Get Form data
    this.getValue = function(){
        var formData = {};
        for (var i in _p.inputs) {
            if (_p.skipTypes.indexOf(_p.inputs[i].type) != -1) continue;
            var key = _p.inputs[i].name;
            var val = _p.inputs[i].getValue();
            formData[key] = val;
        }
        return formData;
    };

    // Set Form data
    this.setValue = function(formData){
        for (var key in formData) {
            var val = formData[key];
            if (_p.inputs[key]) _p.inputs[key].setValue(val);
        }
    };

    this.submit = function() {
        if (_p._submitInput) _p._submitInput.selector.click();
    };


    this.allInputs = {
        resetModified: function(){
            for (var i in _p.inputs) {
                _p.inputs[i].setValue(_p.inputs[i].getValue());
                _p.inputs[i].calcModified();
            }
        }
    };

    // Internal Event handlers
    this._onSubmit = function(e) {
        _p.trigger('onSubmit', _p);
        _p.allInputs.resetModified();
    };
    this._onKeyPressed = function(e) {
        if (e.which == 13 && _p.enterSubmits) _p.submit();
    };
};

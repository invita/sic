sic.widget.sicForm = function(args)
{
    // Init
    var _p = this;
    this._cons = sic.widget.sicElement;
    this._cons({ parent:args.parent, tagName:"div" });
    this.selector.addClass("sicForm");

    this.inputs = {};
    this._submitInput = null;

    // Settings
    this.enterSubmits = sic.getArg(args, "enterSubmits", true);


    // Implementation
    this.addInput = function(args){
        var input = new sic.widget.sicInput(sic.mergeObjects({parent:_p.selector, type:"text"}, args));
        input.selector.keypress(_p.onKeyPressed);
        if (args.type == "submit") _p._submitInput = input;
        _p.inputs[input.name] = input;
        return input;
    };

    // Get Form data
    this.getValue = function(){
        var formData = {};
        for (var i in _p.inputs) {
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

    // Events
    this.onKeyPressed = function(e) {
        if (e.which == 13 && _p.enterSubmits) _p.submit();
    };
};

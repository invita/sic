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
    this.lastCaptionHeader = null;
    this.lastCaptionContent = null;

    // Settings
    this.enterSubmits = sic.getArg(args, "enterSubmits", true);
    this.showModified = sic.getArg(args, "showModified", true);
    this.captionWidth = sic.getArg(args, "captionWidth", null);
    this.skipTypes = ["submit", "button"];

    // Events
    this.onSubmit = function(f) { _p.subscribe("onSubmit", f); };

    // Implementation
    this.addInput = function(args){
        var input;
        var parent = _p.lastCaptionContent ? _p.lastCaptionContent.selector :  _p.selector;
        var defArgs = {
            showModified: _p.showModified,
            captionWidth:_p.captionWidth,
            parent:parent,
            type:"text",
            inputConstruct: sic.widget.sicInput,
            form: _p
        };
        args = sic.mergeObjects(defArgs, args);
        if (args.isArray) {
            input = new sic.widget.sicInputArray({ parent:parent, name:args.name, caption:args.caption, inputArgs:args });
        } else {
            input = new args.inputConstruct(args);
        }
        input.onKeyPressed(_p._onKeyPressed);
        if (args.type == "submit") {
            _p._submitInput = input;
            _p._submitInput.selector.click(_p._onSubmit);
        }
        _p.inputs[input.name] = input;
        return input;
    };

    this.addHr = function(){
        var parent = _p.lastCaptionContent ? _p.lastCaptionContent.selector :  _p.selector;
        var hr = new sic.widget.sicElement({ parent:parent, tagName:"hr" });
    };

    this.addCaption = function(args){
        var caption = sic.getArg(args, "caption", "");
        var canMinimize = sic.getArg(args, "canMinimize", false);
        var initHide = sic.getArg(args, "initHide", false);

        _p.lastCaptionHeader = new sic.widget.sicElement({ parent:_p.selector, tagClass:"header" });
        if (caption)
            _p.lastCaptionHeader.selector.html(caption);
        else
            _p.lastCaptionHeader.displayNone();
        _p.lastCaptionContent = new sic.widget.sicElement({ parent:_p.selector, tagClass:"content" });

        if (canMinimize) {
            _p.lastCaptionHeader.selector.css("cursor", "pointer")
            _p.lastCaptionHeader.selector[0].content = _p.lastCaptionContent;
            _p.lastCaptionHeader.selector.click(function(){
                this.content.expandToggle();
            });
            if (initHide) _p.lastCaptionContent.expandToggle();
        }

    };

    // Get Form data
    this.getValue = function(){
        var formData = {};
        for (var i in _p.inputs) {
            if (_p.skipTypes.indexOf(_p.inputs[i].type) != -1) continue;
            var key = _p.inputs[i].name;
            if (key[0] == "_") continue;
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

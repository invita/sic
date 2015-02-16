sic.widget.sicInput = function(args)
{
    // Init
    var _p = this;

    this._cons = sic.widget.sicElement;
    this._cons({ parent:args.parent });
    this.selector.addClass("sicInputDiv");

    this._eventb = sic.object.sicEventBase;
    this._eventb();

    // Settings
    this.type = sic.getArg(args, "type", "text");
    switch(this.type){
        case "textarea": this.inputTagName = "textarea"; break;
        default: this.inputTagName = "input"; break;
    }

    this.name = sic.getArg(args, "name", null);
    this.value = sic.getArg(args, "value", "");
    this.placeholder = sic.getArg(args, "placeholder", "");
    this.readOnly = sic.getArg(args, "readOnly", false);
    this.gradient = sic.getArg(args, "gradient", null);
    this.caption = sic.getArg(args, "caption", null);

    // Events
    this.onKeyDown = function(f) { _p.subscribe("onKeyDown", f); };
    this.onKeyPressed = function(f) { _p.subscribe("onKeyPressed", f); };
    this.onKeyUp = function(f) { _p.subscribe("onKeyUp", f); };


    // Create elements
    this.input = new sic.widget.sicElement({ parent:this.selector, tagName:this.inputTagName });
    this.input.selector.addClass("sicInput");
    this.inputs = [this.input];

    // Implementation
    if (!this.name) this.name = sic.widget._nextInputId();

    if (this.type != "textarea")
        this.input.selector.attr("type", this.type);

    if (this.name)
        this.input.selector.attr("name", this.name);

    if (this.type == "button" && !this.value)
        this.value = this.name;

    if (this.readOnly)
        this.input.selector.attr("readonly", true);

    this.setPlaceholder = function(newPlaceholder){
        if (!newPlaceholder) {
            _p.placeholder = "";
            _p.input.selector.removeAttr("placeholder");
        } else {
            _p.placeholder = newPlaceholder;
            _p.input.selector.attr("placeholder", _p.placeholder);
        }
    };

    this.getValue = function(){
        return _p.input.selector.val();
    };

    this.setValue = function(value){
        _p.input.selector.val(value);
        _p.origValue = value;
    };

    this.calcModified = function(){
        var modified = _p.getValue() != _p.origValue;
        if (_p.modified == modified) return;

        _p.modified = modified;
        if (_p.modified) {
            _p.selector.addClass("modified");
        } else {
            _p.selector.removeClass("modified");
        }
    };

    this.isButton = function(){
        return _p.type == "button" || _p.type == "submit";
    };

    if (this.placeholder) this.setPlaceholder(this.placeholder);
    this.setValue(this.value);

    if (this.isButton()) {
        if (this.type == "submit" && !this.gradient) this.gradient = sic.defaults.submitGrad
        if (this.type == "button" && !this.gradient) this.gradient = sic.defaults.buttonGrad;
        this.selector.css('display', 'inline-table');
    }

    if (this.gradient) this.input.setGradient(this.gradient);

    // Internal events
    this._onKeyDown = function(e) {
        e.sicInput = _p;
        _p.trigger('onKeyDown', e);
    };
    this._onKeyPressed = function(e) {
        e.sicInput = _p;
        _p.trigger('onKeyPressed', e);
    };
    this._onKeyUp = function(e) {
        e.sicInput = _p;
        _p.calcModified();
        _p.trigger('onKeyUp', e);
    };

    this.input.selector.keydown(_p._onKeyDown);
    this.input.selector.keypress(_p._onKeyPressed);
    this.input.selector.keyup(_p._onKeyUp);

    if (!this.isButton() && this.caption === null)
        this.caption = sic.captionize(this.name);

    if (typeof(this.caption) == "string" && this.caption) {
        this.captionDiv = new sic.widget.sicElement({ parent:this.selector, insertAtTop:true, tagName:"div" });
        this.captionDiv.selector.addClass("sicInputCaption");
        this.captionDiv.selector.html(this.caption);
    }

};

// Id Generator
sic.widget._lastInputId = 0;
sic.widget._nextInputId = function(){
    sic.widget._lastInputId += 1;
    return "input"+sic.widget._lastInputId;
};

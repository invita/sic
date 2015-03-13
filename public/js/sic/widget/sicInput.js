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
    this.inputType = this.type;
    switch(this.type){
        case "textarea": this.inputTagName = "textarea"; break;
        case "flat": this.inputTagName = "input"; this.inputType = "text"; break;
        default: this.inputTagName = "input"; break;
    }

    this.name = sic.getArg(args, "name", null);
    this.value = sic.getArg(args, "value", "");
    this.placeholder = sic.getArg(args, "placeholder", "");
    this.readOnly = sic.getArg(args, "readOnly", false);
    this.focus = sic.getArg(args, "focus", false);
    this.gradient = sic.getArg(args, "gradient", null);
    this.caption = sic.getArg(args, "caption", null);
    this.captionWidth = sic.getArg(args, "captionWidth", null);
    this.showModified = sic.getArg(args, "showModified", true);
    this.lookup = sic.getArg(args, "lookup", null);
    this.form = sic.getArg(args, "form", null);

    // Events
    this.onKeyDown = function(f) { _p.subscribe("onKeyDown", f); };
    this.onKeyPressed = function(f) { _p.subscribe("onKeyPressed", f); };
    this.onKeyUp = function(f) { _p.subscribe("onKeyUp", f); };
    this.onEnterPressed = function(f) { _p.subscribe("onEnterPressed", f); };

    // Create elements
    this.input = new sic.widget.sicElement({ parent:this.selector, tagName:this.inputTagName });
    this.input.selector.addClass("sicInput");
    this.inputs = [this.input];

    // Implementation
    if (!this.name) this.name = sic.widget._nextInputId();

    if (this.inputType != "textarea")
        this.input.selector.attr("type", this.inputType);

    if (this.name)
        this.input.selector.attr("name", this.name);

    if (this.type == "button" && !this.value)
        this.value = this.name;

    if (this.type == "flat")
        this.input.selector.addClass("flat");

    if (this.readOnly)
        this.input.selector.attr("readonly", true);

    if (this.focus)
        this.input.selector.focus();

    if (this.lookup) {
        this.input.selector.addClass("lookupKey");
        this.lookupInput = new sic.widget.sicElement({ parent:this.selector, tagName:this.inputTagName,
            attr: { type: "text", readOnly: true, name: this.name+"_lookup" } });
        this.lookupInput.selector.addClass("sicInput lookupValue");

        this.editButton = new sic.widget.sicElement({ parent:this.selector, tagName:"div" });
        this.editButton.selector.addClass("inputButton editButton");
        this.editButton.lookupImg = new sic.widget.sicElement({ parent:this.editButton.selector,
            tagName:"img", attr: { src: "/img/icon/edit.png" } });
        this.editButton.displayNone();
        this.editButton.selector.click(function(e){
            // ... Edit Lookup
        });

        this.lookupButton = new sic.widget.sicElement({ parent:this.selector, tagName:"div" });
        this.lookupButton.selector.addClass("inputButton lookupButton");
        this.lookupButton.lookupImg = new sic.widget.sicElement({ parent:this.lookupButton.selector,
            tagName:"img", attr: { src: "/img/icon/lookup.png" } });
        this.lookupButton.selector.click(function(e){
            // ... Do Lookup
        });
        this.inputs.push(this.lookupInput);
    }

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
        _p._onChange();
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

    if (this.isButton()) {
        if (this.type == "submit" && !this.gradient) this.gradient = sic.defaults.submitGrad
        if (this.type == "button" && !this.gradient) this.gradient = sic.defaults.buttonGrad;
        this.selector.css('display', 'inline-table');
    }

    this._onChange = function() {
        if (_p.lookup) {
            var value = _p.getValue();
            if (jQuery.isNumeric(value)) value = parseInt(value);
            if (value)
                _p.editButton.display();
            else
                _p.editButton.displayNone();
        }
    };

    // Internal events
    this._onKeyDown = function(e) {
        e.sicInput = _p;
        _p.trigger('onKeyDown', e);
    };
    this._onKeyPressed = function(e) {
        e.sicInput = _p;
        if (e.which == 13) _p.trigger('onEnterPressed', e);
        _p.trigger('onKeyPressed', e);
    };
    this._onKeyUp = function(e) {
        e.sicInput = _p;
        if (_p.showModified) _p.calcModified();
        _p._onChange();
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
        if (_p.captionWidth) this.captionDiv.selector.css("width", _p.captionWidth);
        this.captionDiv.selector.html(this.caption);
    }

    if (this.placeholder) this.setPlaceholder(this.placeholder);
    this.setValue(this.value);
    if (this.gradient) this.input.setGradient(this.gradient);

};

// Id Generator
sic.widget._lastInputId = 0;
sic.widget._nextInputId = function(){
    sic.widget._lastInputId += 1;
    return "input"+sic.widget._lastInputId;
};

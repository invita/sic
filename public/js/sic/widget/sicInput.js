sic.widget.sicInput = function(args)
{
    // Init
    var _p = this;
    this._cons = sic.widget.sicElement;

    this.type = sic.getArg(args, "type", "text");
    switch(this.type){
        case "textarea": this.tagName = "textarea"; break;
        default: this.tagName = "input"; break;
    }

    this._cons({ parent:args.parent, tagName:this.tagName });
    this.selector.addClass("sicInput");

    // Settings
    this.name = sic.getArg(args, "name", null);
    if (!this.name) this.name = sic.widget._nextInputId();

    this.label = sic.getArg(args, "label", "");
    this.value = sic.getArg(args, "value", "");

    if (this.type != "textarea")
        this.selector.attr("type", this.type);

    if (this.name)
        this.selector.attr("name", this.name);

    if (this.type == "button" && !this.value)
        this.value = this.name;

    this.labelMode = false;

    this.displayLabel = function(){
        _p.realValue = _p.selector.val();
        _p.selector.val(_p.label);
        _p.selector.addClass("labeled");
        _p.labelMode = true;
    };

    this.undisplayLabel = function(){
        _p.selector.val(_p.realValue);
        _p.selector.removeClass("labeled");
        _p.labelMode = false;
    };

    this.getValue = function(){
        if (_p.labelMode)
            return _p.realValue
        else
            return _p.selector.val();
    };

    this.setValue = function(value){
        _p.realValue = value;
        _p.selector.val(value);
    };

    this.onEnter = function(e){
        _p.undisplayLabel();
    };

    this.onExit = function(e){
        if (_p.getValue() === "")
            _p.displayLabel();
        else
            _p.realValue = _p.getValue();
    };

    this.selector.focus(this.onEnter);
    this.selector.blur(this.onExit);
    this.setValue(this.value);
    if (!this.value) this.displayLabel();
};

// Id Generator
sic.widget._lastInputId = 0;
sic.widget._nextInputId = function(){
    sic.widget._lastInputId += 1;
    return "input"+sic.widget._lastInputId;
};

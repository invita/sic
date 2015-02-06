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
    this.value = sic.getArg(args, "value", "");
    this.placeholder = sic.getArg(args, "placeholder", "");
    this.readOnly = sic.getArg(args, "readOnly", false);


    // Implementation
    if (!this.name) this.name = sic.widget._nextInputId();

    if (this.type != "textarea")
        this.selector.attr("type", this.type);

    if (this.name)
        this.selector.attr("name", this.name);

    if (this.type == "button" && !this.value)
        this.value = this.name;

    if (this.readOnly)
        this.selector.attr("readonly", true);

   this.setPlaceholder = function(newPlaceholder){
       if (!newPlaceholder) {
           _p.placeholder = "";
           _p.selector.removeAttr("placeholder");
       } else {
           _p.placeholder = newPlaceholder;
           _p.selector.attr("placeholder", _p.placeholder);
       }
    };

    this.getValue = function(){
        return _p.selector.val();
    };

    this.setValue = function(value){
        _p.selector.val(value);
    };

    if (this.placeholder) this.setPlaceholder(this.placeholder);
    if (this.value) this.setValue(this.value);

    if (this.type == "button" || this.type == "submit") this.setGradient(sic.defaults.buttonGrad);
};

// Id Generator
sic.widget._lastInputId = 0;
sic.widget._nextInputId = function(){
    sic.widget._lastInputId += 1;
    return "input"+sic.widget._lastInputId;
};

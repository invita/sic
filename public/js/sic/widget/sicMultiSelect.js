sic.widget.sicMultiSelect = function(args)
{
    // Init
    var _p = this;
    this._cons = sic.widget.sicElement;
    this._cons({parent: args.parent});

    this._eventb = sic.object.sicEventBase;
    this._eventb();

    this.selector.addClass("sicMultiSelect");


    // Settings
    this.name = sic.getArg(args, "name", null);
    this.caption = sic.getArg(args, "caption", null);
    this.captionWidth = sic.getArg(args, "captionWidth", null);
    this.values = sic.getArg(args, "values", null);
    this.value = sic.getArg(args, "value", null);
    this.multiSelect = sic.getArg(args, "multiSelect", true);

    // Events
    this.onKeyDown = function(f) { _p.subscribe("onKeyDown", f); };
    this.onKeyPressed = function(f) { _p.subscribe("onKeyPressed", f); };
    this.onKeyUp = function(f) { _p.subscribe("onKeyUp", f); };
    this.onSelectionChange = function(f) { _p.subscribe("onSelectionChange", f); };

    this.buttonsContainer = new sic.widget.sicElement({ parent:this.selector });
    this.buttonsContainer.selector.addClass("buttonsContainer inline");

    if (typeof(this.caption) == "string" && this.caption) {
        this.captionDiv = new sic.widget.sicElement({ parent:this.selector, insertAtTop:true, tagName:"div" });
        this.captionDiv.selector.addClass("sicInputCaption");
        if (_p.captionWidth) this.captionDiv.selector.css("width", _p.captionWidth);
        this.captionDiv.selector.html(this.caption);
    }

    this.buttons = {};

    this.addButton = function(index, text){
        if (!text) text = sic.captionize(index);
        var button = new sic.widget.sicElement({parent:_p.buttonsContainer.selector, tagName:"div"});
        button.selector.addClass("multiSelectButton").html(text);
        button.index = index;
        //button.onKeyDown(function(e) { e.sicInput = _p; _p.trigger('onKeyDown', e); });
        //button.onKeyPressed(function(e) { e.sicInput = _p; _p.trigger('onKeyPressed', e); });
        //button.onKeyUp(function(e) { e.sicInput = _p; _p.trigger('onKeyUp', e); });
        button.isSelected = false;
        button.setSelected = function(bool){
            if (!_p.multiSelect && bool) _p.clear();
            button.isSelected = bool;
            if (button.isSelected)
                button.selector.addClass("selected");
            else
                button.selector.removeClass("selected");
        };
        button.selector.click(function(e){ button.setSelected(!button.isSelected); _p.trigger("onSelectionChange", button); });
        _p.buttons[index] = button;
        return button;

    };

    this.addHr = function(){
        var hr = new sic.widget.sicElement({parent:_p.buttonsContainer.selector, tagName:"hr"});
        //_p.buttons[index] = hr;
        return hr;

    };

    this.getValue = function(){
        var result = [];
        for (var i in _p.buttons)
            if (_p.buttons[i].isSelected)
                result.push(_p.buttons[i].index);
        return result;
    };

    this.setValues = function(value){
        if (value && value.length) {
            _p.buttons = {};
            _p.buttonsContainer.selector.empty();
            for (var i in value)
                _p.addButton(value[i]);
        }
    };

    this.setValue = function(value){
        if (value && value.length) {
            _p.clear();
            for (var i in value) _p.buttons[value[i]].setSelected(true);
            this.value = value;
        }
    };

    this.clear = function(){
        for (var i in _p.buttons) _p.buttons[i].setSelected(false);
    };

    this.calcModified = function(){
        //for (var i in _p.buttons) _p.buttons[i].calcModified();
    };

    if (this.values) this.setValues(this.values);
    if (this.value) this.setValue(this.value);

    //this. = this.addInput();

    /*
    this.delButton = new sic.widget.sicElement({ parent:this.mainInput.selector, tagName:"div" });
    this.delButton.selector.addClass("inputButton delButton").html("-");
    this.delButton.selector.click(function(e){
        if (_p.buttons.length > 1) {
            var delInput = _p.buttons[_p.buttons.length -1];
            delInput.selector.remove();
            _p.buttons.splice(_p.buttons.length -1, 1);
        }
    });
    this.addButton = new sic.widget.sicElement({ parent:this.mainInput.selector, tagName:"div" });
    this.addButton.selector.addClass("inputButton addButton").html("+");
    this.addButton.selector.click(function(e){
        var newInput = _p.addInput();
    });
    */

    /*

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


    */

}
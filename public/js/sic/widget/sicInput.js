sic.widget.sicInput = function(args)
{
    // Init
    var _p = this;

    this._cons = sic.widget.sicElement;
    this._cons({ parent:args.parent, hint:args.hint });
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
    this.withCode = sic.getArg(args, "withCode", null);
    this.readOnly = sic.getArg(args, "readOnly", false);
    this.disabled = sic.getArg(args, "disabled", false);
    this.focus = sic.getArg(args, "focus", false);
    this.gradient = sic.getArg(args, "gradient", null);
    this.caption = sic.getArg(args, "caption", null);
    this.captionWidth = sic.getArg(args, "captionWidth", null);
    this.showModified = sic.getArg(args, "showModified", true);
    this.lookup = sic.getArg(args, "lookup", null);
    this.form = sic.getArg(args, "form", null);
    this.inputArray = sic.getArg(args, "inputArray", null);

    // Events
    this.onKeyDown = function(f) { _p.subscribe("onKeyDown", f); };
    this.onKeyPressed = function(f) { _p.subscribe("onKeyPressed", f); };
    this.onKeyUp = function(f) { _p.subscribe("onKeyUp", f); };
    this.onEnterPressed = function(f) { _p.subscribe("onEnterPressed", f); };

    this.onPaste = function(f) { _p.subscribe("onPaste", f); };

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

    if (this.disabled)
        this.input.selector.attr("disabled", true);

    if (this.focus)
        this.input.selector.focus();

    if (this.lookup) {
        var placeHolder = "";
        if (_p.lookup.resolve && _p.lookup.resolve.emptyValue) placeHolder = _p.lookup.resolve.emptyValue;
        this.input.selector.addClass("lookupKey");
        this.lookupInput = new sic.widget.sicElement({ parent:this.selector, tagName:this.inputTagName,
            attr: { type: "text", readOnly: true, tabindex: "-1", name: this.name+"_lookup", placeholder: placeHolder } });
        this.lookupInput.selector.addClass("sicInput lookupValue");

        this.editButton = new sic.widget.sicElement({ parent:this.selector, tagName:"div" });
        this.editButton.selector.addClass("inputButton editButton");
        this.editButton.lookupImg = new sic.widget.sicElement({ parent:this.editButton.selector,
            tagName:"img", attr: { src: "/img/icon/edit.png" } });
        this.editButton.displayNone();


        // ... Lookup Resolve
        this.lookupResolve = function(){
            var resolveArgs = sic.mergeObjects({ aSync: true }, _p.lookup.resolve);
            var name = _p.inputArray ? _p.inputArray.name : _p.name;
            var value = _p.getValue();

            if (value && parseInt(value)) {
                var targetFieldName = name;
                if (_p.lookup.fieldMap && _p.lookup.fieldMap[name]) targetFieldName = _p.lookup.fieldMap[name];
                resolveArgs[targetFieldName] = value;

                sic.callMethod(resolveArgs, function(resp){
                    _p.lookupInput.selector.val(resp.resolveValue);
                });
            } else {
                _p.lookupInput.selector.val('');
            }
        };


        // ... Do Lookup
        this.lookupLookup = function() {
            var lookupArgs = sic.mergeObjects(_p.lookup.lookup);
            lookupArgs[_p.name] = _p.getValue();
            if (_p.form) {
                var formData = _p.form.getValue();
                if (_p.lookup.fieldMap){
                    for (var origKey in _p.lookup.fieldMap) {
                        var renamedKey = _p.lookup.fieldMap[origKey]
                        if (_p.inputArray && renamedKey == _p.inputArray.name)
                            renamedKey = _p.name;
                        lookupArgs[renamedKey] = formData[origKey];
                    }
                }
                lookupArgs.formData = formData;
            }

            lookupArgs.selectCallback = function(cbArgs) {
                var targetFieldName = _p.name;
                var name = _p.inputArray ? _p.inputArray.name : _p.name;
                if (_p.lookup.fieldMap && _p.lookup.fieldMap[name]) targetFieldName = _p.lookup.fieldMap[name];
                var row = cbArgs.row.getValue();
                _p.setValue(row[targetFieldName]);
            };

            sic.loadModule(lookupArgs);
        };


        // ... Lookup Edit
        this.lookupEdit = function() {
            var targetFieldName = _p.name;
            var name = _p.inputArray ? _p.inputArray.name : _p.name;
            if (_p.lookup.fieldMap && _p.lookup.fieldMap[name]) targetFieldName = _p.lookup.fieldMap[name];
            var editArgs = sic.mergeObjects(_p.lookup.edit);
            editArgs[targetFieldName] = _p.getValue();

            sic.loadModule(editArgs);
        };



        this.editButton.selector.click(function(e){
            _p.lookupEdit();
        });

        this.lookupButton = new sic.widget.sicElement({ parent:this.selector, tagName:"div" });
        this.lookupButton.selector.addClass("inputButton lookupButton");
        this.lookupButton.lookupImg = new sic.widget.sicElement({ parent:this.lookupButton.selector,
            tagName:"img", attr: { src: "/img/icon/lookup.png" } });
        this.lookupButton.selector.click(function(e){
            _p.lookupLookup();
        });

        this.input.selector.blur(function(e){
            _p.lookupResolve();
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
        if (_p.withCode)
            return { codeId: _p.getCodeId(), value: _p.input.selector.val() };
        else
            return _p.input.selector.val();
    };

    this.setValue = function(value){
        if (_p.withCode && value.codeId) {
            _p.setCodeId(value.codeId);
            value = value.value;
        }
        _p.input.selector.val(value);
        _p.origValue = value;
        _p._onChange();
        if (_p.lookup)
            _p.lookupResolve();
    };

    this.getCodeId = function(){
        if (!_p.withCode || !_p.codeSelect) return 0;
        return _p.codeSelect.selector.val();
    };

    this.setCodeId = function(codeId){
        if (!_p.withCode || !_p.codeSelect) return;
        _p.codeSelect.selector.val(codeId);
    };

    this.calcModified = function(){
        var modified;

        if (_p.withCode)
            modified = _p.getValue().value != _p.origValue;
        else
            modified = _p.getValue() != _p.origValue;

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

    this._onPaste = function(e) {
        e.sicInput = _p;
        _p.trigger('onPaste', e);
    };

    this.input.selector.keydown(_p._onKeyDown);
    this.input.selector.keypress(_p._onKeyPressed);
    this.input.selector.keyup(_p._onKeyUp);
    this.input.selector.on("paste", _p._onPaste);

    if (!this.isButton() && this.caption === null)
        this.caption = sic.captionize(this.name);


    this.captionDiv = new sic.widget.sicElement({ parent:this.selector, insertAtTop:true, tagName:"div" });
    this.captionDiv.selector.addClass("sicInputCaption");
    if (_p.captionWidth) this.captionDiv.selector.css("width", _p.captionWidth);
    if (this.caption && !this.withCode)
        this.captionDiv.selector.html(this.caption);

    if (this.withCode) {
        this.codeSelect = new sic.widget.sicElement({parent:this.captionDiv.selector, tagName:"select", tagClass:"codeSelect"});
        for (var idx in this.withCode) {
            var optionLabel = this.caption+" - "+this.withCode[idx];
            this.codeSelect.selector.append('<option value="'+idx+'">'+optionLabel+'</option>');
        }
    }

    if (typeof(this.caption) != "string" || !this.caption)
        this.captionDiv.displayNone();

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

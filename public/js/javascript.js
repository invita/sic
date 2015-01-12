// Test...

Cap.capForm = function(jqFormElement, args) {
    var _p = this;

    this.jqElement = jqFormElement;

    // Args
    this.validation = args && args.validation ? args.validation : {};

    this.inputs = {};

    this.defaultValidateF = function(value) { return { success: true, message:'' }; };

    this.validateAll = function(){

        var validationResults = {};

        for (var fieldName in _p.inputs) {

            var fieldValue = $(_p.inputs[fieldName]).val();
            var validateF = typeof(_p.validation[fieldName]) == 'function' ? _p.validation[fieldName] : _p.defaultValidateF;
            var validationResult = validateF(fieldValue);

            //alert(fieldName + ", "+ fieldValue + ": "+validationResult.success);

            validationResults[fieldName] = validationResult;
        }

        _p.applyValidationResults(validationResults);
    };

    this.applyValidationResults = function(validationResults) {

        var strValidationResult = '';
        for (var name in validationResults) {
            if (validationResults[name].success) {
                // Success
                _p.inputs[name].css('background-color', '');
            } else {
                // Fail
                _p.inputs[name].css('background-color', '#EE7777');
                if (strValidationResult) strValidationResult += "<br />\n";
                strValidationResult += validationResults[name].message;
            }
        }

        $('div.formValidMessage').css('background-color', '#EE7777');
        $('div.formValidMessage').html(strValidationResult);
        //alert(strValidationResult);

        //$('div.formValidMessage').html(name+' foo');
    };

    this.init = function() {
        _p.jqElement.children().each(function(){
            if (this.name && (this.tagName == 'INPUT' || this.tagName == 'TEXTAREA')) {
                var jqChild = $(this);
                jqChild.blur(function(){ _p.validateAll(); });
                _p.inputs[this.name] = jqChild;
            }
        });
    };

    this.init();
};


$(document).ready(function(){
    var jqForm = $('form.testForm');

    var capForm = new Cap.capForm(jqForm, {
        validation: {
            "test": function(value) { return { success: value == "asdf", message: 'Test must be asdf' }; },
            "test2": function(value) { return { success: value != "", message: 'Test2 must not be empty'}; }
        }
    });



    //var children = capForm.jqElement.children();

    //for (var i = 0; i < children.length; i++) {

    //    alert(children[i].tagName);
        //alert(children.each());
    //}


    //alert(children.length);
});

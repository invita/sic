F = function(args){
    //alert("Module loaded!\n" + sic.debug({args: args}));

    var sicEl = new sic.widget.sicElement({});
    sicEl.appendTo($("div#testDiv"));
    sicEl.selector.html("Module loaded!\n" + sic.debug({args: args}));
};
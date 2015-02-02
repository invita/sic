var sic = { object:{}, widget:{}, data:{}, defaults:{} };

sic.defaults = {
    fadeTime: 600
}

sic.loadModule = function(args) {
    var moduleName = sic.getArg(args, "moduleName", null); // Module Name

    $.post("/loadModule", {args: args}, function(data) {
        var dataObj = JSON.parse(data);
        if (dataObj) {
            var args = dataObj.args;

            // Prepare some useful functions
            args.helpers = {};

            // Create TabPage Function
            var parentTabPage = sic.getArg(args, "parentTabPage", null);
            args.helpers.createTabPage = function(tabArgs){
                if (!tabArgs) tabArgs = {};
                if (!tabArgs.name) tabArgs.name = args.moduleName;
                if (!tabArgs.parent) tabArgs.parent = parentTabPage ? parentTabPage : sic.data.mainTab;
                var tabPage = new sic.widget.sicTabPage(tabArgs);
                return tabPage;
            };

            if (dataObj["F"] && typeof(dataObj["F"]) == "string") {
                eval(dataObj["F"]);
                if (F && typeof(F) == "function") F(args);
            }
        }
    });
};

sic.callMethod = function(args, f) {
    var moduleName = sic.getArg(args, "moduleName", null); // Module Name
    var methodName = sic.getArg(args, "methodName", null); // Method Name
    var result = null;

    var ajaxResult = $.ajax({
        type: 'POST',
        url: '/callMethod',
        data: {args:args},
        success: function(e){},
        dataType: "json",
        async:false
    });

    result = ajaxResult.responseJSON;
    if (result) {

        // Alert
        if (typeof(result['alert']) != "undefined")
            alert(typeof(result['alert']));

        // Message
        if (typeof(f) == "function")
            f(result);
    }

    return result;
    //alert(result);

    /*
    return $.post("/callMethod", {args: args}, function(data) {
        var resultObj = JSON.parse(data);
        if (resultObj) {

            // Alert
            //if (typeof(resultObj['alert'] != "undefined"))
            //    alert(typeof(resultObj['alert']));

            // Message
            f(resultObj);
            return resultObj;
        }
    });
    */
};

$(document).ready(function(){
    sic.data.contentElement = $('div#pageHolder');
    sic.data.mainTab = new sic.widget.sicTabPage({
        name: "Sic",
        parent: sic.data.contentElement,
        canClose: false
    });

    var primaryPage = $('#primaryPage');
    if (primaryPage)
        sic.data.mainTab.content.selector.append(primaryPage);

   // sic.loadModule({moduleName:"Test/WidgetTest"});
});


var sic = { widget:{}, data:{}, defaults:{} };

sic.defaults = {
    fadeTime: 600
}

sic.loadModule = function(args) {
    var moduleName = sic.getArg(args, "moduleName", null); // Module Name

    $.post("/loadModule", {args: args}, function(data) {
        var dataObj = JSON.parse(data);
        if (dataObj) {
            var args = dataObj.args;

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
});


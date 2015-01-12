var sic = { widget:{} };


sic.testAjax = function() {
    $.post("/test", function(data) {
        //alert(data);
        var dataObj = JSON.parse(data);

        //if (dataObj && dataObj["F"] && typeof(dataObj["F"]) == "function") {
        //    alert(eval(dataObj["F"]));
        //}

        if (dataObj && dataObj["F"] && typeof(dataObj["F"]) == "string") {
            eval(dataObj["F"]);
            if (F && typeof(F) == "function") F();
        }
    });
};

sic.loadModule = function(args) {
    var moduleName = sic.getArg(args, "moduleName", null); // Module Name

    $.post("/admin/loadModule", {args: args}, function(data) {
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

sic.callMethod = function(args) {
    var moduleName = sic.getArg(args, "moduleName", null); // Module Name
    var methodName = sic.getArg(args, "methodName", null); // Method Name
    $.post("/admin/callMethod", {args: args}, function(data) {
        var resultObj = JSON.parse(data);
        if (resultObj) {
            alert(sic.debug(resultObj));
            /*
            var args = dataObj.args;

            if (dataObj["F"] && typeof(dataObj["F"]) == "string") {
                eval(dataObj["F"]);
                if (F && typeof(F) == "function") F(args);
            }
            */
        }
    });

}
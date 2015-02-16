var sic = { object:{}, widget:{}, data:{}, defaults:{} };

sic.defaults = {
    fadeTime: 600,

    buttonGrad: "blue",
    submitGrad: "orange",
    tabActiveGrad: "blue",
    tabInactiveGrad: "gold"
}

sic.loadModule = function(loadArgs) {
    var moduleName = sic.getArg(loadArgs, "moduleName", null); // Module Name
    var postData = sic.getArg(loadArgs, "postData", {}); // Post data
    var tabPage = sic.getArg(loadArgs, "tabPage", null); // sicTabPage object
    var newTab = sic.getArg(loadArgs, "newTab", null); // new TabPage Name string

    $.post("/loadModule", {args: {moduleName:moduleName, postData:postData}}, function(data) {
        var dataObj = JSON.parse(data);
        if (dataObj) {
            var args = sic.mergeObjects(loadArgs, dataObj.args);

            // Prepare some useful functions
            args.helpers = {};

            // Create TabPage Function
            args.helpers.createTabPage = function(tabArgs){
                var tab = (tabPage && typeof(tabPage) == "object" && tabPage.isTabPage) ? tabPage : sic.data.mainTab;
                loadArgs.tabPage = tab;

                if (newTab)
                    tab = new sic.widget.sicTabPage({name:newTab, parent:tab});

                if (!tabArgs) tabArgs = {};
                if (!tabArgs.name) tabArgs.name = 'Tab';
                if (!tabArgs.parent) tabArgs.parent = tab == sic.data.mainTab ? tab : tab.content;
                var childTabPage = new sic.widget.sicTabPage(tabArgs);
                if (loadArgs.onClose && typeof(loadArgs.onClose) == "function") childTabPage.onClose(loadArgs.onClose);
                if (loadArgs.onClosed && typeof(loadArgs.onClosed) == "function") childTabPage.onClosed(loadArgs.onClosed);
                return childTabPage;
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

    var ajaxResult = $.ajax({
        type: 'POST',
        url: '/callMethod',
        data: {args:args},
        success: function(e){},
        dataType: "json",
        async:false
    });

    var result = ajaxResult.responseJSON;
    if (result) {

        // Alert
        if (typeof(result['alert']) != "undefined")
            alert(result['alert']);

        // Message
        if (typeof(f) == "function")
            f(result);
    }

    return result;
};

$(document).ready(function(){

    sic.messageTunnel = new sic.object.sicMessageTunnel();

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


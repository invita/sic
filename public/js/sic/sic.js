var sic = { object:{}, widget:{}, data:{}, defaults:{} };

sic.defaults = {
    fadeTime: 600,
    loadingFadeTime: 200,
    hintFadeTime: 200,
    hintTriggerDelay: 200,
    autoCompleteDelay: 500,

    buttonGrad: "blue",
    submitGrad: "orange",
    tabActiveGrad: "blue",
    tabInactiveGrad: "gold",

    dataTableRowsPerPage: 10
}

sic.loadModule = function(loadArgs) {
    sic.loading.show();

    var moduleName = sic.getArg(loadArgs, "moduleName", null); // Module Name
    var postData = sic.getArg(loadArgs, "postData", {}); // Post data
    var tabPage = sic.getArg(loadArgs, "tabPage", null); // sicTabPage object
    var newTab = sic.getArg(loadArgs, "newTab", null); // new TabPage Name string
    var inDialog = sic.getArg(loadArgs, "inDialog", false); // Open module in new sicDialog
    var onModuleLoad = sic.getArg(loadArgs, "onModuleLoad", function(args){}); // OnModuleLoad callback

    onModuleLoad(loadArgs);

    $.post("/loadModule", {args: {moduleName:moduleName, postData:postData}}, function(data) {
        try {
            var dataObj = JSON.parse(data);
            if (dataObj) {
                var args = sic.mergeObjects(loadArgs, dataObj.args);

                if (inDialog) {
                    var dialogTitle = "Dialog";
                    if (newTab) {
                        dialogTitle = newTab;
                        newTab = null;
                    }
                    var dialog = new sic.widget.sicDialog({title:dialogTitle});
                    tabPage = dialog.mainTab;
                }

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
        }
        catch (ex) {
            alert("Error loading module "+moduleName+"\n\nMessage:\n"+ex.message);
        }

        sic.loading.hide();
    });
};

sic.callMethod = function(args, f) {
    sic.loading.show();

    var moduleName = sic.getArg(args, "moduleName", null); // Module Name
    var methodName = sic.getArg(args, "methodName", null); // Method Name
    var aSync = sic.getArg(args, "aSync", false); // Asynchronous call

    var successF = function(result) {
        sic.loading.hide();
        if (result) {
            // Alert
            if (typeof(result['alert']) != "undefined")
                alert(result['alert']);

            if (typeof(result['sessionExpired']) != "undefined") {
                alert("Your session expired. Please login again");
                location.href = "/";
            }

            // Message
            if (typeof(f) == "function")
                f(result);
        }
    };

    var errorF = function(xhr, status, statusText) {
        sic.loading.hide();
        if (status == "parsererror") {
            // Strip tags
            statusText += xhr.responseText.replace(/(<([^>]+)>)/ig,"");
        }
        alert('moduleName: '+moduleName+'\nmethodName: '+methodName+'\n\n['+status+'] '+statusText);
    };

    var ajaxResult = $.ajax({
        type: 'POST',
        url: '/callMethod',
        data: {args:args},
        success: successF,
        error: errorF,
        dataType: "json",
        async:aSync
    });

    return ajaxResult.responseJSON;
};

sic.deltaReindex = function() {
    //sic.callMethod({moduleName:"System/SolrControl", methodName:"reindex", command:"delta-import"}, function(respArgs) {});

    //sic.callMethod({moduleName:"System/SolrControl", methodName:"reindex", command:"full-import"}, function(respArgs) {});
};

// Loading Animation
sic.loading = {
    isVisible: false,
    show: function(){
        //$('img#loadingGif').stop().css("display", "");
        $('img#loadingGif').stop().fadeIn(sic.defaults.loadingFadeTime);
        $('img#loadingGif2').stop().fadeIn(sic.defaults.loadingFadeTime);
        sic.loading.isVisible = true;
        sic.mouse.loadingMove();
    },
    hide: function(){
        //$('img#loadingGif').stop().css("display", "none");
        $('img#loadingGif').stop().fadeOut(sic.defaults.loadingFadeTime);
        $('img#loadingGif2').stop().fadeOut(sic.defaults.loadingFadeTime);
        sic.loading.isVisible = false;
    }
};

// Mouse Movement
sic.mouse = { x: 0, y: 0 };
$(document).mousemove(function(e) {
    sic.mouse.x = e.pageX;
    sic.mouse.y = e.pageY;
    if (sic.loading.isVisible)
        sic.mouse.loadingMove();
});

// Move loadingGif2 with cursor
sic.mouse.loadingMove = function() {
    if (!sic.mouse.loadingGif2)
        sic.mouse.loadingGif2 = $("img#loadingGif2");
    sic.mouse.loadingGif2.css("left", (sic.mouse.x+5)+"px").css("top", (sic.mouse.y+5)+"px");
};


$(document).ready(function() {
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


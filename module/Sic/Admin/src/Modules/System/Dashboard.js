var F = function(args){

    var tabPage = args.helpers.createTabPage({name:"Dashboard"});
    var testData = sic.callMethod({moduleName:"System/Dashboard", methodName:"getSystemStatus"});
    tabPage.content.selector.html(sic.debug(testData, 2, '<br/>\n'));
};
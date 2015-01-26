var F = function(args){
    var tabPage = new sic.widget.sicTabPage({
        name: "Users",
        parent: sic.data.mainTab
    });

    sic.callMethod({moduleName:"Users/ListUsers", methodName:"listUsers"}, function(data){
        tabPage.content.selector.html(sic.debug(data, 2, "<br/>\n", "&nbsp;"));
    });
};
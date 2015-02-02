var F = function(args){
    var tabPage = new sic.widget.sicTabPage({
        name: "Users",
        parent: sic.data.mainTab
    });

    var userData = sic.callMethod({moduleName:"Users/ListUsers", methodName:"listUsers"});

    var dataTable = new sic.widget.sicDataTable({parent:tabPage.content.selector});
    dataTable.initAndPopulate(userData['users']);

};
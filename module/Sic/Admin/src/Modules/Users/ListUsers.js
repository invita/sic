var F = function(args){

    var tabPage = args.helpers.createTabPage({name:"List"});
    var dataTable = new sic.widget.sicDataTable({
        parent:tabPage.content.selector,
        dataSource: new sic.widget.sicDataTableDataSource({
            moduleName:"Users/ListUsers",
            primaryKey: ['id']
        })
    });
    dataTable.onRowDoubleClick(function(args){
        var row = args.row.getValue();
        var tabName = "User: "+row.username+" ("+row.id+")";
        sic.loadModule({moduleName:"Users/Manage", tabPage:tabPage, newTab:tabName, userId: row.id});
    });

    //var userData = sic.callMethod({moduleName:"Users/ListUsers", methodName:"dataTableSelect"});
    //dataTable.initAndPopulate(userData['users']);
};
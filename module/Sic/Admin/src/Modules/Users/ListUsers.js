var F = function(args){

    var tabPage = args.helpers.createTabPage({name:"List"});
    var userData = sic.callMethod({moduleName:"Users/ListUsers", methodName:"listUsers"});
    var dataTable = new sic.widget.sicDataTable({parent:tabPage.content.selector});
    dataTable.initAndPopulate(userData['users']);
    dataTable.selector.css("cursor", "pointer");
    dataTable.onRowDoubleClick(function(args){
        var row = args.row.getValue();
        var tabName = "User: "+row.username+" ("+row.id+")";
        sic.loadModule({moduleName:"Users/Manage", tabPage:tabPage, newTab:tabName, userId: row.id});
    });
};
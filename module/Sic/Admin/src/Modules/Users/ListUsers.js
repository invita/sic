var F = function(args){

    var tabPage = args.helpers.createTabPage({name:"List"});
    var dataTable = new sic.widget.sicDataTable({
        parent:tabPage.content.selector,
        primaryKey: ['id'],
        dataSource: new sic.widget.sicDataTableDataSource({
            moduleName:"Users/ListUsers",
        }),
        editorModuleArgs: {
            moduleName:"Users/Manage",
            caption: "User: %username% (%id%)",
            tabPage:tabPage
        }
    });

};
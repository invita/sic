var F = function(args){

    var tabPage = args.helpers.createTabPage({name:"List"});
    var dataTable = new sic.widget.sicDataTable({
        parent:tabPage.content.selector,
        primaryKey: ['id'],
        entityTitle: "User %id% - %username%",
        dataSource: new sic.widget.sicDataTableDataSource({
            moduleName:"User/UserList",
            pageCount: 5
        }),
        editorModuleArgs: {
            moduleName:"User/UserEdit",
            tabPage:tabPage
        }
    });
};
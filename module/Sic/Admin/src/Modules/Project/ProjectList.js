var F = function(args){

    var tabPage = args.helpers.createTabPage({name:"List"});
    var dataTable = new sic.widget.sicDataTable({
        parent:tabPage.content.selector,
        primaryKey: ['id'],
        entityTitle: "Project %id% - %title%",
        dataSource: new sic.widget.sicDataTableDataSource({
            moduleName:"Project/ProjectList"
        }),
        editorModuleArgs: {
            moduleName:"Project/ProjectEdit",
            tabPage:tabPage
        }
    });

};
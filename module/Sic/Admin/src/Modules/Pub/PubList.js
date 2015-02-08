var F = function(args){

    var tabPage = args.helpers.createTabPage({name:"List"});
    var dataTable = new sic.widget.sicDataTable({
        parent:tabPage.content.selector,
        primaryKey: ['id'],
        entityTitle: "Pub %id% - %name%",
        dataSource: new sic.widget.sicDataTableDataSource({
            moduleName:"Pub/PubList"
        }),
        editorModuleArgs: {
            moduleName:"Pub/PubEdit",
            tabPage:tabPage
        }
    });

};
var F = function(args) {

    var tabPage = args.helpers.createTabPage({name:"List"});

    var dataTable = new sic.widget.sicDataTable({
        parent:tabPage.content.selector,
        primaryKey: ['pub_id'],
        entityTitle: "Entity %pub_id% - %title%",
        dataSource: new sic.widget.sicDataTableDataSource({
            moduleName:"Pub/PubList"
        }),
        editorModuleArgs: {
            moduleName:"Pub/PubEdit",
            tabPage:tabPage
        }
    });

    /*

    var dataTable = new sic.widget.sicDataTable({
        parent:tabPage.content.selector,
        canDelete: false,
        primaryKey: ['pub_id'],
        entityTitle: "Pub %pub_id% - %title%",
        dataSource: new sic.widget.sicDataTableDataSource({
            moduleName:"Test/TestDT"
        }),
        actions: {
            createPub: {
                label: 'Create Pub',
                type: 'button',
                onClick: function(args) {
                    sic.dump(args.action, 0);
                    //alert('Create Pub');
                }
            }
        }
    });

    */

};
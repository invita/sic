var F = function(args) {

    var tabPage = args.helpers.createTabPage({name:"List"});

    var dataTable = new sic.widget.sicDataTable({
        parent:tabPage.content.selector,
        primaryKey: ['pub_id'],
        entityTitle: "Entity %pub_id% - %title%",
        dataSource: new sic.widget.sicDataTableDataSource({
            moduleName:"Pub/PubList",
            pageCount: 20
        }),
        editorModuleArgs: {
            moduleName:"Pub/PubEdit",
            tabPage:tabPage
        },
        fields: {
            pub_id: { hintF: function(args) { return sic.hint.publication(args.row.lastRowData._row) } },
            parent_id: { hintF: function(args) { return sic.hint.publication(args.row.lastRowData._parentRow) } },
            creator: { tagClass:"sicDataTable_shortText",
                hintF: function(args) { return sic.replacePipes(args.row.lastRowData._creator_long, "<br/>") } },
            title: { tagClass:"sicDataTable_shortText",
                hintF: function(args) { return sic.replacePipes(args.row.lastRowData._title_long, "<br/>") } },
            _row: { visible: false },
            _parentRow: { visible: false },
            _creator_long: { visible: false },
            _title_long: { visible: false },
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
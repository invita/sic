var F = function(args) {

    var tabPage = args.helpers.createTabPage({name:"List"});

    var dataTable = new sic.widget.sicDataTable({
        parent:tabPage.content.selector,
        primaryKey: ['pub_id'],
        entityTitle: "Entity %pub_id% - %title%",
        dataSource: new sic.widget.sicDataTableDataSource({
            moduleName:"Pub/PubList",
            pageCount: 20,
            filter: {
                original_id:"-1,0"
            }
        }),
        editorModuleArgs: {
            moduleName:"Pub/PubEdit",
            tabPage:tabPage
        },
        fields: {
            pub_id: { hintF: function(args) { sic.hint.publication(args.row.lastRowData.pub_id) } },
            parent_id: { hintF: function(args) { sic.hint.publication(args.row.lastRowData.parent_id) } },
            series_id: { hintF: function(args) { sic.hint.publication(args.row.lastRowData.series_id) } },
            original_id: { visible:false },
            creator: { tagClass:"sicDataTable_shortText",
                hintF: function(args) { sic.showHint(sic.replacePipes(args.row.lastRowData.__creator_long, "<br/>")); } },
            title: { tagClass:"sicDataTable_shortText",
                hintF: function(args) { sic.showHint(sic.replacePipes(args.row.lastRowData.__title_long, "<br/>")); } }
        }
    });

    /*
    dataTable.onFirstFeedComplete(function(eArgs) {
        var table = dataTable.table.selector.dataTable({
            dom: 'T<"clear">lfrtip',
            paging: false,
            ordering: false,
            info: false,
            bFilter: false,
            tableTools: {
                "sSwfPath": "/lib/jquery/copy_csv_xls_pdf.swf"
            }
        });

        var tableTools = new $.fn.dataTable.TableTools(table, {
            buttons: [
                "copy",
                "csv",
                "xls",
                "pdf",
                { type: "print", buttonText: "Print me!" }
            ],
            "sSwfPath": "/lib/jquery/copy_csv_xls_pdf.swf"
        });

        $(tableTools.fnContainer()).insertAfter('div.info');

    });
    */


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
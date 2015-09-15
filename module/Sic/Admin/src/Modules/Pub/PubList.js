var F = function(args) {

    var tabPage = args.helpers.createTabPage({name:"List"});

    var showAlts = false;


    var dataTable = new sic.widget.sicDataTable({
        parent:tabPage.content.selector,
        primaryKey: ['pub_id'],
        entityTitle: "Entity %pub_id% - %title%",
        filter: { visible: true },
        canDelete: false,
        dataSource: new sic.widget.sicDataTableDataSource({
            moduleName:"Pub/PubList",
            pageCount: 15,
            filter: {
                original_id:"-1,0",
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
            //original_id: { visible:false },
            creator: { tagClass:"sicDataTable_shortText",
                hintF: function(args) { sic.showHint(sic.replacePipes(args.row.lastRowData.__creator_long, "<br/>")); } },
            title: { tagClass:"sicDataTable_shortText",
                hintF: function(args) { sic.showHint(sic.replacePipes(args.row.lastRowData.__title_long, "<br/>")); } }
        }
    });

    dataTable.onFirstFeedComplete(function() {
        var showHideAlts = new sic.widget.sicElement({parent:dataTable.dsControl.selector});
        showHideAlts.selector.addClass("inline filterButton vmid");
        var showHideAltsImg = new sic.widget.sicElement({parent:showHideAlts.selector, tagName:"img", tagClass:"icon12 vmid"});
        showHideAltsImg.selector.attr("src", "/img/icon/lookup.png");
        var showHideAltsSpan = new sic.widget.sicElement({parent:showHideAlts.selector, tagName:"span", tagClass:"vmid"});
        showHideAltsSpan.selector.html("Show alternatives");
        showHideAlts.selector.click(function(e){
            if (showAlts) {
                dataTable.filterRow.fields.original_id.setFilterValue("-1,0");
                showHideAltsSpan.selector.html("Show alternatives");
                showAlts = false;
            } else {
                dataTable.filterRow.fields.original_id.setFilterValue("");
                showHideAltsSpan.selector.html("Hide alternatives");
                showAlts = true;
            }

            dataTable.applyFilter();
            dataTable.refresh();
        });
    });

    dataTable.onDataFeedComplete(function(eArgs) {
        for (var i in dataTable.rows)
            dataTable.rows[i].selector.removeClass("alternative regular");

        if (true || showAlts) {
            for (var i in dataTable.rows) {
                var row = dataTable.rows[i].getValue();
                if (row.original_id == -1) {
                    // Is Original
                    dataTable.rows[i].selector.addClass("regular");
                } else
                if (row.original_id > 0) {
                    // Is Alternative
                    dataTable.rows[i].selector.addClass("alternative");
                }
            }
        }
    });
};
var F = function(args) {

    var tabPage = args.helpers.createTabPage({name:"Find Doubles"});

    var dataTable = new sic.widget.sicDataTable({
        parent:tabPage.content.selector,
        primaryKey: ['pub_id'],
        entityTitle: "Entity %pub_id% - %title%",
        canDelete: false,
        canInsert: false,
        dataSource: new sic.widget.sicDataTableDataSource({
            moduleName:"Regular/RegDoublesSearch",
            pageCount: 20
        }),
        editorModuleArgs: {
            moduleName:"Pub/PubEdit",
            tabPage:tabPage
        },
        fields: {
            pub_id: { hintF: function(args) { sic.hint.publication(args.row.lastRowData.pub_id) } },
            parent_id: { hintF: function(args) { sic.hint.publication(args.row.lastRowData.parent_id) } },
            series_id: { hintF: function(args) { sic.hint.publication(args.row.lastRowData.series_id) } },
            creator: { tagClass:"sicDataTable_shortText",
                hintF: function(args) { sic.showHint(sic.replacePipes(args.row.lastRowData.__creator_long, "<br/>")); } },
            title: { tagClass:"sicDataTable_shortText",
                hintF: function(args) { sic.showHint(sic.replacePipes(args.row.lastRowData.__title_long, "<br/>")); } },
            user_id: { caption:"Selected", editable:true, editorType: "checkbox", updateOnEnter: false }
        }
    });

    dataTable.onFieldClick(function(eArgs) {
        var row = eArgs.row.getValue();
        if (eArgs.field.fieldKey == "user_id") {

            sic.callMethod({moduleName: "Regular/RegDoublesSearch", methodName: "selectLineToggle",
                pub_id:row.pub_id}, function()
            {
                dataTable.refresh();
            });

        }
    });

    dataTable.onFirstFeedComplete(function() {

        var selectAllButton = new sic.widget.sicElement({parent:dataTable.dsControl.selector});
        selectAllButton.selector.addClass("inline filterButton vmid");
        var selectAllImg = new sic.widget.sicElement({parent:selectAllButton.selector, tagName:"img", tagClass:"icon12 vmid"});
        selectAllImg.selector.attr("src", "/img/icon/select_all.png");
        var selectAllSpan = new sic.widget.sicElement({parent:selectAllButton.selector, tagName:"span", tagClass:"vmid"});
        selectAllSpan.selector.html("Select all");
        selectAllButton.selector.click(function(e){
            sic.callMethod({moduleName: "Regular/RegDoublesSearch", methodName: "selectAll", filter: dataTable.filterRow.getFilterValue()},
                function() { dataTable.refresh(); });
        });

        var deselectAllButton = new sic.widget.sicElement({parent:dataTable.dsControl.selector});
        deselectAllButton.selector.addClass("inline filterButton vmid");
        var deselectAllImg = new sic.widget.sicElement({parent:deselectAllButton.selector, tagName:"img", tagClass:"icon12 vmid"});
        deselectAllImg.selector.attr("src", "/img/icon/deselect_all.png");
        var deselectAllSpan = new sic.widget.sicElement({parent:deselectAllButton.selector, tagName:"span", tagClass:"vmid"});
        deselectAllSpan.selector.html("Deselect all");
        deselectAllButton.selector.click(function(e){
            sic.callMethod({moduleName: "Regular/RegDoublesSearch", methodName: "deselectAll", filter: dataTable.filterRow.getFilterValue()},
                function() { dataTable.refresh(); });
        });

        var continueBtn = new sic.widget.sicElement({parent:dataTable.dsControl.selector});
        continueBtn.selector.addClass("inline filterButton vmid");
        var continueBtnImg = new sic.widget.sicElement({parent:continueBtn.selector, tagName:"img", tagClass:"icon12 vmid"});
        continueBtnImg.selector.attr("src", "/img/insert.png");
        var continueBtnSpan = new sic.widget.sicElement({parent:continueBtn.selector, tagName:"span", tagClass:"vmid"});
        continueBtnSpan.selector.html("Define Regular/Alternatives");
        continueBtn.selector.click(function(e){
            sic.loadModule({moduleName:'Regular/RegDoublesDefine', newTab:'Define Regular/Alternatives', tabPage: tabPage,
                onClosed: function(closeArgs){ dataTable.refresh(); } });
        });
    });


};
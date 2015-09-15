var F = function(args) {

    var tabPage = args.helpers.createTabPage({name:"Find Doubles"});

    var selectFieldNames = ["parent_id", "series_id", "original_id", "creator", "title", "addtitle", "idno", "addidno", "---",
        "year", "publisher", "edition", "place", "issue", "online", "note", "strng", "source", "page", "volume"];

    var dataTable = new sic.widget.sicDataTable({
        parent:tabPage.content.selector,
        primaryKey: ['pub_id'],
        entityTitle: "Entity %pub_id% - %title%",
        canDelete: false,
        canInsert: false,
        filter: { visible: true },
        dataSource: new sic.widget.sicDataTableDataSource({
            moduleName:"Regular/RegDoublesSearch",
            pageCount: 20,
            filterMode: "levenshtein"
        }),
        editorModuleArgs: {
            moduleName:"Pub/PubEdit",
            tabPage:tabPage
        },
        fields: {
            user_id: { caption:"Selected", editable:true, editorType: "checkbox", updateOnEnter: false },
            pub_id: { hintF: function(args) { sic.hint.publication(args.row.lastRowData.pub_id) } },
            parent_id: { hintF: function(args) { sic.hint.publication(args.row.lastRowData.parent_id) } },
            series_id: { hintF: function(args) { sic.hint.publication(args.row.lastRowData.series_id) } },
            original_id: { visible: false, caption: "Regular/Alt" },
            creator: { tagClass:"sicDataTable_shortText",
                hintF: function(args) { sic.showHint(sic.replacePipes(args.row.lastRowData.__creator_long, "<br/>")); } },
            title: { tagClass:"sicDataTable_shortText",
                hintF: function(args) { sic.showHint(sic.replacePipes(args.row.lastRowData.__title_long, "<br/>")); } },
            addtitle: { tagClass:"sicDataTable_shortText", caption: "Add Title", visible: false,
                hintF: function(args) { sic.showHint(sic.replacePipes(args.row.lastRowData.__addtitle_long, "<br/>")); } },
            idno: { visible: false },
            addidno: { visible: false, caption:"Add Idno" },

            year: { visible: false },
            publisher: { visible: false },
            edition: { visible: false },
            place: { visible: false },
            issue: { visible: false },
            online: { visible: false },
            note: { visible: false },
            strng: { visible: false, caption:"String" },
            source: { visible: false },
            page: { visible: false },
            volume: { visible: false },
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


        var fieldSelectHolder = new sic.widget.sicElement({parent:dataTable.dsControl.selector});
        fieldSelectHolder.selector.addClass("inline filterButton vmid");
        var fieldSelectImg = new sic.widget.sicElement({parent:fieldSelectHolder.selector, tagName:"img", tagClass:"icon16 vmid"});
        fieldSelectImg.selector.attr("src", "/img/icon/lookup.png");
        var fieldSelectSpan = new sic.widget.sicElement({parent:fieldSelectHolder.selector, tagName:"span", tagClass:"filterButton vmid"});
        fieldSelectSpan.selector.html("Select Fields");

        var fieldSelect = new sic.widget.sicMultiSelect({parent:fieldSelectHolder.selector});
        fieldSelect.selector.css("box-shadow", "silver 1px 1px 3px").css("z-index", "100").css("background", "white");
        fieldSelect.displayNone();

        for (var i in selectFieldNames) {
            if (selectFieldNames[i] == '---') {
                var hr = fieldSelect.addHr();
            } else {
                var fieldCaption = sic.captionize(selectFieldNames[i]);
                if (dataTable.fields[selectFieldNames[i]] && dataTable.fields[selectFieldNames[i]].caption)
                    fieldCaption = dataTable.fields[selectFieldNames[i]].caption;
                var selected = !(dataTable.fields[selectFieldNames[i]] && dataTable.fields[selectFieldNames[i]].visible === false);

                var option = fieldSelect.addButton(selectFieldNames[i], fieldCaption);
                option.setSelected(selected);
            }
        }

        fieldSelect.onSelectionChange(function(button) {
            var idx = button.index;
            var isSelected = button.isSelected;
            dataTable.setColumnVisible(idx, isSelected);
        });


        fieldSelectSpan.selector.click(function() {
            if (fieldSelect.isDisplay()) {
                fieldSelect.displayNone();
            } else {
                var pos = fieldSelectSpan.selector.position();
                fieldSelect.setAbsolute(pos.left -2, pos.top +16);
                fieldSelect.display();
            }
        });

    });

    dataTable.onDataFeedComplete(function(eArgs) {
        for (var i in dataTable.rows)
            dataTable.rows[i].selector.removeClass("alternative regular");

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
    });


};
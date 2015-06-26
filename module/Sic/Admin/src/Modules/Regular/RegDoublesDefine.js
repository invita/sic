var F = function(args) {

    var tabPage = args.helpers.createTabPage({name:"Doubles Define"});

    var dataTable = new sic.widget.sicDataTable({
        parent:tabPage.content.selector,
        primaryKey: ['pub_id'],
        entityTitle: "Entity %pub_id% - %title%",
        dataSource: new sic.widget.sicDataTableDataSource({
            moduleName:"Regular/RegDoublesDefine",
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
            temp_original_id: { visible:false }
        },
        actions: {
            regular: {
                label: 'Regular',
                type: 'button',
                onClick: function(args) {
                    sic.callMethod({ moduleName:"Regular/RegDoublesDefine", methodName:"setRegular", aSync:true,
                        pub_id:args.row.lastRowData.pub_id }, function() { dataTable.refresh(); });
                }
            },
            alt: {
                label: 'Alternative',
                type: 'button',
                onClick: function(args) {
                    sic.callMethod({ moduleName:"Regular/RegDoublesDefine", methodName:"setAlternative", aSync:true,
                        pub_id:args.row.lastRowData.pub_id }, function() { dataTable.refresh(); });
                }
            }

        },
        customInsert: function(insertDT) {
            sic.loadModule({moduleName:'Pub/PubSearch', tabPage:tabPage,  newTab:'Select entity',
                selectCallback: function(selectArgs){
                    var new_pub_id = selectArgs.row.getValue().pub_id;
                    if (new_pub_id) {
                        sic.callMethod({moduleName:"Regular/RegDoublesSearch", methodName:"selectLine", pub_id:new_pub_id},
                            function(response) { dataTable.refresh(); });
                    }
                }});

        }
    });

    dataTable.onRowSetValue(function(rvArgs){
        var originalId = rvArgs.rowData.temp_original_id;

        var regularButton = rvArgs.row.fields._actions.valueDiv.actions.regular;
        var altButton = rvArgs.row.fields._actions.valueDiv.actions.alt;

        var gradSel = "gradOrange";
        var gradDef = "gradBlue";

        if (originalId == -1) {
            // Is Regular
            regularButton.input.selector.removeClass(gradDef);
            regularButton.input.selector.addClass(gradSel);
            altButton.input.selector.removeClass(gradSel);
            altButton.input.selector.addClass(gradDef);
        } else if (originalId != 0) {
            // Is Alternative
            regularButton.input.selector.removeClass(gradSel);
            regularButton.input.selector.addClass(gradDef);
            altButton.input.selector.removeClass(gradDef);
            altButton.input.selector.addClass(gradSel);
        } else {
            // Is Unset
            regularButton.input.selector.removeClass(gradSel);
            regularButton.input.selector.addClass(gradDef);
            altButton.input.selector.removeClass(gradSel);
            altButton.input.selector.addClass(gradDef);
        }

        //sic.dump(rvArgs.row.fields._actions.valueDiv.actions, 0);
        //sic.dump(rvArgs.rowData, 0);
    });

    dataTable.onFirstFeedComplete(function() {
        var saveButton = new sic.widget.sicElement({parent:dataTable.dsControl.selector});
        saveButton.selector.addClass("inline filterButton vmid");
        var saveButtonImg = new sic.widget.sicElement({parent:saveButton.selector, tagName:"img", tagClass:"icon12 vmid"});
        saveButtonImg.selector.attr("src", "/img/icon/apply.png");
        var saveButtonSpan = new sic.widget.sicElement({parent:saveButton.selector, tagName:"span", tagClass:"vmid"});
        saveButtonSpan.selector.html("Save changes");
        saveButton.selector.click(function(e){
            sic.callMethod({moduleName:"Regular/RegDoublesDefine", methodName:"saveSelected"},
                function(response) { if (response.status) tabPage.parentTab.destroyTab(); });
        });
    });

};
var F = function(args) {
    var moduleArgs = args;

    var caption = "Project " + args.proj_id;
    if (args.proj_title) caption += " - "+args.proj_title;
    var tabPageBasic = args.helpers.createTabPage({name:"Select", caption: caption});

    var okButton;

    var linesTable = new sic.widget.sicDataTable({
        parent: tabPageBasic.content.selector,
        primaryKey: ['line_id'],
        entityTitle: "Line %idx% - %title%",
        canDelete: false,
        canInsert: false,
        filter: { visible:true },
        dataSource: new sic.widget.sicDataTableDataSource({
            moduleName:"Project/ProjectLineSelect",
            staticData: { proj_id: args.proj_id, deselectAll: true },
            pageCount: 500
        }),
        fields: {
            user_id: { caption:"Selected", editable:true, editorType: "checkbox", updateOnEnter: false },
            year: { caption:"Date" }
        }
    });

    linesTable.onFieldClick(function(eArgs) {
        if (eArgs.field.fieldKey == 'user_id') {
            var row = eArgs.row.getValue();
            sic.callMethod({moduleName: "Project/ProjectLineSelect", methodName: "selectLineToggle",
                proj_id: args.proj_id, line_id:row.line_id}, function()
            {
                linesTable.refresh();
            });
        }
    });

    linesTable.onFieldDoubleClick(function(eArgs) {
        if (eArgs.field.fieldKey != 'user_id') {
            var row = eArgs.row.getValue();
            sic.callMethod({moduleName: "Project/ProjectLineSelect", methodName: "selectOneLine",
                proj_id: args.proj_id, line_id:row.line_id}, function()
            {
                okButton.selector.click();
                linesTable.refresh();
            });
        }
    });

    linesTable.onFirstFeedComplete(function() {

        delete linesTable.dataSource.staticData.deselectAll;

        var selectAllButton = new sic.widget.sicElement({parent:linesTable.dsControl.selector});
        selectAllButton.selector.addClass("inline filterButton vmid");
        var selectAllImg = new sic.widget.sicElement({parent:selectAllButton.selector, tagName:"img", tagClass:"icon12 vmid"});
        selectAllImg.selector.attr("src", "/img/icon/select_all.png");
        var selectAllSpan = new sic.widget.sicElement({parent:selectAllButton.selector, tagName:"span", tagClass:"vmid"});
        selectAllSpan.selector.html("Select all");
        selectAllButton.selector.click(function(e){
            sic.callMethod({moduleName: "Project/ProjectLineSelect", methodName: "selectAll", proj_id: args.proj_id}, function() {
                linesTable.refresh();
            });
        });

        var deselectAllButton = new sic.widget.sicElement({parent:linesTable.dsControl.selector});
        deselectAllButton.selector.addClass("inline filterButton vmid");
        var deselectAllImg = new sic.widget.sicElement({parent:deselectAllButton.selector, tagName:"img", tagClass:"icon12 vmid"});
        deselectAllImg.selector.attr("src", "/img/icon/deselect_all.png");
        var deselectAllSpan = new sic.widget.sicElement({parent:deselectAllButton.selector, tagName:"span", tagClass:"vmid"});
        deselectAllSpan.selector.html("Deselect all");
        deselectAllButton.selector.click(function(e){
            sic.callMethod({moduleName: "Project/ProjectLineSelect", methodName: "deselectAll", proj_id: args.proj_id}, function() {
                linesTable.refresh();
            });
        });
    });


    var div = new sic.widget.sicElement({parent:tabPageBasic.content.selector});
    if (typeof(args.closeOKCallback) == "function") {
        okButton = new sic.widget.sicInput({parent:div.selector,type:"button", caption:false, name:"import"});
        okButton.selector.click(function() {
            args.closeOKCallback(args);

            tabPageBasic.parentTab.destroyTab();

            // They are going to want this functionality back, I guarantee it. (Today: 16.11.2015)
            //if (tabPageBasic.parentTab) {
            //    var citsPage = tabPageBasic.parentTab.header.findPageByName("Citations");
            //    if (citsPage) citsPage.selectTab();
            //}
        });
    }
};
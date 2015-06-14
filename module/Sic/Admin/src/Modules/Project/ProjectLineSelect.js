var F = function(args) {
    var moduleArgs = args;
    var tabPageBasic = args.helpers.createTabPage({name:"Select"});

    var linesTable = new sic.widget.sicDataTable({
        parent: tabPageBasic.content.selector,
        primaryKey: ['line_id'],
        entityTitle: "Line %idx% - %title%",
        canDelete: false,
        canInsert: false,
        dataSource: new sic.widget.sicDataTableDataSource({
            moduleName:"Project/ProjectLineSelect",
            staticData: { proj_id: args.proj_id },
            pageCount: 10
        }),
        fields: {
            user_id: { caption:"Selected", editable:true, editorType: "checkbox", updateOnEnter: false }
        }
    });

    linesTable.onFieldClick(function(eArgs) {
        var row = eArgs.row.getValue();

        sic.callMethod({moduleName: "Project/ProjectLineSelect", methodName: "selectLineToggle",
            proj_id: args.proj_id, line_id:row.line_id}, function()
        {
            linesTable.refresh();
        });
    });

    linesTable.onFirstFeedComplete(function() {
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
        var okButton = new sic.widget.sicInput({parent:div.selector,type:"button", caption:false, name:"import"});
        okButton.selector.click(function() {
            args.closeOKCallback(args);
            tabPageBasic.destroyTab();
        });
    }
};
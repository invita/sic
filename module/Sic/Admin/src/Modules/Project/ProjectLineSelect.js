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
/*
        editorModuleArgs: {
            moduleName:"Project/ProjectLineEdit",
            tabPage:tabPagePub,
            parseRow: function(row) { return sic.mergeObjects(row, row.line); },

            publication: {
                moduleName:"Pub/PubEdit",
                tabPage:tabPagePub,
                parseRow: function(row) { return sic.mergeObjects(row, row.publication); },
                entityTitle: "Pub %pub_id% - %title%"
            }
        },
        fields: {
            line_id: { visible: false },
            proj_id: { visible: false },
            idx: { visible: false },
            title: { visible: false },
            line: { formView: {}, tagClass:"minWidth300 valignTop", canSort:false },
            publication: { formView: {}, tagClass:"minWidth300 valignTop", canSort:false },
        },
        actions: {
            link: {
                label: 'Search',
                type: 'button',
                onClick: function(args) {
                    var rowValue = args.row.getValue();
                    //sic.dump(rowValue);
                    var projLine = rowValue.line;
                    var pub = rowValue.publication;
                    var filter = {};
                    for (var i in projLine) {
                        if (projLine[i])
                            filter[i] = "*"+projLine[i]+"*";
                    }
                    //if (projLine.creator) filter.creator = "*"+projLine.creator+"*";
                    //if (projLine.title) filter.title = "*"+projLine.title+"*";
                    var line_id = args.row.getValue().line_id;

                    sic.loadModule({moduleName:'Pub/PubSearch', tabPage:tabPageBasic,  newTab:'Search for Line '+line_id,
                        filter: filter, selectCallback: function(selectArgs){
                            var pub_id = selectArgs.row.getValue().pub_id;
                            var proj_id = moduleArgs.proj_id;
                            if (line_id && pub_id) {
                                var response = sic.callMethod({moduleName:"Project/ProjectLineEdit",
                                        methodName:"linkLine", line_id: line_id, pub_id: pub_id, proj_id: proj_id},
                                    function(response) { linesTable.refresh(); });
                            }
                        }});
                }
            }
        }
*/
    });
    linesTable.onFieldClick(function(eArgs) {
        var row = eArgs.row.getValue();

        sic.callMethod({moduleName: "Project/ProjectLineSelect", methodName: "selectLineToggle",
            proj_id: args.proj_id, line_id:row.line_id}, function()
        {
            linesTable.refresh();
        });

        //row.line_id
        //sic.dump(row);
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
var F = function(args) {
    var moduleArgs = args;
    var tabPageBasic = args.helpers.createTabPage({name:"Select"});

    var linesTable = new sic.widget.sicDataTable({
        parent: tabPageBasic.content.selector,
        primaryKey: ['line_id'],
        entityTitle: "Line %idx% - %title%",
        dataSource: new sic.widget.sicDataTableDataSource({
            moduleName:"Project/ProjectLineSelect",
            staticData: { proj_id: args.proj_id },
            pageCount: 100
        }),
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

};
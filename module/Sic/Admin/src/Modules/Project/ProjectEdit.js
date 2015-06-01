var F = function(args) {
    var moduleArgs = args;
    var tabPageBasic = args.helpers.createTabPage({name:"Basic"});
    var scrollToY = 0;

    var panel = new sic.widget.sicPanel({parent:tabPageBasic.content.selector, firstGroupName: "Project"});

    var formProj = new sic.widget.sicForm({parent:panel.firstGroup.content.selector, captionWidth:"100px"});
    formProj.addInput({name:"proj_id", type:"text", placeholder:"Project Id...", readOnly:true});
    formProj.addInput({name:"title", type:"text", placeholder:"Title..."});
    formProj.addInput({name:"save", type:"submit", value:"Save", caption:" "}).selector.click(function(e){
        var response = sic.callMethod({moduleName:"Project/ProjectEdit", methodName:"projUpdate",
            proj_id: args.proj_id, data:formProj.getValue()});
        if (response && response.data) {
            formProj.setValue(response.data);
            args.proj_id = response.data.proj_id;
            linesTable.dataSource.staticData.proj_id = response.data.proj_id;
            tabPageBasic.parentTab.setCaption(sic.mergePlaceholders(args.entityTitle, response.data));
        }
    });
    formProj.addHr();
    formProj.addInput({name:"_pubCount", type:"flat", value:"", readOnly: true, caption:"Publication Count"});
    formProj.addInput({name:"importXml", type:"button", value:"Import Xml", caption:"Import / Export"}).selector.click(function(e){
        var fileUploader = new sic.object.sicFileUploader({ fileNamePrefix: 'project'+args.proj_id+'_' });
        fileUploader.onUploadComplete(function(data){
            var upArgs = {moduleName:"Project/ProjectEdit", methodName:"loadXml", proj_id: args.proj_id, fileName:fileUploader.getFileName()};
            sic.callMethod(upArgs, function(respArgs) {
                if (respArgs.status) {
                    linesTable.refresh(); tabPagePub.selectTab();
                }
            });
        });
    });
    formProj.addInput({name:"exportXml", type:"button", value:"Export Xml"}).selector.click(function(e){ });


    var hasLines = args.proj_id && args.row && parseInt(args.row['lines_count']) ? true : false;
    var tabPagePub = tabPageBasic.createTabPage({name:"List", canClose:false, autoActive: hasLines });
    var panelPub = new sic.widget.sicPanel({parent:tabPagePub.content.selector});
    panelPub.addGroup();

    var linesTable = new sic.widget.sicDataTable({
        parent: panelPub.firstGroup.content.selector,
        primaryKey: ['line_id', 'idx', 'proj_id', 'pub_id'],
        entityTitle: "Line %idx% - %title%",
        hoverRows:false,
        filter: { enabled: false },
        dataSource: new sic.widget.sicDataTableDataSource({
            moduleName:"Project/ProjectEdit_ProjectLinesDT",
            staticData: { proj_id: args.proj_id },
            pageCount: 100
        }),
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
                    if (projLine.creator) filter.creator = "*"+projLine.creator+"*";
                    if (projLine.title) filter.title = "*"+projLine.title+"*";
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
    });
    linesTable.onRowSetValue(function(eArgs) {
        var lineForm = eArgs.row.fields.line.formViewInstance;
        var pubForm = eArgs.row.fields.publication.formViewInstance;

        for (var i in lineForm.inputs) {
            var lineInput = lineForm.inputs[i];
            var pubInput = pubForm.inputs[i] ? pubForm.inputs[i] : null;
            var lineVal = lineInput.getValue();
            var pubVal = pubInput ? pubInput.getValue() : '';

            if (!lineVal && !pubVal) {
                lineInput.displayNone();
                if (pubInput) pubInput.displayNone();
            } else {
                lineInput.display();
                if (pubInput) pubInput.display();
            }
        }
        //sic.dump(eArgs.row.fields.line.formViewInstance.inputs, 0);
        //sic.dump(eArgs.row.fields.publication, 0);
        //eArgs.row.

        // Color fulfilled rows
        if (eArgs.rowData.publication && eArgs.rowData.publication.pub_id) {
            eArgs.row.selector.addClass("projectLineFulfilled");
        } else {
            eArgs.row.selector.removeClass("projectLineFulfilled");
            if (scrollToY == 0)
                scrollToY = eArgs.row.selector.position().top;
        }


    });
    linesTable.onDataFeed(function(data){ scrollToY = 0; formProj.inputs['_pubCount'].setValue(data['rowCount']); });
    linesTable.onFirstFeedComplete(function() {
        var scrollToFirstUnful = new sic.widget.sicElement({parent:linesTable.dsControl.selector});
        scrollToFirstUnful.selector.addClass("inline filterButton vmid");
        var scrollToFirstUnfulImg = new sic.widget.sicElement({parent:scrollToFirstUnful.selector, tagName:"img", tagClass:"icon12 vmid"});
        scrollToFirstUnfulImg.selector.attr("src", "/img/icon/lookup.png");
        var scrollToFirstUnfulSpan = new sic.widget.sicElement({parent:scrollToFirstUnful.selector, tagName:"span", tagClass:"vmid"});
        scrollToFirstUnfulSpan.selector.html("Scroll to first Unlinked");
        scrollToFirstUnful.selector.click(function(e){
            window.scrollTo(0, scrollToY);
        });
    });


    if (args.proj_id){
        var response = sic.callMethod({moduleName:"Project/ProjectEdit", methodName:"projSelect", proj_id: args.proj_id});
        if (response && response.data) formProj.setValue(response.data);
    }

};
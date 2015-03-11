var F = function(args) {
    var tabPageBasic = args.helpers.createTabPage({name:"Basic"});

    var panel = new sic.widget.sicPanel({parent:tabPageBasic.content.selector, firstGroupName: "Project"});

    var formProj = new sic.widget.sicForm({parent:panel.firstGroup.content.selector, captionWidth:"100px"});
    formProj.addInput({name:"id", type:"text", placeholder:"Id...", readOnly:true});
    formProj.addInput({name:"title", type:"text", placeholder:"Title..."});
    formProj.addInput({name:"save", type:"submit", value:"Save", caption:" "}).selector.click(function(e){
        var response = sic.callMethod({moduleName:"Project/ProjectEdit", methodName:"projUpdate",
            id: args.id, data:formProj.getValue()});
        if (response && response.data) {
            formProj.setValue(response.data);
            var projId = response.data.id;
            args.id = projId;
            linesTable.dataSource.staticData.projectId = projId;
            //pubListTable.dataSource.staticData.projectId = projId;

            tabPageBasic.parentTab.setCaption(sic.mergePlaceholders(args.entityTitle, response.data));
        }
    });
    formProj.addHr();
    formProj.addInput({name:"_pubCount", type:"flat", value:"", readOnly: true, caption:"Publication Count"});
    formProj.addInput({name:"importXml", type:"button", value:"Import Xml", caption:"Import / Export"}).selector.click(function(e){
        var fileUploader = new sic.object.sicFileUploader({ fileNamePrefix: 'project'+args.id+'_' });
        fileUploader.onUploadComplete(function(data){
            var upArgs = {moduleName:"Project/ProjectEdit", methodName:"loadXml", id: args.id, fileName:fileUploader.getFileName()};
            sic.callMethod(upArgs, function(args) {
                linesTable.refresh(); tabPagePub.selectTab();
                formProj.inputs['_pubCount'].setValue(args['count']);
            });
        });
    });
    formProj.addInput({name:"exportXml", type:"button", value:"Export Xml"}).selector.click(function(e){ });


    var hasLines = args.id && args.row && parseInt(args.row['lines_count']) ? true : false;
    if (hasLines) formProj.inputs['_pubCount'].setValue(args.row['lines_count']);
    var tabPagePub = tabPageBasic.createTabPage({name:"Publications", canClose:false, autoActive: hasLines });
    var panelPub = new sic.widget.sicPanel({parent:tabPagePub.content.selector, firstGroupName: "Project Lines List"});

    var linesTable = new sic.widget.sicDataTable({
        parent: panelPub.firstGroup.content.selector,
        primaryKey: ['id'],
        entityTitle: "Line %id% - %title%",
        canInsert: false,
        //canDelete: false,
        dataSource: new sic.widget.sicDataTableDataSource({
            moduleName:"Project/ProjectEdit_ProjectLinesDT",
            staticData: { projectId: args.id }
        })
        //editorModuleArgs: {
        //    moduleName:"Pub/PubEdit",
        //    tabPage:tabPageBasic
        //}
    });
    /*

    var panelPubList = panelPub.addGroup("Project Publication List");
    var pubListTable = new sic.widget.sicDataTable({
        parent:panelPubList.content.selector,
        primaryKey: ['id'],
        entityTitle: "Pub %id% - %title%",
        dataSource: new sic.widget.sicDataTableDataSource({
            moduleName:"Pub/PubList",
            staticData: { projectId: args.id }
        }),
        editorModuleArgs: {
            moduleName:"Pub/PubEdit",
            tabPage:tabPageBasic
        }
    });
    */

    //var panelViewPub = panel.addGroup("View Publication");

    if (args.id){
        var response = sic.callMethod({moduleName:"Project/ProjectEdit", methodName:"projSelect", id: args.id});
        if (response && response.data) formProj.setValue(response.data);
    }

};
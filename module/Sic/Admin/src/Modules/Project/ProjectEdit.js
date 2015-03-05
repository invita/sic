var F = function(args) {
    var tabPage = args.helpers.createTabPage({name:"Basic"});

    var panel = new sic.widget.sicPanel({parent:tabPage.content.selector, firstGroupName: "Project"});

    var formProj = new sic.widget.sicForm({parent:panel.firstGroup.content.selector, captionWidth:"100px"});
    formProj.addInput({name:"id", type:"text", placeholder:"Id...", readOnly:true});
    formProj.addInput({name:"title", type:"text", placeholder:"Title..."});
    formProj.addInput({name:"save", type:"submit", value:"Save", caption:" "}).selector.click(function(e){
        var response = sic.callMethod({moduleName:"Project/ProjectEdit", methodName:"projUpdate",
            id: args.id, data:formProj.getValue()});
        if (response && response.data) {
            formProj.setValue(response.data);
            args.id = response.data.id;
            tabPage.parentTab.setCaption(sic.mergePlaceholders(args.entityTitle, response.data));
        }
    });
    formProj.addHr();
    formProj.addInput({name:"_pubCount", type:"flat", value:"3", readOnly: true, caption:"Publication Count"});
    formProj.addInput({name:"importXml", type:"button", value:"Import Xml", caption:"Import / Export"}).selector.click(function(e){ });
    formProj.addInput({name:"exportXml", type:"button", value:"Export Xml"}).selector.click(function(e){ });


    var panelPubList = panel.addGroup("Publication List");
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
            tabPage:tabPage
        }
    });

    var panelViewPub = panel.addGroup("View Publication");


    if (args.id){
        var response = sic.callMethod({moduleName:"Project/ProjectEdit", methodName:"projSelect", id: args.id});
        if (response && response.data) formProj.setValue(response.data);
    }

};
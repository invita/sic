var F = function(args) {
    var tabPage = args.helpers.createTabPage({name:"Basic"});

    var panel = new sic.widget.sicPanel({parent:tabPage.content.selector, firstGroupName:"Project Line"});

    var formLineData = new sic.widget.sicForm({parent:panel.firstGroup.content.selector, captionWidth:"100px"});
    formLineData.addInput({name:"id", type:"text", placeholder:"Id...", readOnly:true});
    formLineData.addInput({name:"author", type:"text", placeholder:"Author..."});
    formLineData.addInput({name:"title", type:"text", placeholder:"Title..."});
    formLineData.addInput({name:"cobiss", type:"text", placeholder:"Cobiss..."});
    formLineData.addInput({name:"issn", type:"text", placeholder:"Issn..."});
    formLineData.addInput({name:"publication_id", type:"text", placeholder:"Publication Id..."});
    formLineData.addInput({name:"save", type:"submit", value:"Save", caption:" "}).selector.click(function(e){
        var response = sic.callMethod({moduleName:"Project/ProjectLineEdit", methodName:"projLineUpdate",
            id: args.id, projectId: args.staticData.projectId, data:formLineData.getValue()});
        if (response && response.data) {
            formLineData.setValue(response.data);
            args.id = response.data.id;
            tabPage.parentTab.setCaption(sic.mergePlaceholders(args.entityTitle, response.data));
        }
    });
    formLineData.addInput({name:"cancel", type:"button", value:"Cancel"}).selector.click(function(e){ });
    formLineData.addInput({name:"clear", type:"button", value:"Clear"}).selector.click(function(e){ });

    if (args.id){
        var response = sic.callMethod({moduleName:"Project/ProjectLineEdit", methodName:"projLineSelect", id: args.id});
        if (response && response.data) formLineData.setValue(response.data);
    }
};
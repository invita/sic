var F = function(args) {
    var tabPage = args.helpers.createTabPage({name:"Basic"});

    var panel = new sic.widget.sicPanel({parent:tabPage.content.selector,
        firstGroupName:args.id ? "Update Pub (id: "+args.id+")" : "Insert Pub"});

    var formUserData = new sic.widget.sicForm({parent:panel.firstGroup.content.selector, captionWidth:"100px"});
    formUserData.addInput({name:"id", type:"text", placeholder:"Id...", readOnly:true});
    formUserData.addInput({name:"parent_id", type:"text", placeholder:"ParentId..."});
    //formUserData.addInput({name:"parentName", type:"text", placeholder:"ParentName..."});
    formUserData.addInput({name:"author", type:"text", placeholder:"Author...", isArray:true});
    formUserData.addInput({name:"title", type:"text", placeholder:"Title...", isArray:true});
    formUserData.addInput({name:"year", type:"text", placeholder:"Year..."});
    formUserData.addInput({name:"cobiss", type:"text", placeholder:"Cobiss..."});
    formUserData.addInput({name:"issn", type:"text", placeholder:"Issn..."});
    formUserData.addInput({name:"original_id", type:"text", placeholder:"OriginalId..."});
    formUserData.addInput({name:"child_id", type:"text", placeholder:"ChildId...", isArray:true});
    formUserData.addInput({name:"save", type:"submit", value:"Save", caption:" "}).selector.click(function(e){
        var response = sic.callMethod({moduleName:"Pub/PubEdit", methodName:"pubUpdate",
            id: args.id, data:formUserData.getValue()});
        if (response && response.data) {
            formUserData.setValue(response.data);
            args.id = response.data.id;
            panel.firstGroup.setName("Update Pub (id: "+response.data.id+")");
            tabPage.parentTab.setCaption(sic.mergePlaceholders(args.entityTitle, response.data));
        }
    });
    formUserData.addInput({name:"cancel", type:"button", value:"Cancel"}).selector.click(function(e){ });
    formUserData.addInput({name:"clear", type:"button", value:"Clear"}).selector.click(function(e){ });


    if (args.id){
        var response = sic.callMethod({moduleName:"Pub/PubEdit", methodName:"pubSelect", id: args.id});
        if (response && response.data) formUserData.setValue(response.data);
    }
};
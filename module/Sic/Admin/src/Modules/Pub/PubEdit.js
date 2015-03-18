var F = function(args) {
    var tabPage = args.helpers.createTabPage({name:"Basic"});

    if (!args.proj_id) args.proj_id = sic.getArg(args.staticData, 'proj_id', null);

//    sic.dump(args, 0);

    var cobissData = sic.getArg(args, 'cobissData', null);
    var author = sic.getArg(cobissData, 'author', null);
    var title = sic.getArg(cobissData, 'title', null);
    var year = sic.getArg(cobissData, 'year', null);

    var panel = new sic.widget.sicPanel({parent:tabPage.content.selector,
        firstGroupName:"Update Publication"});

    var formUserData = new sic.widget.sicForm({parent:panel.firstGroup.content.selector, captionWidth:"100px"});
    formUserData.addInput({name:"pub_id", type:"text", placeholder:"Id...", readOnly:true});

    // TODO: Lookup...
    formUserData.addInput({name:"parent_id", type:"text", placeholder:"Parent...", lookup:{
        editorModuleArgs: { moduleName:"Pub/PubEdit", tabPage:tabPage, map: { parent_id: "pub_id" } } }});
    //formUserData.addInput({name:"parentName", type:"text", placeholder:"ParentName..."});
    formUserData.addInput({name:"author", type:"text", placeholder:"Author...", isArray:true, value:[author]});
    formUserData.addInput({name:"title", type:"text", placeholder:"Title...", isArray:true, value:[title]});
    formUserData.addInput({name:"year", type:"text", placeholder:"Year...", value:year});
    formUserData.addInput({name:"cobiss", type:"text", placeholder:"Cobiss..."});
    formUserData.addInput({name:"issn", type:"text", placeholder:"Issn..."});
    formUserData.addInput({name:"original_id", type:"text", placeholder:"OriginalId...", lookup:{} });
    formUserData.addInput({name:"child_id", type:"text", placeholder:"ChildId...", isArray:true, lookup:{} });
    formUserData.addInput({name:"save", type:"submit", value:"Save", caption:" "}).selector.click(function(e){
        var response = sic.callMethod({moduleName:"Pub/PubEdit", methodName:"pubUpdate",
            pub_id: args.pub_id, proj_id: args.proj_id, line_id: args.line_id, data:formUserData.getValue()});
        if (response && response.data) {
            formUserData.setValue(response.data);
            args.pub_id = response.data.pub_id;
            tabPage.parentTab.setCaption(sic.mergePlaceholders(args.entityTitle, response.data));
        }
    });
    formUserData.addInput({name:"cancel", type:"button", value:"Cancel"}).selector.click(function(e){ });
    formUserData.addInput({name:"clear", type:"button", value:"Clear"}).selector.click(function(e){ });


    if (args.pub_id){
        var response = sic.callMethod({moduleName:"Pub/PubEdit", methodName:"pubSelect", pub_id: args.pub_id});
        if (response && response.data) formUserData.setValue(response.data);
    }
};
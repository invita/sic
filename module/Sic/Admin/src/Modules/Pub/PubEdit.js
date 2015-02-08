var F = function(args) {
    var tabPage = args.helpers.createTabPage({name:"Basic"});

    var panel = new sic.widget.sicPanel({parent:tabPage.content.selector,
        firstGroupName:args.id ? "Update Pub (id: "+args.id+")" : "Insert Pub"});

    var formUserData = new sic.widget.sicForm({parent:panel.firstGroup.content.selector});
    formUserData.addInput({name:"id", type:"text", placeholder:"Id..."});
    formUserData.addInput({name:"name", type:"text", placeholder:"Name..."});
    formUserData.addInput({name:"save", type:"submit", value:"Save"}).selector.click(function(e){
        var response = sic.callMethod({moduleName:"Pub/PubEdit", methodName:"pubUpdate",
            id: args.id, data:formUserData.getValue()});
        formUserData.setValue(response.data);
        args.id = response.data.id;
        panel.firstGroup.setName("Update Pub (id: "+response.data.id+")");
        tabPage.parentTab.setCaption(sic.mergePlaceholders(args.entityTitle, response.data));
    });

    if (args.id){
        var response = sic.callMethod({moduleName:"Pub/PubEdit", methodName:"pubSelect", id: args.id});
        if (response && response.data) formUserData.setValue(response.data);
    }
};
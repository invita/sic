var F = function(args) {
    var tabPage = args.helpers.createTabPage({name:"Basic"});

    var panel = new sic.widget.sicPanel({parent:tabPage.content.selector,
            firstGroupName:args.id ? "Update User (id: "+args.id+")" : "Insert User"});

    var formUserData = new sic.widget.sicForm({parent:panel.firstGroup.content.selector});
    formUserData.addInput({name:"username", type:"text", placeholder:"Username..."});
    formUserData.addInput({name:"save", type:"submit", value:"Save"}).selector.click(function(e){
            var response = sic.callMethod({moduleName:"Users/Manage", methodName:"updateUser",
                id: args.id, data:formUserData.getValue()});
            formUserData.setValue(response.data);
            args.id = response.data.id;
            panel.firstGroup.setName("Update User (id: "+response.data.id+")");
            tabPage.parentTab.setCaption(sic.mergePlaceholders(args.caption, response.data));
        });


    var panelGroup2 = panel.addGroup("Reset password");
    var formPassword = new sic.widget.sicForm({parent:panelGroup2.content.selector});
    formPassword.addInput({name:"password", type:"password", placeholder:"Password..."});
    formPassword.addInput({name:"reset", type:"submit", value:"Reset"}).selector.click(function(e){
            var response = sic.callMethod({moduleName:"Users/Manage", methodName:"updatePassword",
                id: args.id, data:formPassword.getValue()});
            formPassword.setValue({password:""});
        });

    if (args.id){
        var response = sic.callMethod({moduleName:"Users/Manage", methodName:"getUser", id: args.id});
        formUserData.setValue(response.data);
    }
};
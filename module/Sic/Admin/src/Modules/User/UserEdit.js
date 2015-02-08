var F = function(args) {
    var tabPage = args.helpers.createTabPage({name:"Basic"});

    var panel = new sic.widget.sicPanel({parent:tabPage.content.selector,
            firstGroupName:args.id ? "Update User (id: "+args.id+")" : "Insert User"});

    var formUserData = new sic.widget.sicForm({parent:panel.firstGroup.content.selector});
    formUserData.addInput({name:"username", type:"text", placeholder:"Username..."});
    formUserData.addInput({name:"email", type:"text", placeholder:"Email..."});
    formUserData.addInput({name:"notes", type:"textarea", placeholder:"Notes..."});
    formUserData.addInput({name:"save", type:"submit", value:"Save"}).selector.click(function(e){
            var response = sic.callMethod({moduleName:"User/UserEdit", methodName:"updateUser",
                id: args.id, data:formUserData.getValue()});
            formUserData.setValue(response.data);
            args.id = response.data.id;
            panel.firstGroup.setName("Update User (id: "+response.data.id+")");
            tabPage.parentTab.setCaption(sic.mergePlaceholders(args.entityTitle, response.data));
        });


    var panelGroup2 = panel.addGroup("Reset password");
    var formPassword = new sic.widget.sicForm({parent:panelGroup2.content.selector});
    formPassword.addInput({name:"password", type:"password", placeholder:"Password..."});
    formPassword.addInput({name:"reset", type:"submit", value:"Reset"}).selector.click(function(e){

/*
        if (formPassword.getValue().password || confirm('Are you sure you want to clear password for '+
                sic.mergePlaceholders(args.entityTitle, args.data))) {
        }
*/
        var response = sic.callMethod({moduleName:"User/UserEdit", methodName:"updatePassword",
            id: args.id, data:formPassword.getValue()});
        formPassword.setValue({password:""});
    });

    if (args.id){
        var response = sic.callMethod({moduleName:"User/UserEdit", methodName:"getUser", id: args.id});
        if (response && response.data) formUserData.setValue(response.data);
    }
};
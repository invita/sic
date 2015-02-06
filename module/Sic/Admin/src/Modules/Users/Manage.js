var F = function(args) {
    var tabPage = args.helpers.createTabPage({name:"Basic"});

    var panel = new sic.widget.sicPanel({parent:tabPage.content.selector, firstGroupName:"Update user"});

    var formUserData = new sic.widget.sicForm({parent:panel.firstGroup.content.selector});
    //formUserData.addInput({name:"id", type:"text", placeholder:"Id...", readOnly: true});
    formUserData.addInput({name:"username", type:"text", placeholder:"Username..."});
    formUserData.addInput({name:"save", type:"submit", value:"Save"}).selector.click(function(e){
            var response = sic.callMethod({moduleName:"Users/Manage", methodName:"updateUser",
                userId: args.userId, userData:formUserData.getValue()});
            formUserData.setValue(response.userData);
        });


    var panelGroup2 = panel.addGroup("Reset password");
    var formPassword = new sic.widget.sicForm({parent:panelGroup2.content.selector});
    //formPassword.addInput({name:"id", type:"text", placeholder:"Id...", readOnly: true});
    formPassword.addInput({name:"password", type:"password", placeholder:"Password..."});
    formPassword.addInput({name:"reset", type:"submit", value:"Reset"}).selector.click(function(e){
            var response = sic.callMethod({moduleName:"Users/Manage", methodName:"updatePassword",
                userId: args.userId, userData:formPassword.getValue()});
            formPassword.setValue({password:""});
        });


    var data = sic.callMethod({moduleName:"Users/Manage", methodName:"getUser", userId: args.userId});
    formUserData.setValue(data.userData);

};
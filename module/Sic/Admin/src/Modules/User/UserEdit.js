var F = function(args) {
    var tabPageBasic = args.helpers.createTabPage({name:"Basic"});

    var panelBasic = new sic.widget.sicPanel({parent:tabPageBasic.content.selector,
            firstGroupName:args.id ? "Update User (id: "+args.id+")" : "Insert User"});

    var formUserData = new sic.widget.sicForm({parent:panelBasic.firstGroup.content.selector});
    formUserData.addInput({name:"username", type:"text", placeholder:"Username...", caption:""});
    formUserData.addInput({name:"email", type:"text", placeholder:"Email...", caption:""});
    formUserData.addInput({name:"notes", type:"textarea", placeholder:"Notes...", caption:""});
    formUserData.addInput({name:"save", type:"submit", value:"Save"}).selector.click(function(e){
            var response = sic.callMethod({moduleName:"User/UserEdit", methodName:"updateUser",
                id: args.id, data:formUserData.getValue()});
            formUserData.setValue(response.data);
            args.id = response.data.id;
        panelBasic.firstGroup.setName("Update User (id: "+response.data.id+")");
        tabPageBasic.parentTab.setCaption(sic.mergePlaceholders(args.entityTitle, response.data));
        });


    var panelGroup2 = panelBasic.addGroup("Reset password");
    var formPassword = new sic.widget.sicForm({parent:panelGroup2.content.selector});
    formPassword.addInput({name:"password", type:"password", placeholder:"Password...", caption:""});
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


/*
    var tabPagePerm = tabPageBasic.parentTab.createChildPage({name:"Permissions", canClose:false}); //args.helpers.createTabPage({name:"Permissions", canClose:false, tabPage: tabPageBasic });
    var panelPerm = new sic.widget.sicPanel({parent:tabPagePerm.content.selector,
        firstGroupName:"Permissions"});
    panelPerm.firstGroup.content.selector.html("...");
*/

    if (args.id){
        var response = sic.callMethod({moduleName:"User/UserEdit", methodName:"getUser", id: args.id});
        if (response && response.data) formUserData.setValue(response.data);
    }


};
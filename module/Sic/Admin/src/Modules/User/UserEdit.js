var F = function(args) {

    // *** Basic ***
    var tabPageBasic = args.helpers.createTabPage({name:"Basic"});
    var panelBasic = new sic.widget.sicPanel({parent:tabPageBasic.content.selector,
            firstGroupName:args.id ? "Update User (id: "+args.id+")" : "Insert User"});

    var formUserData = new sic.widget.sicForm({parent:panelBasic.firstGroup.content.selector, captionWidth:"100px"});
    formUserData.addInput({name:"username", type:"text", placeholder:"Username...", caption:"username"});
    formUserData.addInput({name:"email", type:"text", placeholder:"Email...", caption:"email"});
    formUserData.addInput({name:"notes", type:"textarea", placeholder:"Notes...", caption:"notes"});
    formUserData.addInput({name:"zotero_id", type:"text", placeholder:"Zotero UserId...", caption:"zotero user"});
    formUserData.addInput({name:"zotero_col", type:"text", placeholder:"Zotero CollectionId...", caption:"zotero collection"});
    formUserData.addInput({name:"zotero_key", type:"text", placeholder:"Zotero Key...", caption:"zotero key"});
    formUserData.addInput({name:"save", type:"submit", value:"Save", caption: " "}).selector.click(function(e){
            var response = sic.callMethod({moduleName:"User/UserEdit", methodName:"updateUser",
                id: args.id, data:formUserData.getValue()});
            formUserData.setValue(response.data);
            args.id = response.data.id;
        panelBasic.firstGroup.setName("Update User (id: "+response.data.id+")");
        tabPageBasic.parentTab.setCaption(sic.mergePlaceholders(args.entityTitle, response.data));
        });



    // *** Reset Password ***

    var panelGroup2 = panelBasic.addGroup("Reset password");
    var formPassword = new sic.widget.sicForm({parent:panelGroup2.content.selector, captionWidth:"100px"});
    formPassword.addInput({name:"password", type:"password", placeholder:"Password...", caption:"password"});
    formPassword.addInput({name:"reset", type:"submit", value:"Reset", caption:" "}).selector.click(function(e){
        if (!formPassword.getValue().password && !confirm('Are you sure you want to clear password for '+
                sic.mergePlaceholders(args.entityTitle, {id:args.id, username:formUserData.getValue().username})))
        {
            return;
        }

        var response = sic.callMethod({moduleName:"User/UserEdit", methodName:"updatePassword",
            id: args.id, data:formPassword.getValue()});
        formPassword.setValue({password:""});
    });


    // *** Permissions ***

    var tabPagePerm = tabPageBasic.createTabPage({name:"Permissions", canClose:false, autoActive:false});
    //args.helpers.createTabPage({name:"Permissions", canClose:false, tabPage: tabPageBasic });
    var panelPerm = new sic.widget.sicPanel({parent:tabPagePerm.content.selector,
        firstGroupName:"Module Access"});
    var formPermModule = new sic.widget.sicForm({parent:panelPerm.firstGroup.content.selector});
    formPermModule.addInput({name:"moduleAccess", inputConstruct: sic.widget.sicMultiSelect,
        values:['Search', 'Publications', 'Users', 'System'], multiSelect: false});
    formPermModule.addInput({name:"save", type:"submit", value:"Save"}).selector.click(function(e){
        var response = sic.callMethod({moduleName:"User/UserEdit", methodName:"updatePermissions",
            id: args.id, data:formPermModule.getValue()});
    });
    var panelPermLevelGroup = panelPerm.addGroup('Security Level');
    var formPermLevel = new sic.widget.sicForm({parent:panelPermLevelGroup.content.selector});
    formPermLevel.addInput({name:"levelAccess", inputConstruct: sic.widget.sicMultiSelect,
            values:['superAdmin', 'systemAdmin', 'systemModerator', 'manager', 'advancedUser', 'starterUser'],
            multiSelect: true});
    formPermLevel.addInput({name:"save", type:"submit", value:"Save"}).selector.click(function(e){
        var response = sic.callMethod({moduleName:"User/UserEdit", methodName:"updatePermissions",
            id: args.id, data:formPermLevel.getValue()});
    });


    // *** Refresh ***
    if (args.id){
        var response = sic.callMethod({moduleName:"User/UserEdit", methodName:"getUser", id: args.id});
        if (response && response.data) formUserData.setValue(response.data);
    }


};
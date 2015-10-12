var F = function(args) {
    var tabPage = args.helpers.createTabPage({name:"Basic"});

    var panel = new sic.widget.sicPanel({parent:tabPage.content.selector, firstGroupName:"Project Line"});

    var formLineData = new sic.widget.sicForm({parent:panel.firstGroup.content.selector, captionWidth:"100px"});
    formLineData.addInput({name:"line_id", type:"text", placeholder:"Line Id...", readOnly:true});
    formLineData.addInput({name:"pub_id", type:"text", placeholder:"Publication Id...", value:sic.getArg(args.staticData, "pub_id", 0)});

    var codemirror = formLineData.addInput({name:"xml", type:"codemirror", placeholder:"Xml...", caption:false});
    codemirror.selector.css("width", $(window).width()+"px");

    formLineData.addInput({name:"save", type:"submit", value:"Save", caption:" "}).selector.click(function(e){
        var response = sic.callMethod({moduleName:"Project/ProjectLineEdit", methodName:"projLineUpdate",
            line_id: args.line_id, proj_id: args.staticData.proj_id, data:formLineData.getValue()});
        if (response && response.data) {

            if (confirm("Saved! Do you want to close this tab?")) {
                tabPage.parentTab.destroyTab();
            } else {
                formLineData.setValue(response.data);
                args.line_id = response.data.line_id;
            }
        }
    });

    /*
    formLineData.addInput({name:"cancel", type:"button", value:"Cancel"}).selector.click(function(e){ });
    formLineData.addInput({name:"clear", type:"button", value:"Clear"}).selector.click(function(e){ });
    */

    if (args.line_id){
        var response = sic.callMethod({moduleName:"Project/ProjectLineEdit", methodName:"projLineSelect", line_id: args.line_id});
        if (response && response.data) formLineData.setValue(response.data);
    }
};
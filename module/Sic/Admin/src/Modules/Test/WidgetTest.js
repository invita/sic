var F = function(args){

    var tabPage = args.helpers.createTabPage({name:"Test"});
    var childPage = tabPage.createChildPage({name:"WidgetTest", canClose:false});

    var panel = new sic.widget.sicPanel({parent:childPage.content.selector, firstGroupName:"Group1"});
    var form = new sic.widget.sicForm({parent:panel.firstGroup.content.selector, captionWidth:"140px"});
    form.addInput({name:"Test", type:"text", placeholder:"Quote Id..."});
    form.addInput({name:"Test2", type:"textarea", placeholder:"Quote description..."});
    form.addInput({name:"withCode", type:"text", placeholder:"Creator...", withCode:sic.codes.pubCreator });
    form.addInput({name:"DefaultButton", type:"button"}).selector.click(function(e){});

    var group2 = panel.addGroup("Group2");
    var form2 = new sic.widget.sicForm({parent:group2.content.selector, captionWidth:"140px"});
    form2.addInput({name:"Test2", type:"text", placeholder:"Name...", isArray: true, focus:true});
    form2.addInput({name:"Test3", type:"text", placeholder:"Year..."});
    form2.addInput({name:"Test4", type:"text", placeholder:"Companies", caption: "Multiselect",
            inputConstruct:sic.widget.sicMultiSelect,
            values:["some", "values", "to", "multiSelect"],
            value:["values", "multiSelect"] });
    form2.addInput({name:"withCode", type:"text", placeholder:"Creator...", withCode:sic.codes.pubCreator, isArray:true });
    form2.addInput({name:"GetFormData", type:"button", gradient:"gold"})
        .selector.click(function(e){ sic.dump(form2.getValue()); });

    var group3 = panel.addGroup("Group3");
    var form3 = new sic.widget.sicForm({parent:group3.content.selector, captionWidth:"100px"});
    form3.addInput({name:"Test5", type:"text", value:"Some initial Value 1"});
    form3.addInput({name:"Test6", type:"text", value:"Some initial Value 2"});
    form3.addInput({name:"Test7", type:"text", value:"Some initial Value 3"});
    form3.addInput({name:"SetFormData", type:"button", gradient:"orange"})
        .selector.click(function(e){
            form3.setValue({ Test5: "Lol", Test6: "Test", Test7: "Fooo!", UnknownName: "This is ignored" });
            form2.setValue({ withCode: [{codeId:2, value:"Test"}] });
        });
    form3.addInput({name:"Search in Dialog", type:"button", gradient:"blue"}).selector.click(function(e){
        //var dialog = new sic.widget.sicDialog({title:"Test dialog"});
        //dialog.content.selector
        sic.loadModule({moduleName:'Pub/PubSearch', newTab:'Search', inDialog: true});
    });

    var group4 = panel.addGroup("Group4");
    var hintButton = new sic.widget.sicInput({ parent:group4.content.selector, type:"button", name:"hint", hint:"Test" });
    hintButton.selector.click(function(e){
        var hint = new sic.widget.sicHint({text:"Hello Hint!"});
        hint.moveToCursor();
        hint.show();
    });

};
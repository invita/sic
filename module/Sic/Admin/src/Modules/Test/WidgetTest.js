var F = function(args){

    var tabPage = args.helpers.createTabPage({name:"Test"});
    var childPage = tabPage.createChildPage({name:"WidgetTest", canClose:false});

    var panel = new sic.widget.sicPanel({parent:childPage.content.selector, firstGroupName:"Group1"});
    var form = new sic.widget.sicForm({parent:panel.firstGroup.content.selector});
    form.addInput({name:"Test", type:"text", label:"Quote Id..."});
    form.addInput({name:"Test2", type:"textarea", label:"Quote description..."});
    form.addInput({name:"TestButton", type:"button"})
        .setGradient("blue").selector.click(function(e){});

    var group2 = panel.addGroup("Group2");
    var form2 = new sic.widget.sicForm({parent:group2.content.selector});
    form2.addInput({name:"Test2", type:"text", label:"Name..."});
    form2.addInput({name:"Test3", type:"text", label:"Year..."});
    form2.addInput({name:"Test4", type:"text", label:"Company..."});
    form2.addInput({name:"GetFormData", type:"button"})
        .setGradient("gold").selector.click(function(e){ sic.dump(form2.getValue()); });

    var group3 = panel.addGroup("Group3");
    var form3 = new sic.widget.sicForm({parent:group3.content.selector});
    form3.addInput({name:"Test5", type:"text", value:"Some initial Value 1"});
    form3.addInput({name:"Test6", type:"text", value:"Some initial Value 2"});
    form3.addInput({name:"Test7", type:"text", value:"Some initial Value 3"});
    form3.addInput({name:"SetFormData", type:"button"})
        .setGradient("orange").selector.click(function(e){
            form3.setValue({ Test5: "Lol", Test6: "Test", Test7: "Fooo!", UnknownName: "..." }); });
};
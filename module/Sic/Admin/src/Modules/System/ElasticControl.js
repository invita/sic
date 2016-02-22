var F = function(args){

    var tabPageIndex = args.helpers.createTabPage({name:"Data Indices"});

    tabPageIndex.container = new sic.widget.sicElement({parent:tabPageIndex.content.selector});
    tabPageIndex.container.selector.css("width", "160px");

    tabPageIndex.form = new sic.widget.sicForm({parent:tabPageIndex.container.selector, captionWidth: 100});

    /*
     tabPageIndex.deleteIndicesBtn = tabPageIndex.form.addInput({name:"delIndex", type:"button",
     value:"GO", caption:"Delete indices"});
     tabPageIndex.deleteIndicesBtn.selector.click(function() {
     sic.callMethod({moduleName:"System/ElasticControl", methodName:"deleteIndices"}, function(rArgs) {
     tabPageIndex.statusDiv.selector.html(rArgs.message); });
     });
     */

    tabPageIndex.reindexButton = tabPageIndex.form.addInput({name:"reindex", type:"button",
        value:"GO", caption:"Reindex"});
    tabPageIndex.reindexButton.selector.click(function() {
        tabPageIndex.statusDiv.selector.html("Reindex in progress... please wait.");
        sic.callMethod({moduleName:"System/ElasticControl", methodName:"reindex", aSync: true}, function(rArgs) {
            tabPageIndex.statusDiv.selector.html(rArgs.message); });
    });

    tabPageIndex.statusDiv = new sic.widget.sicElement({parent:tabPageIndex.content.selector});
    tabPageIndex.statusDiv.selector.css("padding", "4px");

};
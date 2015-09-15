var F = function(args){

    var tabPage = args.helpers.createTabPage({name:"Import Entities"});

    var panel = new sic.widget.sicPanel({parent:tabPage.content.selector,
        firstGroupName:"Import Entities"});

    var fromFileButton = new sic.widget.sicInput({parent:panel.firstGroup.content.selector, name:"fromFile",
            type:"button", value:"Choose...", caption:"From xml file"});
    fromFileButton.selector.click(function(e) {
        var fileUploader = new sic.object.sicFileUploader({ fileNamePrefix: 'entitiesImport_' });
        fileUploader.onUploadComplete(function(data){
            var upArgs = {moduleName:"System/ImportEntities", methodName:"importEntities", fileName:fileUploader.getFileName()};
            sic.callMethod(upArgs, function(respArgs) {
                if (respArgs.status) {
                    outputDiv.addHtml(sic.debug(respArgs)+"<br/>\n");
                }
            });
        });
    });

    var exportPanel = panel.addGroup("Export to XML");
    var exportButton = new sic.widget.sicInput({parent:exportPanel.content.selector, name:"exportButton",
        type:"button", caption:"Export", value:"Export All"});
    exportButton.selector.click(function(){
        sic.callMethod({moduleName:"System/ExportXml", methodName:"exportAll"}, function(respArgs) {
            outputDiv.addHtml(sic.debug(respArgs)+"<br/>\n");
            if (respArgs.status)
                window.open(respArgs.link, "_blank");
        });
    });

    var solrPanel = panel.addGroup("Solr");
    var solrReindexButton = new sic.widget.sicInput({parent:solrPanel.content.selector, name:"solrReindex",
        type:"button", caption:"Reindex", value:"Reindex All"});
    solrReindexButton.selector.click(function(){
        sic.callMethod({moduleName:"System/SolrControl", methodName:"reindex", waitTime:1000}, function(respArgs) {
            outputDiv.addHtml(sic.debug(respArgs)+"<br/>\n");
        });
    });

    var outputDiv = new sic.widget.sicElement({parent:tabPage.content.selector, tagName:"pre"});
    outputDiv.selector.addClass("outputElement");


};
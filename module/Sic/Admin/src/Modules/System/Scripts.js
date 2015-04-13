var F = function(args){

    var tabPage = args.helpers.createTabPage({name:"Import Entities"});

    var panel = new sic.widget.sicPanel({parent:tabPage.content.selector,
        firstGroupName:"Import Entities"});

    var fromFileButton = new sic.widget.sicInput({parent:panel.firstGroup.content.selector, name:"fromFile",
            type:"button", value:"Choose...", caption:"From file"});
    fromFileButton.selector.click(function(e) {
        var fileUploader = new sic.object.sicFileUploader({ fileNamePrefix: 'entitiesImport_' });
        fileUploader.onUploadComplete(function(data){
            var upArgs = {moduleName:"System/Scripts", methodName:"importEntities", fileName:fileUploader.getFileName()};
            sic.callMethod(upArgs, function(respArgs) {
                if (respArgs.status) {
                    outputDiv.addHtml(sic.debug(respArgs)+"<br/>\n");
                }
            });
        });
    });

    var outputDiv = new sic.widget.sicElement({parent:tabPage.content.selector, tagName:"pre"});
    outputDiv.selector.addClass("outputElement");
};
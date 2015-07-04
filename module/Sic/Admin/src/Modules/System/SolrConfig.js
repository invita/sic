var F = function(args){


    var tabPages = {};
    var firstTabPage;

    sic.callMethod({moduleName:"System/SolrConfig", methodName:"getFiles"}, function(rArgs) {
        if (rArgs.status && rArgs.fileList) {
            var fileList = rArgs.fileList;
            for (var i in fileList) {
                var fileName = fileList[i];
                var tabPage;

                if (i == 0) {
                    tabPage = args.helpers.createTabPage({name:fileName});
                    firstTabPage = tabPage;
                }
                else
                    tabPage = firstTabPage.createTabPage({name:fileName, canClose:false});

                tabPages[fileName] = tabPage;

                tabPage.form = new sic.widget.sicForm({parent:tabPage.content.selector});
                tabPage.contentInput = tabPage.form.addInput({name:"content", type:"codemirror", placeholder:fileName+"...", caption:false});

                // Save Button
                tabPage.saveButton = tabPage.form.addInput({name:"save", type:"submit", value:"Save", caption:false});
                tabPage.saveButton.selector[0].fileName = fileName;
                tabPage.saveButton.selector[0].tabPage = tabPage;
                tabPage.saveButton.selector.click(function(e){
                    sic.callMethod({moduleName:"System/SolrConfig", methodName:"saveConfig",
                        fileName:this.fileName, fileContent:this.tabPage.contentInput.getValue()}, function(rArgs) {});
                });

                // Load Content
                sic.callMethod({moduleName:"System/SolrConfig", methodName:"loadConfig", fileName:fileName}, function(rArgs) {
                    if (rArgs.status) tabPages[rArgs.fileName].contentInput.setValue(rArgs.fileContent);
                });


            }
        }
    });

};
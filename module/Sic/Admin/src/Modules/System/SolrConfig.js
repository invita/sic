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


    /*
    var tabPageSchema = args.helpers.createTabPage({name:"Schema.xml"});
    var schemaForm = new sic.widget.sicForm({parent:tabPageSchema.content.selector});
    var schemaInput = schemaForm.addInput({name:"content", type:"codemirror", placeholder:"schema.xml...", caption:false});
    schemaForm.addInput({name:"save", type:"submit", value:"Save", caption:false}).selector.click(function(e){
        sic.callMethod({moduleName:"System/SolrConfig", methodName:"saveConfig",
            fileName:"schema.xml", fileContent:schemaInput.getValue()}, function(rArgs) {});
    });

    var tabPageTest = tabPageSchema.createTabPage({name:"Test.xml", canClose:false});
    var testForm = new sic.widget.sicForm({parent:tabPageTest.content.selector});
    var testInput = testForm.addInput({name:"test.xml", type:"codemirror", placeholder:"test.xml...", caption:false});
    testForm.addInput({name:"save", type:"submit", value:"Save", caption:false}).selector.click(function(e){
        sic.callMethod({moduleName:"System/SolrConfig", methodName:"saveConfig",
            fileName:"test.xml", fileContent:testInput.getValue()}, function(rArgs) {});
    });

     // *** Load Config ***
     sic.callMethod({moduleName:"System/SolrConfig", methodName:"loadConfig", fileName:"schema.xml"}, function(rArgs) {
     if (rArgs.status) schemaInput.setValue(rArgs.fileContent);
     });

     sic.callMethod({moduleName:"System/SolrConfig", methodName:"loadConfig", fileName:"test.xml"}, function(rArgs) {
     if (rArgs.status) testInput.setValue(rArgs.fileContent);
     });

*/

};
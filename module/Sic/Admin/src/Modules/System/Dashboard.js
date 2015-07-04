var F = function(args){

    var tabPage = args.helpers.createTabPage({name:"Dashboard"});
    var data = sic.callMethod({moduleName:"System/Dashboard", methodName:"getSystemStatus"});

    for (var key in data){
        var div = new sic.widget.sicElement({parent:tabPage.content.selector, tagClass:"margin5 listLine"});
        var imageDiv = new sic.widget.sicElement({parent:div.selector, tagClass:"inline listField"});
        var image = new sic.widget.sicElement({parent:imageDiv.selector, tagName:"img", tagClass:"icon16"});
        var keyDiv = new sic.widget.sicElement({parent:div.selector, tagClass:"inline listField"});
        var valDiv = new sic.widget.sicElement({parent:div.selector, tagClass:"inline listField bold"});

        var imageFileName = key.replace(/ /g, "_").toLowerCase();
        image.selector.attr("src", "/img/icon/"+imageFileName+".png");
        keyDiv.selector.html(key+":");
        valDiv.selector.html(data[key]);
    }

    sic.loadModule({moduleName:"System/SolrConfig", tabPage:tabPage, newTab:"Solr Config" });
};
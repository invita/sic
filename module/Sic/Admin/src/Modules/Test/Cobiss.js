var F = function(){

    var tabPage = new sic.widget.sicTabPage({
        name: "Cobiss",
        parent: sic.data.mainTab
    });
    tabPage.content.selector.addClass("cobiss");


    var librarySelect = new sic.widget.sicElement({
        name : "librarySelect",
        tagName : "select",
        parent : tabPage.content.selector
    });
    var items = ['Ptuj','Ormoz','Kranj','FMF','CTK'];
    for(var i in items) {
        librarySelect.selector[0].add(new Option(items[i], items[i]));
    }

    var searchInput = new sic.widget.sicElement({
        name : "searchInput",
        tagName : "input",
        parent : tabPage.content.selector
    });

    var searchButton = new sic.widget.sicElement({
        name : "searchButton",
        tagName : "input",
        attr : {type:"button", value:"Search"},
        parent : tabPage.content.selector
    });
    searchButton.selector.click(function(){
        var lib = librarySelect.selector.val();
        var search = searchInput.selector.val();

        loadingImg.selector.css("display", "block");
        resultDiv.selector.html();

        $.get("/cobiss.php?lib="+lib+"&search="+search, function(data)
        {
            var dataArray = JSON.parse(data), dataObj;
            for(var i=0; i<dataArray.length; i++)
            {
                dataObj = dataArray[i];
                resultDiv.selector.append("<hr />");
                for(var key in dataObj)
                {
                    resultDiv.selector.append(key+": "+dataObj[key]+"<br />");
                }
            }
            loadingImg.selector.css("display", "none");
        });
    });

    var loadingDiv = new sic.widget.sicElement({
        name : "loadingDiv",
        parent : tabPage.content.selector
    });

    var loadingImg = sic.widget.sicElement({
        name : "loadingImg",
        tagName : "img",
        attr : {src:"/img/loading.gif"},
        parent : loadingDiv.selector
    });
    loadingImg.selector.addClass("loadingImg");

    var resultDiv = new sic.widget.sicElement({
        name : "resultDiv",
        parent : tabPage.content.selector
    });

}
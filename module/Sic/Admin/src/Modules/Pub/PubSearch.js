var F = function(args) {

    var name = "Search";
    if (args.selectCallback) name += " - Select Entity";
    var tabPage = args.helpers.createTabPage({name:name});

    var pubSearchTable = new sic.widget.sicHtmlTable({parent:tabPage.content.selector, tagClass:"borderCollapseSeparate"});
    var searchContainer = new sic.widget.sicElement({parent:pubSearchTable.getCell(0, 0).selector, tagClass:"pubSearch_leftContainer"});
    var pubResultsContainer = new sic.widget.sicElement({parent:pubSearchTable.getCell(0, 1).selector, tagClass:"pubSearch_rightContainer"});
    var cobissResultsContainer = new sic.widget.sicElement({parent:pubSearchTable.getCell(0, 1).selector, tagClass:"pubSearch_rightContainer"});

    var staticDataQuery = "*:*";
    var createStaticData = function(fields){
        if(!fields) return {query : staticDataQuery};
        else {
            sic.dump(fields, 2);
            staticDataQuery = null;
            for(var key in fields){
                if(!fields[key] || (fields[key] && !fields[key][0]) || (fields[key][0] && jQuery.isPlainObject(fields[key][0]) && !fields[key][0].value)) continue;
                if(jQuery.isArray(fields[key])){
                    for(var c=0; c<fields[key].length; c++){
                        if(staticDataQuery){
                            if(jQuery.isPlainObject(fields[key][c])){
                                staticDataQuery += " and "+key+":\"*"+fields[key][c].value+"*\"";
                            } else {
                                staticDataQuery += " and "+key+":\"*"+fields[key][c]+"*\"";
                            }
                        } else {
                            if(jQuery.isPlainObject(fields[key][c])){
                                staticDataQuery = key+":\"*"+fields[key][c].value+"*\"";
                            } else {
                                staticDataQuery = key+":\"*"+fields[key][c]+"*\"";
                            }
                        }
                    }
                } else {
                    if(staticDataQuery){
                        if(jQuery.isPlainObject(fields[key])){
                            staticDataQuery += " and "+key+":\"*"+fields[key].value+"*\"";
                        } else {
                            staticDataQuery += " and "+key+":\"*"+fields[key]+"*\"";
                        }
                    } else {
                        if(jQuery.isPlainObject(fields[key])){
                            staticDataQuery = key+":\"*"+fields[key].value+"*\"";
                        } else {
                            staticDataQuery = key+":\"*"+fields[key]+"*\"";
                        }
                    }
                }
            }
            alert(staticDataQuery);
            return {query : staticDataQuery};
        }
    };

    // Search Panel (left)
    var searchPanel = new sic.widget.sicPanel({parent:searchContainer.selector});

    var cobissFormFunc = function(){
        var form, input;
        form = $(document.createElement("form"));
        form.attr({method:"POST", action:"http://www.cobiss.si/scripts/cobiss", target:"_blank"});
        input = $(document.createElement("input"));
        input.attr({type:"hidden", name:"base", value:"99999"});
        form.append(input);
        input = $(document.createElement("input"));
        input.attr({type:"hidden", name:"command", value:"SEARCH"});
        form.append(input);
        input = $(document.createElement("input"));
        input.attr({type:"hidden", name:"srch", value:""});
        form.append(input);
        return form;
    };

    var cobissForm = cobissFormFunc();

    searchContainer.selector.append(cobissForm);


    // Quick Search
    var quickSearchGroup = searchPanel.addGroup();
    var quickSearchForm = new sic.widget.sicForm({parent:quickSearchGroup.content.selector, captionWidth:"80px", inputClass:"searchInput"});
    var quickSearchBox = quickSearchForm.addInput({name:"quickSearch", placeholder:"Quick search...", caption:"Quick search", autoComplete: {
        moduleName: "Pub/PubSearch", methodName: "autoComplete_search" }});
    quickSearchBox.selector.addClass("inline");
    quickSearchBox.input.selector.css("width", "220px");
    var quickSearchSubmitButton = quickSearchForm.addInput({value:"Local", type:"submit", caption:" "});
    /*
    quickSearchSubmitButton.selector.click(function(){
        dataTable.dataSource.staticData = createStaticData(quickSearchForm.getValue());
    });
    */
    var cobissSearch = quickSearchForm.addInput({value:"Cobiss", type:"button"});
    cobissSearch.selector.click(function(){
        var data = quickSearchForm.getValue();
        var srch = cobissForm.find("input[name=srch]");
        srch.val(data.quickSearch);
        cobissForm.submit();
    });
    var googleSearch = quickSearchForm.addInput({value:"Google", type:"button"});
    googleSearch.selector.click(function(){
        var query = quickSearchForm.getValue().quickSearch;
        query = query.replace(/ /g, "+");

        var googleSearchUrl = "https://www.google.com/webhp?hl=en#hl=en&q="+query;
        window.open(googleSearchUrl, '_blank');
    });

    quickSearchForm.addHr();


    // *** Publication Search ***
    var searchFields = {

        pub_id: { caption:"id", placeholder:"Entity Identifier" },
        idno: { caption:"idno", placeholder:"Identifier", isArray:true, withCode:sic.codes.pubIdno },
        title: { caption:"title", placeholder:"Title", isArray:true, type:"textarea" },
        creator: { caption:"creator", placeholder:"Creator", isArray:true, withCode:sic.codes.pubCreator },
        year: { caption:"date", placeholder:"Date", isArray:true },

        _group1: { caption: "Additional Fields (Click)", canMinimize: true, initHide: true }, // Group

        addidno: { caption:"addIdno", placeholder:"Additional Identifier", isArray:true },
        addtitle: { caption:"addTitle", placeholder:"Additional Title", isArray:true },
        place: { caption:"place", placeholder:"Place", isArray:true },
        publisher: { caption:"publisher", placeholder:"Publisher", isArray:true },
        volume: { caption:"volume", placeholder:"Volume", isArray:true },
        issue: { caption:"issue", placeholder:"Issue", isArray:true },
        page: { caption:"page", placeholder:"Page", isArray:true },
        edition: { caption:"edition", placeholder:"Edition", isArray:true },
        source: { caption:"source", placeholder:"Source", isArray:true, withCode:sic.codes.pubSource },
        online: { caption:"online", placeholder:"Online", isArray:true, withCode:sic.codes.pubOnline },
        strng: { caption:"string", placeholder:"String", isArray:true },
        note: { caption:"note", placeholder:"Note", isArray:true },

        _group2: { }, // Separator Group, make buttons (local db search) their own group
    }

    var pubSearchGroup = searchPanel.addGroup("Publication Search");
    //var pubCopyParams

    var pubSearchForm = new sic.widget.sicForm({parent:pubSearchGroup.content.selector, captionWidth:"100px",
        inputClass:"searchInput"});
    for (var fieldName in searchFields) {
        if (fieldName[0] == "_") {
            pubSearchForm.addCaption(searchFields[fieldName]);
            continue;
        }
        var fieldCaption = sic.captionize(searchFields[fieldName].caption ? searchFields[fieldName].caption : fieldName);
        var inputArgs = sic.mergeObjects({name:fieldName, placeholder:fieldCaption+"...", caption:fieldCaption}, searchFields[fieldName]);
        pubSearchForm.addInput(inputArgs);
    }

    var pubSearchSubmitButton = pubSearchForm.addInput({value:"Local", type:"submit", caption:false});
    /*
    pubSearchSubmitButton.selector.click(function(){
        dataTable.dataSource.staticData = createStaticData(pubSearchForm.getValue());
    });
    */

    var pubCobissSearchButton = pubSearchForm.addInput({value:"Cobiss", type:"button"});
    pubCobissSearchButton.selector.click(function(e) {
        var data = pubSearchForm.getValue();
        var srch = cobissForm.find("input[name=srch]");
        srch.val(data.creator[0].value +" "+ data.title[0]);
        cobissForm.submit();
    });

    var pubSearchGoogleButton = pubSearchForm.addInput({value:"Google", type:"button"});
    pubSearchGoogleButton.selector.click(function(e) {
        var data = pubSearchForm.getValue();
        var query = data.creator[0].value +", "+ data.title[0];
        query = query.replace(/ /g, "+");

        var googleSearchUrl = "https://www.google.com/webhp?hl=en#hl=en&q="+query;
        window.open(googleSearchUrl, '_blank');
    });

    var pubCreateButton = pubSearchForm.addInput({value:"Create Pub", type:"button"});
    pubCreateButton.selector.click(function(e) {
        var searchData = sic.removeStarsFromObject(pubSearchForm.getValue(), true);
        delete searchData.pub_id;
        sic.loadModule({moduleName:"Pub/PubEdit", newTab:"New Entity", initValue:searchData,
            tabPage: tabPage, entityTitle:"Entity %pub_id% - %title%"});
    });

    var pubClearButton = pubSearchForm.addInput({value:"Clear", type:"button"});
    pubClearButton.selector.click(function(e) {
        pubSearchForm.allInputs.clear();
    });

    pubSearchForm.addHr();



    // *** Cobiss Search ***
    var cobbisGroup = searchPanel.addGroup("Cobbis");
    var cobbisForm = new sic.widget.sicForm({parent:cobbisGroup.content.selector, captionWidth:"100px", inputClass:"searchInput"});
    cobbisForm.addInput({name:"url", caption:"Cobiss url"});

    var cobissScrapeButton = cobbisForm.addInput({value:"Scrape", type:"submit", caption: " "});
    cobissScrapeButton.selector.click(function(e){
        sic.loading.show();
        var searchData = cobbisForm.getValue();
        var url = searchData.url;

        jQuery.ajax({url:"/cobiss.php", method:"POST", data:{url:url}, dataType:"json", success:function(data){
            data = data.data;
            pubSearchForm.setValue({
                creator : data.authors,
                title : data.titles,
                cobiss : data.cobissId,
                publisher : data.publisher
            });
            sic.loading.hide();
        }});

        //showResults("cobiss");
    });


    // *** Zotero Scrape ***
    var zoteroGroup = searchPanel.addGroup("Zotero");
    var zoteroForm = new sic.widget.sicForm({parent:zoteroGroup.content.selector, captionWidth:"100px", inputClass:"searchInput"});

    sic.callMethod({ moduleName:"Pub/PubSearch", methodName:"getZoteroUrl" }, function(response){
        //alert(sic.debug(response));
        zoteroForm.addInput({name:"url", caption:"Zotero url", value:response.url});
    });
    var zoteroScrapeButton = zoteroForm.addInput({value:"Scrape", type:"submit", caption: " "});
    zoteroScrapeButton.selector.click(function(e){
        sic.loading.show();

        var searchData = zoteroForm.getValue();
        var url = searchData.url;

        sic.callMethod({ moduleName:"Pub/PubSearch", methodName:"zoteroScrape", url: url }, function(response) {
            pubSearchForm.setValue(response.data);
        });
        //showResults("cobiss");
    });

    // *** Solr ***
    var solrGroup = searchPanel.addGroup("Solr");
    var solrForm = new sic.widget.sicForm({parent:solrGroup.content.selector, captionWidth:"100px", inputClass:"searchInput"});
    solrForm.addInput({name:"query", caption:"Solr query"});
    var solrSubmitButton = solrForm.addInput({value:"Solr query", type:"submit", caption: " "});



    var filterValue = sic.getArg(args, "filter", {});
    if (Object.keys(filterValue).length) {
        pubSearchForm.setValue(filterValue);
        pubSearchForm.submit();
    }

    var dataTable = new sic.widget.sicDataTable({
        parent:pubResultsContainer.selector,
        primaryKey: ['pub_id'],
        entityTitle: "Entity %pub_id% - %title%",
        dataSource: new sic.widget.sicDataTableDataSource({
            moduleName:"Pub/PubSearch",
            //staticData: { searchType: "pubSearch", fields: pubSearchForm.getValue(), zotero:zoteroForm.getValue() },
            staticData : createStaticData(),
            pageCount: 20
        }),
        editorModuleArgs: {
            moduleName:"Pub/PubEdit",
            tabPage:tabPage
        },
        canInsert: false,
        canDelete: false,
        tabPage: tabPage.parentTab ? tabPage.parentTab : tabPage,
        selectCallback: args.selectCallback,
        fields: {
            pub_id: { hintF: function(args) { sic.hint.publication(args.row.lastRowData.pub_id); } },
            parent_id: { hintF: function(args) { sic.hint.publication(args.row.lastRowData.parent_id); } },
            series_id: { hintF: function(args) { sic.hint.publication(args.row.lastRowData.series_id); } },
            creator: { tagClass:"sicDataTable_shortText",
                hintF: function(args) { sic.showHint(sic.replacePipes(args.row.lastRowData.__creator_long, "<br/>")); } },
            title: { tagClass:"sicDataTable_shortText",
                hintF: function(args) { sic.showHint(sic.replacePipes(args.row.lastRowData.__title_long, "<br/>")); } },
            year: { tagClass:"sicDataTable_shortText", caption: "Date" }
        }
    });

    dataTable.onDataFeedComplete(function(args){
        dataTable.dataSource.staticData = args["staticData"];
    });



    cobissResultsContainer.displayNone();
    var cobissiFrame = new sic.widget.sicElement({parent:cobissResultsContainer.selector, tagName:"iframe",
        attr: { width:1200, height:1200, frameborder:0, scrolling:"no" } });



    quickSearchForm.onSubmit(function(sicForm){
        dataTable.dataSource.staticData = createStaticData(quickSearchForm.getValue());
        //dataTable.dataSource.staticData.searchType = "quickSearch";
        dataTable.refresh();
        //showResults("pub");
    });

    pubSearchForm.onSubmit(function(sicForm){
        dataTable.dataSource.staticData = createStaticData(pubSearchForm.getValue())
        //dataTable.dataSource.staticData.searchType = "quickSearch";
        dataTable.refresh();
        //showResults("pub");
    });


    var showResults = function(pageName) {
        switch (pageName) {
            case "cobiss":
                pubResultsContainer.displayNone();
                cobissResultsContainer.fadeIn();
                break;
            case "pub":
                cobissResultsContainer.displayNone();
                pubResultsContainer.fadeIn();
                break;
        }
    }



};
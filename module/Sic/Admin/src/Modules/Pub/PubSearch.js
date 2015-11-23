var F = function(args) {

    var solrFields = [
        "edition",
        "issue",
        "online",
        "creator",
        "creator_author",
        "publisher",
        "title",
        "strng",
        "pub_id",
        "page",
        "year",
        "place",
        "note",
        "addtitle",
        "addidno",
        "source",
        "volume",
        "idno",
        "idno_cobiss",
    ];



    // *:*&fq=(f1:val OR f2:val ...)


    var name = "Search";
    if (args.selectCallback) name += " - Select Entity";
    var tabPage = args.helpers.createTabPage({name:name});

    var pubSearchTable = new sic.widget.sicHtmlTable({parent:tabPage.content.selector, tagClass:"borderCollapseSeparate"});
    var searchContainer = new sic.widget.sicElement({parent:pubSearchTable.getCell(0, 0).selector, tagClass:"pubSearch_leftContainer"});
    var pubResultsContainer = new sic.widget.sicElement({parent:pubSearchTable.getCell(0, 1).selector, tagClass:"pubSearch_rightContainer"});
    var cobissResultsContainer = new sic.widget.sicElement({parent:pubSearchTable.getCell(0, 1).selector, tagClass:"pubSearch_rightContainer"});


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
    var quickSearchForm = new sic.widget.sicForm({parent:quickSearchGroup.content.selector, captionWidth:"90px", inputClass:"searchInput"});
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

    var quickSearchBox = quickSearchForm.addInput({name:"quickSearch", placeholder:"Quick search...", caption:false,
        autoComplete: {moduleName: "Pub/PubSearch", methodName: "autoComplete_search" } });
    quickSearchBox.selector.addClass("inline");
    quickSearchBox.input.selector.css("width", "285px").attr("maxlength", 80);
    quickSearchBox.input.selector.focus();

    quickSearchForm.addHr();


    // *** Cobiss Search ***
    var cobbisGroup = searchPanel.addGroup("Cobbis");
    cobbisGroup.header.displayNone();
    var cobbisForm = new sic.widget.sicForm({parent:cobbisGroup.content.selector, captionWidth:"100px", inputClass:"searchInput"});
    var cobissInput = cobbisForm.addInput({name:"url", caption:"Cobiss url"});
    cobissInput.selector.addClass("inline");

    var cobissScrapeButton = cobbisForm.addInput({value:"Scrape", type:"submit", caption: " "});
    cobissScrapeButton.selector.addClass("inline");
    cobissScrapeButton.captionDiv.displayNone();
    cobissScrapeButton.selector.click(function(e){
        sic.loading.show();
        var searchData = cobbisForm.getValue();
        var url = searchData.url;

        jQuery.ajax({url:"/cobiss.php", method:"POST", data:{url:url}, dataType:"json", success:function(data){
            data = data.data;
            var idnos = [];
            var onlines = [];

            //sic.dump(sic.codes.pubOnline);
            if (data.cobissId) idnos.push({ codeId: sic.findKeyByValue(sic.codes.pubIdno, "cobiss"), value: data.cobissId });
            if (data.isbn) idnos.push({ codeId: sic.findKeyByValue(sic.codes.pubIdno, "isbn"), value: data.isbn });
            if (data.issn) idnos.push({ codeId: sic.findKeyByValue(sic.codes.pubIdno, "issn"), value: data.issn });

            if (data.url) onlines.push({ codeId: sic.findKeyByValue(sic.codes.pubOnline, "url"), value: data.url });
            if (data.urn) onlines.push({ codeId: sic.findKeyByValue(sic.codes.pubOnline, "urn"), value: data.urn });

            pubSearchForm.setValue({
                creator : data.authors,
                title : data.titles,
                year : data.year,
                place : data.place,
                page : data.page,
                publisher : data.publishers,

                idno : idnos,
                online : onlines
            });
            sic.loading.hide();
        }});

        //showResults("cobiss");
    });


    // *** Zotero Scrape ***
    var zoteroGroup = searchPanel.addGroup("Zotero");
    zoteroGroup.header.displayNone();
    var zoteroForm = new sic.widget.sicForm({parent:zoteroGroup.content.selector, captionWidth:"100px", inputClass:"searchInput"});

    sic.callMethod({ moduleName:"Pub/PubSearch", methodName:"getZoteroUrl" }, function(response){
        //alert(sic.debug(response));
        var zoteroInput = zoteroForm.addInput({name:"url", caption:"Zotero url", value:response.url});
        zoteroInput.selector.addClass("inline");
    });
    var zoteroScrapeButton = zoteroForm.addInput({value:"Scrape", type:"submit", caption: " "});
    zoteroScrapeButton.selector.addClass("inline");
    zoteroScrapeButton.captionDiv.displayNone();
    zoteroScrapeButton.selector.click(function(e){
        sic.loading.show();

        var searchData = zoteroForm.getValue();
        var url = searchData.url;

        sic.callMethod({ moduleName:"Pub/PubSearch", methodName:"zoteroScrape", url: url }, function(response) {
            pubSearchForm.setValue(response.data);
        });
        //showResults("cobiss");
    });

    zoteroForm.addHr();



    // *** Publication Search ***
    var searchFields = {

        pub_id: { caption:"id", placeholder:"Entity Identifier" },
        idno: { caption:"idno", placeholder:"Identifier", isArray:true, withCode:sic.codes.pubIdno,
            autoComplete: {moduleName: "Pub/PubSearch", methodName: "autoComplete_search", fieldName:"idno" }  },
        title: { caption:"title", placeholder:"Title", isArray:true, type:"textarea",
            autoComplete: {moduleName: "Pub/PubSearch", methodName: "autoComplete_search", fieldName:"title" } },
        creator: { caption:"creator", placeholder:"Creator", isArray:true, withCode:sic.codes.pubCreator,
            autoComplete: {moduleName: "Pub/PubSearch", methodName: "autoComplete_search", fieldName:"creator" } },
        year: { caption:"date", placeholder:"Date", isArray:true,
            autoComplete: {moduleName: "Pub/PubSearch", methodName: "autoComplete_search", fieldName:"year" } },

        //_group1: { caption: "Additional Fields (Click)", canMinimize: true, initHide: true, className:"search_additionalFields" }, // Group

        addidno: { caption:"addIdno", placeholder:"Additional Identifier", isArray:true,
            autoComplete: {moduleName: "Pub/PubSearch", methodName: "autoComplete_search", fieldName:"addidno" }  },
        addtitle: { caption:"addTitle", placeholder:"Additional Title", isArray:true,
            autoComplete: {moduleName: "Pub/PubSearch", methodName: "autoComplete_search", fieldName:"addtitle" }  },
        place: { caption:"place", placeholder:"Place", isArray:true, type:"textarea",
            autoComplete: {moduleName: "Pub/PubSearch", methodName: "autoComplete_search", fieldName:"place" }  },
        publisher: { caption:"publisher", placeholder:"Publisher", isArray:true, type:"textarea",
            autoComplete: {moduleName: "Pub/PubSearch", methodName: "autoComplete_search", fieldName:"publisher" }  },
        volume: { caption:"volume", placeholder:"Volume", isArray:true,
            autoComplete: {moduleName: "Pub/PubSearch", methodName: "autoComplete_search", fieldName:"volume" }  },
        issue: { caption:"issue", placeholder:"Issue", isArray:true,
            autoComplete: {moduleName: "Pub/PubSearch", methodName: "autoComplete_search", fieldName:"issue" }  },
        page: { caption:"page", placeholder:"Page", isArray:true,
            autoComplete: {moduleName: "Pub/PubSearch", methodName: "autoComplete_search", fieldName:"page" }  },
        edition: { caption:"edition", placeholder:"Edition", isArray:true,
            autoComplete: {moduleName: "Pub/PubSearch", methodName: "autoComplete_search", fieldName:"edition" }  },
        source: { caption:"source", placeholder:"Source", isArray:true, withCode:sic.codes.pubSource, type:"textarea",
            autoComplete: {moduleName: "Pub/PubSearch", methodName: "autoComplete_search", fieldName:"source" }  },
        online: { caption:"online", placeholder:"Online", isArray:true, withCode:sic.codes.pubOnline, type:"textarea",
            autoComplete: {moduleName: "Pub/PubSearch", methodName: "autoComplete_search", fieldName:"online" }  },
        strng: { caption:"string", placeholder:"String", isArray:true, type:"textarea",
            autoComplete: {moduleName: "Pub/PubSearch", methodName: "autoComplete_search", fieldName:"strng" }  },
        note: { caption:"note", placeholder:"Note", isArray:true, type:"textarea",
            autoComplete: {moduleName: "Pub/PubSearch", methodName: "autoComplete_search", fieldName:"note" }  },

        _group2: { }, // Separator Group, make buttons (local db search) their own group
    }


    var pubSearchGroup = searchPanel.addGroup("Publication Search");
    //var pubCopyParams

    var pubSearchForm = new sic.widget.sicForm({parent:pubSearchGroup.content.selector, captionWidth:"100px",
        inputClass:"searchInput"});


    // Pub Search Buttons
    var pubSearchSubmitButton = pubSearchForm.addInput({value:"Local", type:"submit", caption:false});

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

    var pubCreateButton = pubSearchForm.addInput({value:"Create", type:"button"});
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

    //pubSearchForm.addHr();



    for (var fieldName in searchFields) {
        if (fieldName[0] == "_") {
            pubSearchForm.addCaption(searchFields[fieldName]);
            continue;
        }
        var fieldCaption = sic.captionize(searchFields[fieldName].caption ? searchFields[fieldName].caption : fieldName);
        var inputArgs = sic.mergeObjects({name:fieldName, placeholder:fieldCaption+"...", caption:fieldCaption}, searchFields[fieldName]);
        pubSearchForm.addInput(inputArgs);
    }


    // *** Solr ***
    /*
    var solrGroup = searchPanel.addGroup("Solr");
    var solrForm = new sic.widget.sicForm({parent:solrGroup.content.selector, captionWidth:"100px", inputClass:"searchInput"});
    solrForm.addInput({name:"query", caption:"Solr query"});
    var solrSubmitButton = solrForm.addInput({value:"Solr query", type:"submit", caption: " "});
    */


    var filterValue = sic.getArg(args, "filter", {});
    if (Object.keys(filterValue).length) {
        pubSearchForm.setValue(filterValue);
        //sic.dump(pubSearchForm.getValue());
        pubSearchForm.submit();
    }

    var dataTable = new sic.widget.sicDataTable({
        parent:pubResultsContainer.selector,
        primaryKey: ['pub_id'],
        entityTitle: "Entity %pub_id% - %title%",
        filter: { enabled: false },
        dataSource: new sic.widget.sicDataTableDataSource({
            moduleName:"Pub/PubSearch",
            //staticData: { searchType: "pubSearch", fields: pubSearchForm.getValue(), zotero:zoteroForm.getValue() },
            //staticData : createStaticData(),
            staticData : { q: "*:*", fq: "" },
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
            pub_id: { caption:"Entity&nbsp;Id", hintF: function(args) { sic.hint.publication(args.row.lastRowData.pub_id); } },
            parent_id: { caption:"Parent&nbsp;Id", hintF: function(args) { sic.hint.publication(args.row.lastRowData.parent_id); } },
            series_id: { caption:"Series&nbsp;Id", hintF: function(args) { sic.hint.publication(args.row.lastRowData.series_id); } },
            original_id: { caption:"Original&nbsp;Id" },
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
        var fq = "";
        if (quickSearchBox.getValue() != "") {
            var fields = [];
            for (var sfKey in searchFields)
            {
                if (sfKey.substr(0, 1) == "_") continue;

                // Strip Solr chars
                var value = sic.stripSolrSpecialChars(quickSearchBox.getValue());
                var values = value.split(" ");
                for (var i in values)
                    values[i] = sfKey+":*"+values[i]+"*";

                fields.push("("+values.join(" AND ")+")");
            }
            fq = '('+fields.join(" OR ")+')';
        }

        dataTable.dataSource.staticData = { q: "*:*", fq: fq };
        dataTable.refresh(true);
        //showResults("pub");
    });


    pubSearchForm.onSubmit(function(sicForm){
        var fq = "";

        //sic.dump(pubSearchForm.getValue());

        var formData = pubSearchForm.getValue();
        //sic.dump(formData); return;

        var fields = [];
        for (var sfKey in searchFields)
        {
            if (sfKey.substr(0, 1) == "_") continue;

            var value;
            if (typeof(formData[sfKey]) == "string") {
                // String
                value = formData[sfKey];
            } else if ($.isArray(formData[sfKey])) {
                if (formData[sfKey][0] && formData[sfKey][0].codeId) {
                    // Object
                    var vals = [];
                    for (var i in formData[sfKey]) vals.push(formData[sfKey][i].value);
                    value = vals.join(" ");
                } else {
                    // Array
                    value = formData[sfKey].join(" ");
                }
            }

            if (value == "") continue;

            // Strip Solr chars
            value = sic.stripSolrSpecialChars(value);

            var values = value.split(" ");
            for (var i in values) {
                if (sfKey == "title")
                    values[i] = sfKey+":"+values[i];
                else
                    values[i] = sfKey+":*"+values[i]+"*";
            }

            fields.push("("+values.join(" AND ")+")");
        }
        if (fields.length) fq = '('+fields.join(" AND ")+')';
        //sic.dump(fq);

        dataTable.dataSource.staticData = { q: "*:*", fq: fq };
        dataTable.refresh(true);
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
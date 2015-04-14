var F = function(args) {


    var tabPage = args.helpers.createTabPage({name:"Search"});

    var pubSearchTable = new sic.widget.sicHtmlTable({parent:tabPage.content.selector});
    var searchContainer = new sic.widget.sicElement({parent:pubSearchTable.getCell(0, 0).selector, tagClass:"pubSearch_leftContainer"});
    var pubResultsContainer = new sic.widget.sicElement({parent:pubSearchTable.getCell(0, 1).selector, tagClass:"pubSearch_rightContainer"});
    var cobissResultsContainer = new sic.widget.sicElement({parent:pubSearchTable.getCell(0, 1).selector, tagClass:"pubSearch_rightContainer"});


    // Search Panel (left)
    var searchPanel = new sic.widget.sicPanel({parent:searchContainer.selector});


    // Quick Search
    var quickSearchGroup = searchPanel.addGroup("Quick Search");
    var quickSearchForm = new sic.widget.sicForm({parent:quickSearchGroup.content.selector});
    var quickSearchBox = quickSearchForm.addInput({name:"quickSearch", placeholder:"Quick search...", caption:false});
    quickSearchBox.selector.addClass("inline");
    var quickSearchSubmitButton = quickSearchForm.addInput({value:"Quick Search", type:"submit"});


    // *** Publication Search ***
    var searchFields = {
        pub_id: {},
        author: { /*isArray:true*/ },
        title: {},
        publisher: {},
        place: {},
        year: {},
        cobiss: {},
        issn: {},
    }

    var pubSearchGroup = searchPanel.addGroup("Publication Search");
    var pubSearchForm = new sic.widget.sicForm({parent:pubSearchGroup.content.selector, captionWidth:"100px"});
    for (var fieldName in searchFields) {
        var fieldCaption = sic.captionize(fieldName);
        var inputArgs = sic.mergeObjects({name:fieldName, placeholder:fieldCaption+"...", caption:fieldCaption}, searchFields[fieldName]);
        pubSearchForm.addInput(inputArgs);
    }
    var pubSearchSubmitButton = pubSearchForm.addInput({value:"Search Local", type:"submit", caption:"Local Database"});
    var pubCreateButton = pubSearchForm.addInput({value:"Create Pub", type:"button"});
    pubCreateButton.selector.click(function(e) {
        var searchData = pubSearchForm.getValue();
        sic.loadModule({moduleName:"Pub/PubEdit", newTab:"New Publication", initValue:searchData,
            entityTitle:"Pub %pub_id% - %title%"});
    });


    pubSearchForm.addHr();



    // *** Cobiss Search ***

    var cobissSearchButton = pubSearchForm.addInput({value:"Search Cobiss", type:"button", caption:"Cobiss Database"});
    cobissSearchButton.selector.click(function(e){

        //var data = quickSearchForm.getValue();
        //sic.loadModule({moduleName:"Cobiss/CobissList", newTab:"Cobiss List", cobissSearch: data.search});

        var searchData = pubSearchForm.getValue();

        // Search Cobiss Logic here...

        cobissiFrame.selector.attr("src", "http://www.w3schools.com");


        showResults("cobiss");
    });

    var cobissScrapeButton = pubSearchForm.addInput({value:"Scrape", type:"button"});
    cobissScrapeButton.selector.click(function(e){

        // Cobiss Scrape Logic here...

        var scrapedData = { author: "foo", title: "bar" };
        pubSearchForm.setValue(scrapedData);

    });




    var filterValue = sic.getArg(args, "filter", {});
    if (Object.keys(filterValue).length) {
        pubSearchForm.setValue(filterValue);
        pubSearchForm.submit();
    }


    var dataTable = new sic.widget.sicDataTable({
        parent:pubResultsContainer.selector,
        primaryKey: ['pub_id'],
        entityTitle: "Pub %pub_id% - %title%",
        dataSource: new sic.widget.sicDataTableDataSource({
            moduleName:"Pub/PubSearch",
            staticData: { searchType: "pubSearch", fields: pubSearchForm.getValue() }
        }),
        editorModuleArgs: {
            moduleName:"Pub/PubEdit",
            tabPage:tabPage
        },
        canInsert: false,
        canDelete: false,
        tabPage: tabPage.parentTab,
        selectCallback: args.selectCallback
    });


    cobissResultsContainer.displayNone();
    var cobissiFrame = new sic.widget.sicElement({parent:cobissResultsContainer.selector, tagName:"iframe",
        attr: { width:1200, height:1200, frameborder:0, scrolling:"no" } });


    quickSearchForm.onSubmit(function(sicForm){
        dataTable.dataSource.staticData = quickSearchForm.getValue();
        dataTable.dataSource.staticData.searchType = "quickSearch";
        dataTable.refresh();
        showResults("pub");
    });

    pubSearchForm.onSubmit(function(sicForm){
        dataTable.dataSource.staticData = { searchType: "pubSearch", fields: pubSearchForm.getValue() };
        dataTable.refresh();
        showResults("pub");
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
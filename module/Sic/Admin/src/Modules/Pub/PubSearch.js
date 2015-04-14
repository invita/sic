var F = function(args) {

    var tabPage = args.helpers.createTabPage({name:"Search"});
    var searchContainer = new sic.widget.sicElement({parent:tabPage.content.selector, tagClass:"pubSearch_leftContainer"});
    var searchPanel = new sic.widget.sicPanel({parent:searchContainer.selector});


    // Quick Search
    var quickSearchGroup = searchPanel.addGroup("Quick Search");
    var quickSearchForm = new sic.widget.sicForm({parent:quickSearchGroup.content.selector});
    var quickSearchBox = quickSearchForm.addInput({name:"quickSearch", placeholder:"Quick search...", caption:false});
    quickSearchBox.selector.addClass("inline");
    var quickSearchSubmitButton = quickSearchForm.addInput({value:"Quick Search", type:"submit"});



    // Publication Search
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
    var pubSearchSubmitButton = pubSearchForm.addInput({value:"Search Local", type:"submit", caption:" "});

    // Cobiss Search
    var cobissSearchButton = pubSearchForm.addInput({value:"Search Cobiss", type:"button"});
    cobissSearchButton.selector.click(function(e){
        var data = quickSearchForm.getValue();
        sic.loadModule({moduleName:"Cobiss/CobissList", newTab:"Cobiss List", cobissSearch: data.search});
    });

    var filterValue = sic.getArg(args, "filter", {});
    if (Object.keys(filterValue).length) {
        pubSearchForm.setValue(filterValue);
        pubSearchForm.submit();
    }


    /*
    var cobissButton = quickSearchForm.addInput({value:"Cobiss", type:"button"});
    cobissButton.selector.click(function(){
        var data = quickSearchForm.getValue();
        sic.loadModule({moduleName:"Cobiss/CobissList", newTab:"Cobiss List", cobissSearch: data.search});
    });
    */

    var resultsContainer = new sic.widget.sicElement({parent:tabPage.content.selector, tagClass:"pubSearch_rightContainer"});

    var dataTable = new sic.widget.sicDataTable({
        parent:resultsContainer.selector,
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
        selectCallback: args.selectCallback
    });


    quickSearchForm.onSubmit(function(sicForm){
        dataTable.dataSource.staticData = quickSearchForm.getValue();
        dataTable.dataSource.staticData.searchType = "quickSearch";
        dataTable.refresh();
    });

    pubSearchForm.onSubmit(function(sicForm){
        dataTable.dataSource.staticData = { searchType: "pubSearch", fields: pubSearchForm.getValue() };
        dataTable.refresh();
    });




};
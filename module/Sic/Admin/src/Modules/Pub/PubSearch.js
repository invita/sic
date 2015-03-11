var F = function(args) {

    var tabPage = args.helpers.createTabPage({name:"Search"});
    var searchForm = new sic.widget.sicForm({parent:tabPage.content.selector});
    var searchBox = searchForm.addInput({name:"search"});
    searchBox.selector.addClass("inline");
    var submitButton = searchForm.addInput({value:"Search", type:"submit"});

    var dataTable = new sic.widget.sicDataTable({
        parent:tabPage.content.selector,
        primaryKey: ['id'],
        entityTitle: "Pub %id% - %title%",
        dataSource: new sic.widget.sicDataTableDataSource({
            moduleName:"Pub/PubSearch"
        }),
        editorModuleArgs: {
            moduleName:"Pub/PubEdit",
            tabPage:tabPage
        },
        canInsert: false,
        canDelete: false
    });


    searchForm.onSubmit(function(sicForm){
        dataTable.dataSource.staticData = searchForm.getValue();
        dataTable.refresh();
        //var response = sic.callMethod({moduleName:"Pub/PubSearch", methodName:"search", data:searchForm.getValue()});
        //dataTable.initAndPopulate(response);
    });


};
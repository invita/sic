var F = function(args) {

    var tabPage = args.helpers.createTabPage({name:"Search"});
    var searchForm = new sic.widget.sicForm({parent:tabPage.content.selector});
    var searchBox = searchForm.addInput({name:"search", placeholder:"Simple search..."});
    searchBox.selector.addClass("inline");
    var submitButton = searchForm.addInput({value:"Search", type:"submit"});
    /*
    var cobissButton = searchForm.addInput({value:"Cobiss", type:"button"});
    cobissButton.selector.click(function(){
        var data = searchForm.getValue();
        sic.loadModule({moduleName:"Cobiss/CobissList", newTab:"Cobiss List", cobissSearch: data.search});
    });
    */

    var filterValue = sic.getArg(args, "filter", {});

    var dataTable = new sic.widget.sicDataTable({
        parent:tabPage.content.selector,
        primaryKey: ['pub_id'],
        entityTitle: "Pub %pub_id% - %title%",
        dataSource: new sic.widget.sicDataTableDataSource({
            moduleName:"Pub/PubSearch"
        }),
        editorModuleArgs: {
            moduleName:"Pub/PubEdit",
            tabPage:tabPage
        },
        canInsert: false,
        canDelete: false,
        filter: { visible: true, value: filterValue },
        selectCallback: args.selectCallback
    });


    searchForm.onSubmit(function(sicForm){
        dataTable.dataSource.staticData = searchForm.getValue();
        dataTable.refresh();
        //var response = sic.callMethod({moduleName:"Pub/PubSearch", methodName:"search", data:searchForm.getValue()});
        //dataTable.initAndPopulate(response);
    });


};
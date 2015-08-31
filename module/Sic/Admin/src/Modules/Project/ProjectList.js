var F = function(args){

    var tabPage = args.helpers.createTabPage({name:"List"});
    var dataTable = new sic.widget.sicDataTable({
        parent:tabPage.content.selector,
        primaryKey: ['proj_id'],
        entityTitle: "Project %proj_id% - %title%",
        canInsert: !args.inDialog,
        canDelete: !args.inDialog,
        filter: { visible: true },
        dataSource: new sic.widget.sicDataTableDataSource({
            moduleName:"Project/ProjectList"
        }),
        editorModuleArgs: {
            moduleName:"Project/ProjectEdit",
            tabPage:sic.data.mainTab,
            onModuleLoad: function(args){ tabPage.parentTab.destroyTab(); }
        },
        fields: {
            lines_count: { canSort: false }
        },
        selectCallback: args.selectCallback
    });

};
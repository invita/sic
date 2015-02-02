function array_keys(myObject) {
    output = [];
    for(var key in myObject) {
        output.push(key);
    }
    return output;
}

var F = function(args){
    var tabPage = args.helpers.createTabPage({name:"Users"});
    var userData = sic.callMethod({moduleName:"Users/ListUsers", methodName:"listUsers"});
    var dataTable = new sic.widget.sicDataTable({parent:tabPage.content.selector});
    dataTable.initAndPopulate(userData['users']);
    dataTable.selector.css("cursor", "pointer");
    dataTable.onRowDoubleClick(function(args){
        var id = args.row.fields.id.getValue();
        var username = args.row.fields.username.getValue();

        //alert(id);
        //alert(username);

        //var childPage = tabPage.createChildPage({name:"Dashboard", canClose:false});
        //alert("Click: "+args.field.fieldKey+" = "+args.field.getValue());
    });
};
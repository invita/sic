var F = function(args){
    var tabPage = args.helpers.createTabPage({name:"Users"});
    var userData = sic.callMethod({moduleName:"Users/ListUsers", methodName:"listUsers"});
    var dataTable = new sic.widget.sicDataTable({parent:tabPage.content.selector});
    dataTable.initAndPopulate(userData['users']);
    dataTable.selector.css("cursor", "pointer");
    dataTable.onFieldClick(function(args){
        alert("Click: "+args.field.fieldKey+" = "+args.field.getValue());
    });
};
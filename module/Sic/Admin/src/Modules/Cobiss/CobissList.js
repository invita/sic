var F = function(args) {

    var tabPage = args.helpers.createTabPage({name:"List"});

    var formUserData = new sic.widget.sicForm({parent:tabPage.content.selector, captionWidth:"100px"});
    formUserData.addInput({name:"cobiss_search", type:"text", placeholder:"Search", readOnly:false}).selector.addClass("inline");
    formUserData.addInput({name:"save", type:"submit", value:"Search"}).selector.click(function(e){

        /*
        var response = sic.callMethod({moduleName:"Pub/PubEdit", methodName:"pubUpdate",
            pub_id: args.pub_id, proj_id: args.proj_id, line_id: args.line_id, data:formUserData.getValue()});
        if (response && response.data) {
            formUserData.setValue(response.data);
            args.pub_id = response.data.pub_id;
            tabPage.parentTab.setCaption(sic.mergePlaceholders(args.entityTitle, response.data));
        }
        */
    });
    formUserData.onSubmit(function(sicForm){
        dataTable.dataSource.staticData = formUserData.getValue();
        dataTable.refresh();
    });

    var createPub = function(url){


        $.post("/cobiss-request.php", "action=url&url="+url.replace(/&amp;/g, "|").replace(/=/g, "||"), function(data){
            alert(data);
        });


        //var sic.loadModule({moduleName:"Pub/PubEdit", newTab:"Cobiss Pub", cobissData:});
    }

    var dataTable = new sic.widget.sicDataTable({
        parent:tabPage.content.selector,
        canDelete : false,
        //primaryKey: ['pub_id'],
        //entityTitle: "Pub %pub_id% - %title%",
        dataSource: new sic.widget.sicDataTableDataSource({
            moduleName:"Cobiss/CobissList"
        }),
        actions: {
            createPub: {
                label: 'Create Pub',
                type: 'button',
                onClick: function(args) {
                    //sic.dump(args.row.getValue(), 0);
                    //alert('Create Pub');
                    var data = args.row.getValue();
                    //var url = data.url;
                    sic.loadModule({moduleName:"Pub/PubEdit", newTab:"Cobiss Pub", cobissData: data});
                }
            }
        }
    });

    /*

     var dataTable = new sic.widget.sicDataTable({
     parent:tabPage.content.selector,
     canDelete: false,
     primaryKey: ['pub_id'],
     entityTitle: "Pub %pub_id% - %title%",
     dataSource: new sic.widget.sicDataTableDataSource({
     moduleName:"Test/TestDT"
     }),
     actions: {
     createPub: {
     label: 'Create Pub',
     type: 'button',
     onClick: function(args) {
     sic.dump(args.action, 0);
     //alert('Create Pub');
     }
     }
     }
     });

     */

};
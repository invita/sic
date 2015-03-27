var F = function(args) {

    var cobissDataTableId = "cobiss_dt";
    var cobissIframeId = "cobiss_iframe";
    var cobissIframeAttr = {
        //src:"http://www.cobiss.si/",
        //src:"http://www.cobiss.si/scripts/cobiss",
        width:"1200px",
        height:"1200px",
        frameborder:"0",
        scrolling:"no",
        name:cobissIframeId
    };
    var cobissFormId = "cobiss_form";
    var cobissFormAttr = {
        target:cobissIframeId,
        method:"post",
        action:"http://www.cobiss.si/scripts/cobiss"
    };
    var tableHtml = '<table>' +
        '<tr>' +
        '<td valign="top"><form id="'+cobissFormId+'"></form><div id="'+cobissDataTableId+'"></div></td>'+
        '<td><iframe id="'+cobissIframeId+'" ></iframe></td>'+
        '</tr>'+
        '</table>';


    var tabPage = args.helpers.createTabPage({name:"List"});
    tabPage.content.selector.html(tableHtml);

    var cobissDataTable = $("#"+cobissDataTableId);
    var cobissIframe = $("#"+cobissIframeId);
    var cobissForm = $("#"+cobissFormId);

    cobissIframe.attr(cobissIframeAttr);
    cobissForm.attr(cobissFormAttr);

    /*
      $uri = 'http://www.cobiss.si/scripts/cobiss';
      $payload = "base=99999&command=SEARCH&srch=".$search;
     */

    var form = new sic.widget.sicForm({parent:cobissForm, captionWidth:"100px"});
    form.addInput({name:"srch", type:"text", placeholder:"Search", readOnly:false}).selector.addClass("inline");
    form.addInput({name:"command", type:"submit", value:"SEARCH"});
    form.onSubmit(function(e){
        dataTable.dataSource.staticData = form.getValue();
        dataTable.refresh();
    });
    form.selector.append('<input type="hidden" name="base" value="99999" />');

    var dataTable = new sic.widget.sicDataTable({
        parent:cobissDataTable,
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
            },
            cobiss: {
                label: 'Cobiss',
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
    var cobissIframe = $("#cobissIframe iframe");
    cobissIframe.attr("src", "http://www.cobiss.si/");
    cobissIframe.attr("width", "1200px");
    cobissIframe.attr("height", "1200px");
    cobissIframe.attr("frameborder", "0");
    cobissIframe.attr("scrolling", "no");

    $("#cobissDataTable").html("<form target='cobissIframe' id='cobissForm' method='post'></form>");

    var formUserData = new sic.widget.sicForm({parent:$("#cobissForm"), captionWidth:"100px"});
    formUserData.addInput({name:"cobiss_search", type:"text", placeholder:"Search", readOnly:false}).selector.addClass("inline");
    formUserData.addInput({name:"save", type:"submit", value:"Search"}).selector.click(function(e){

    });
    formUserData.onSubmit(function(sicForm){
        $("#cobissForm").submit();
        dataTable.dataSource.staticData = formUserData.getValue();
        dataTable.refresh();
    });

    var createPub = function(url){




        $.post("/cobiss-request.php", "action=url&url="+url.replace(/&amp;/g, "|").replace(/=/g, "||"), function(data){
            alert(data);
        });


        //var sic.loadModule({moduleName:"Pub/PubEdit", newTab:"Cobiss Pub", cobissData:});
    }


    */
};
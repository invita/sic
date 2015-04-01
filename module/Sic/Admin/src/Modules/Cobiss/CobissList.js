var F = function(args) {
    var tabPage = args.helpers.createTabPage({name:"List"});
    var cobissIframeAttr = {
        //src:"http://www.cobiss.si/",
        //src:"http://www.cobiss.si/scripts/cobiss",
        width:"1200px",
        height:"1200px",
        frameborder:"0",
        scrolling:"no"
    };
    var cobissFormAttr = {
        method:"post",
        action:"http://www.cobiss.si/scripts/cobiss"
    };
    var cobissDataTable, cobissIframe, cobissUrl, cobissForm, table, tr, td, dataTable, cobissIframeForm;

    table = new sic.widget.sicElement({parent:tabPage.content.selector, tagName:"table"});
    tr = new sic.widget.sicElement({parent:table.selector, tagName:"tr"});
    td = new sic.widget.sicElement({parent:tr.selector, tagName:"td"});
    td.selector.attr("valign", "top");
    cobissForm = new sic.widget.sicElement({parent:td.selector, tagName:"form"});
    cobissForm.selector.attr(cobissFormAttr);
    cobissDataTable = new sic.widget.sicElement({parent:td.selector, tagName:"div"});
    td = new sic.widget.sicElement({parent:tr.selector, tagName:"td"});
    cobissIframe = new sic.widget.sicElement({parent:td.selector, tagName:"iframe"});
    cobissIframe.selector.attr(cobissIframeAttr);

    cobissIframe.selector.get(0).name = cobissIframe.selector.attr("id");
    cobissForm.selector.attr("target", cobissIframe.selector.attr("id"));

    var form = new sic.widget.sicForm({parent:cobissForm.selector, captionWidth:"100px"});
    form.addInput({name:"srch", type:"text", placeholder:"Search", readOnly:false}).selector.addClass("inline");
    form.addInput({name:"command", type:"submit", value:"SEARCH"});
    form.addInput({name:"command", type:"button", value:"Cobiss"}).selector.click(function(){
        cobissIframe.selector.attr("src", args.url);
    });


    form.onSubmit(function(e){
        //dataTable.dataSource.staticData = form.getValue();
        //dataTable.refresh();

        cobissDataTable.selector.html("");

        dataTable = new sic.widget.sicDataTable({
            parent:cobissDataTable.selector,
            canDelete : false,
            //primaryKey: ['pub_id'],
            //entityTitle: "Pub %pub_id% - %title%",
            dataSource: new sic.widget.sicDataTableDataSource({
                moduleName: "Cobiss/CobissList",
                staticData: form.getValue()
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
        dataTable.onDataFeedComplete(function(args){
            dataTable.dataSource.staticData.paginator = args.paginator;
            dataTable.dataSource.staticData.userAgent = args.userAgent;
            cobissUrl = args.url;
            if(cobissUrl) cobissIframe.selector.attr("src", args.url);
        });
    });
    form.selector.append('<input type="hidden" name="base" value="99999" />');



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
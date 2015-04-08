var F = function(args) {
    var tabPage = args.helpers.createTabPage({name:"List"});
    //var cobissSearch = args.cobissSearch;
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
    var cobissDataTable, cobissIframe, cobissUrl, cobissForm, table, tr, td, dataTable, cobissAllArray;

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
    var srch = form.addInput({name:"srch", type:"text", placeholder:"Search", readOnly:false});
    srch.selector.addClass("inline");
    var submit = form.addInput({name:"command", type:"submit", value:"SEARCH"});
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
                        var data = args.row.getValue();
                        var number = data.number;
                        var dtData = cobissAllArray.dataTable.rows;
                        var cobissRow = {
                            userAgent : dataTable.dataSource.staticData.userAgent
                        };
                        for(var c=0;c<dtData.length; c++){
                            if(dtData[c].number == number){
                                cobissRow = sic.mergeObjects(cobissRow, dtData[c]);
                                sic.callMethod({moduleName:"Cobiss/CobissList", methodName:"getCobissDetail", cobissRow : cobissRow}, function(d){
                                    if(d.data){
                                        data.cobissId = d.data.cobissId;
                                        sic.loadModule({moduleName:"Pub/PubEdit", newTab:"Cobiss Pub", cobissData: data});
                                    }
                                });
                                break;
                            }
                        }
                    }
                }
            }
        });
        dataTable.onDataFeedComplete(function(args){
            dataTable.dataSource.staticData.paginator = args.paginator;
            dataTable.dataSource.staticData.userAgent = args.userAgent;
            cobissUrl = args.url;
            cobissAllArray = args.allArray;
            if(cobissUrl) cobissIframe.selector.attr("src", args.url);
        });
    });
    form.selector.append('<input type="hidden" name="base" value="99999" />');

    /*
    $(function(){
        if(cobissSearch){
            //alert(sic.debug(srch));
            srch.setValue(cobissSearch);
            //form.submit();
            cobissForm.selector.get(0).submit();

        }
    });
    */

};
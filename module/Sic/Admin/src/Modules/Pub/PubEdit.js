var F = function(args) {
    var tabPageBasic = args.helpers.createTabPage({name:"Basic"});

    if (!args.proj_id) args.proj_id = sic.getArg(args.staticData, 'proj_id', null);

    //sic.dump(args, 0);

    var cobissData = sic.getArg(args, 'cobissData', null);
    var author = sic.getArg(cobissData, 'author', null);
    var title = sic.getArg(cobissData, 'title', null);
    var year = sic.getArg(cobissData, 'year', null);

    var panel = new sic.widget.sicPanel({parent:tabPageBasic.content.selector,
        firstGroupName:"Update Publication"});

    var formUserData = new sic.widget.sicForm({parent:panel.firstGroup.content.selector, captionWidth:"100px"});
    formUserData.addInput({name:"pub_id", type:"text", placeholder:"Id...", readOnly:true});

    // TODO: Lookup...
    formUserData.addInput({name:"parent_id", type:"text", placeholder:"Parent...",
        lookup:sic.mergeObjects(sic.lookup.publication, { fieldMap: { parent_id: "pub_id" } })
        //lookup:{
        //    editorModuleArgs: { moduleName:"Pub/PubEdit", tabPage:tabPageBasic, map: { parent_id: "pub_id" } }
        //}
    });
    //formUserData.addInput({name:"parentName", type:"text", placeholder:"ParentName..."});
    formUserData.addInput({name:"author", type:"text", placeholder:"Author...", isArray:true, value:[author]});
    formUserData.addInput({name:"title", type:"text", placeholder:"Title...", isArray:true, value:[title]});
    formUserData.addInput({name:"year", type:"text", placeholder:"Year...", value:year});
    formUserData.addInput({name:"cobiss", type:"text", placeholder:"Cobiss..."});
    formUserData.addInput({name:"issn", type:"text", placeholder:"Issn..."});
    formUserData.addInput({name:"original_id", type:"text", placeholder:"OriginalId...",
        lookup:sic.mergeObjects(sic.lookup.publication, { fieldMap: { original_id: "pub_id" } }) });
    formUserData.addInput({name:"child_id", type:"text", placeholder:"ChildId...", isArray:true, lookup:{} });
    formUserData.addInput({name:"save", type:"submit", value:"Save", caption:" "}).selector.click(function(e){
        var response = sic.callMethod({moduleName:"Pub/PubEdit", methodName:"pubUpdate",
            pub_id: args.pub_id, proj_id: args.proj_id, line_id: args.line_id, data:formUserData.getValue()});
        if (response && response.data) {
            formUserData.setValue(response.data);
            args.pub_id = response.data.pub_id;
            quotesDataTable.dataSource.staticData.pub_id = args.pub_id;

            tabPageBasic.parentTab.setCaption(sic.mergePlaceholders(args.entityTitle, response.data));

            refreshHierarchy();
        }
    });
    formUserData.addInput({name:"cancel", type:"button", value:"Cancel"}).selector.click(function(e){ });
    formUserData.addInput({name:"clear", type:"button", value:"Clear"}).selector.click(function(e){ });

    var hierarchyGroup = panel.addGroup("Publication Hierarchy");
    var hierarchyDiv = new sic.widget.sicElement({parent:hierarchyGroup.content.selector});

    var refreshHierarchy = function() {
        sic.callMethod({moduleName:"Pub/PubEdit", methodName:"pubHierarchy", pub_id: args.pub_id}, function(data){
            //sic.dump(data);
            hierarchyDiv.selector.empty();
            var children = false;
            var paddingLeft = 0;

            for (var i in data) {

                var div = new sic.widget.sicElement({parent:hierarchyDiv.selector});
                div.selector.addClass("hierarchyDiv");
                div.selector.css("padding-left", paddingLeft+"px");
                div.selector.html("["+data[i].pub_id+"] "+data[i].author+": "+data[i].title);

                if (!children) paddingLeft += 10;
                if (data[i].pub_id == args.pub_id) {
                    div.selector.addClass("current");
                    children = true;
                }

                div.selector[0].pub_id = data[i].pub_id;
                div.selector[0].data = data[i];
                div.selector.click(function(e){
                    sic.loadModule(sic.mergeObjects(args, { pub_id:this.pub_id,
                        newTab:sic.mergePlaceholders(args.entityTitle, this.data) }));
                });
            }
        });
    };


    var tabPageQuotes = tabPageBasic.createTabPage({name:"Quotes", autoActive:false, canClose: false });
    var quotesDataTable = new sic.widget.sicDataTable({
        parent:tabPageQuotes.content.selector,
        primaryKey: ['quote_id'],
        entityTitle: "Quote %quote_id%",
        dataSource: new sic.widget.sicDataTableDataSource({
            moduleName:"Pub/PubQuoteList",
            staticData: { pub_id: args.pub_id }
        }),
        editorModuleArgs: {
            moduleName:"Pub/PubQuoteEdit",
            tabPage:tabPageQuotes
        },
        fields: {
            quoted_author: { canSort:false },
            quoted_title: { canSort:false }
        }
    });

    if (args.pub_id){
        var response = sic.callMethod({moduleName:"Pub/PubEdit", methodName:"pubSelect", pub_id: args.pub_id});
        if (response && response.data) formUserData.setValue(response.data);

        refreshHierarchy();
    }
};
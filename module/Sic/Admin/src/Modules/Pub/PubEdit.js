var F = function(args) {
    var tabPageBasic = args.helpers.createTabPage({name:"Basic"});

    if (!args.proj_id) args.proj_id = sic.getArg(args.staticData, 'proj_id', null);

    //sic.dump(args, 0);
    var focusLastQuoteRow = false;
    var importFromLastProjSpan;
    var importFromLastProj;
    var lastProjId = 0;

    var idno = sic.getArg(cobissData, 'idno', null);
    var addidno = sic.getArg(cobissData, 'addidno', null);
    var title = sic.getArg(cobissData, 'title', null);
    var addtitle = sic.getArg(cobissData, 'addtitle', null);
    var creator = sic.getArg(cobissData, 'creator', null);
    var place = sic.getArg(cobissData, 'place', null);
    var publisher = sic.getArg(cobissData, 'publisher', null);
    var year = sic.getArg(cobissData, 'year', null);
    var volume = sic.getArg(cobissData, 'volume', null);
    var issue = sic.getArg(cobissData, 'issue', null);
    var page = sic.getArg(cobissData, 'page', null);
    var edition = sic.getArg(cobissData, 'edition', null);
    var source = sic.getArg(cobissData, 'source', null);
    var online = sic.getArg(cobissData, 'online', null);
    var strng = sic.getArg(cobissData, 'strng', null);
    var note = sic.getArg(cobissData, 'note', null);

    var cobissData = sic.getArg(args, 'cobissData', null);
    var cobissId = sic.getArg(cobissData, 'cobissId', null);

    var panel = new sic.widget.sicPanel({parent:tabPageBasic.content.selector,
        firstGroupName:"Update Publication"});

    var formUserData = new sic.widget.sicForm({parent:panel.firstGroup.content.selector, captionWidth:"100px"});
    formUserData.addInput({name:"pub_id", type:"text", caption:"id", placeholder:"Entity Identifier", readOnly:true});
    formUserData.addInput({name:"idno", type:"text", caption:"idno", placeholder:"Identifier", isArray:true, value:[idno],
        withCode:sic.codes.pubIdno});
    formUserData.addInput({name:"addidno", type:"text", caption:"addIdno", placeholder:"Additional Identifier", isArray:true, value:[addidno]});
    formUserData.addInput({name:"title", type:"textarea", caption:"title", placeholder:"Title", isArray:true, value:[title]});
    formUserData.addInput({name:"addtitle", type:"text", caption:"addTitle", placeholder:"Additional Title", isArray:true, value:[addtitle]});
    formUserData.addInput({name:"creator", type:"text", caption:"creator", placeholder:"Creator", isArray:true, value:[creator],
        withCode:sic.codes.pubCreator});
    formUserData.addInput({name:"place", type:"text", caption:"pubPlace", placeholder:"Publication Place", isArray:true, value:[place]});
    formUserData.addInput({name:"publisher", type:"text", caption:"publisher", placeholder:"Publisher", isArray:true, value:[publisher]});
    formUserData.addInput({name:"year", type:"text", caption:"date", placeholder:"Date", isArray:true, value:[year]});
    formUserData.addInput({name:"volume", type:"text", caption:"volume", placeholder:"Volume", isArray:true, value:[volume]});
    formUserData.addInput({name:"issue", type:"text", caption:"issue", placeholder:"Issue", isArray:true, value:[issue]});
    formUserData.addInput({name:"page", type:"text", caption:"page", placeholder:"Page", isArray:true, value:[page]});
    formUserData.addInput({name:"edition", type:"text", caption:"edition", placeholder:"Edition", isArray:true, value:[edition]});
    formUserData.addInput({name:"source", type:"text", caption:"source", placeholder:"Source", isArray:true, value:[source],
        withCode:sic.codes.pubSource});
    formUserData.addInput({name:"online", type:"text", caption:"online", placeholder:"Online", isArray:true, value:[online],
        withCode:sic.codes.pubOnline});
    formUserData.addInput({name:"strng", type:"text", caption:"string", placeholder:"String", isArray:true, value:[strng]});
    formUserData.addInput({name:"note", type:"text", caption:"note", placeholder:"Note", isArray:true, value:[note]});

    formUserData.addInput({name:"parent_id", type:"text", caption:"parent", placeholder:"Parent Identifier",
        lookup:sic.mergeObjects(sic.lookup.publication, { fieldMap: { parent_id: "pub_id" }, tabPage:tabPageBasic }) });
    formUserData.addInput({name:"is_series", type:"text", caption:"is series", placeholder:"Is Series"});
    formUserData.addInput({name:"original_id", type:"text", caption:"regular", placeholder:"Regular Identifier",
        lookup:sic.mergeObjects(sic.lookup.publication, { fieldMap: { original_id: "pub_id" }, tabPage:tabPageBasic }) });
    formUserData.addInput({name:"child_id", type:"text", caption:"child", placeholder:"Child Identifier", isArray:true,
        lookup:sic.mergeObjects(sic.lookup.publication, { fieldMap: { child_id: "pub_id" }, tabPage:tabPageBasic }) });
    formUserData.addInput({name:"save", type:"submit", value:"Save", caption:" "}).selector.click(function(e){
        var response = sic.callMethod({moduleName:"Pub/PubEdit", methodName:"pubUpdate",
            pub_id: args.pub_id, proj_id: args.proj_id, line_id: args.line_id, data:formUserData.getValue()});
        if (response && response.data) {
            if (confirm("Saved! Do you want to close this tab?")) {
                tabPageBasic.parentTab.destroyTab();
            } else {
                formUserData.setValue(response.data);
                args.pub_id = response.data.pub_id;
                quotesDataTable.dataSource.staticData.pub_id = args.pub_id;
                tabPageBasic.parentTab.setCaption(sic.mergePlaceholders(args.entityTitle, response.data));
                refreshHierarchy();
            }
        }
    });
    //formUserData.addInput({name:"cancel", type:"button", value:"Cancel"}).selector.click(function(e){ });
    //formUserData.addInput({name:"clear", type:"button", value:"Clear"}).selector.click(function(e){ });

    var hierarchyGroup = panel.addGroup("Entity Hierarchy");
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
                div.selector.html("["+data[i].pub_id+"] "+data[i].creator+": "+data[i].title);

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


    var tabPageQuotes = tabPageBasic.createTabPage({name:"Citations", autoActive:false, canClose: false });
    var quotesDataTable = new sic.widget.sicDataTable({
        parent:tabPageQuotes.content.selector,
        primaryKey: ['quote_id'],
        entityTitle: "Quote %quote_id%",
        editable: true,
        rowsPerPage: 100,
        dataSource: new sic.widget.sicDataTableDataSource({
            moduleName:"Pub/PubQuoteList",
            staticData: { pub_id: args.pub_id },
            pageCount: 10
        }),
        initExpandAll: true,
        //editorModuleArgs: {
        //    moduleName:"Pub/PubQuoteEdit",
        //    tabPage:tabPageQuotes
        //},
        fields: {
            quote_id: { caption:"Id", editable: false },
            pub_id: { visible:false },
            quoted_pub_id: { caption:"Cited Entity", editable:false,
                hintF: function(args) { sic.hint.publication(args.row.lastRowData.quoted_pub_id) } },
            quoted_creator: { canSort:false, editable:false, caption:"Creator" },
            quoted_title: { canSort:false, editable:false, caption:"Title" },
            subquote_count: { editable:false, caption:"Ind. Source", canFilter: false },
            _expand: { visible:false }
        },
        customInsert: function(insertDT) {
            sic.loadModule({moduleName:'Pub/PubSearch', tabPage:tabPageBasic,  newTab:'New citation - select entity',
                selectCallback: function(selectArgs){
                    var q_pub_id = selectArgs.row.getValue().pub_id;
                    if (q_pub_id) {
                        sic.callMethod({moduleName:"Pub/PubQuoteEdit", methodName:"quoteInsert", data: { pub_id:args.pub_id, quoted_pub_id: q_pub_id }},
                            function(response) { insertDT.refresh(); });
                    }
                }});

        },
        actions: {
            link: {
                label: 'Dup',
                type: 'button',
                onClick: function(args) {
                    var rowValue = args.row.getValue();
                    sic.callMethod({moduleName:'Pub/PubQuoteEdit', methodName:'duplicateQuote', quote_id:rowValue.quote_id },
                        function(cbArgs) {
                            if (cbArgs.status) {
                                quotesDataTable.goToLastPage();
                                focusLastQuoteRow = true;
                            }
                        });
                }
            }
        },
        subDataTable: {
            dataSource: new sic.widget.sicDataTableDataSource({
                moduleName:"Pub/PubSubQuoteList",
                staticData: { pub_id: args.pub_id }
            }),
            showPaginator: false,
            editable: true,
            fields: {
                quote_id: { caption:"Id", editable: false },
                pub_id: { visible:false },
                quoted_pub_id: { caption:"Cited Entity", editable:false,
                    hintF: function(args) { sic.hint.publication(args.row.lastRowData.quoted_pub_id) } },
                quoted_creator: { canSort:false, editable:false, caption:"Creator" },
                quoted_title: { canSort:false, editable:false, caption:"Title" },
            },
            customInsert: function(insertDT) {
                sic.loadModule({moduleName:'Pub/PubSearch', tabPage:tabPageBasic,  newTab:'New citation - select entity',
                    selectCallback: function(selectArgs){
                        var q_pub_id = selectArgs.row.getValue().pub_id;
                        if (q_pub_id) {
                            sic.callMethod({moduleName:"Pub/PubSubQuoteEdit", methodName:"quoteInsert", data: {
                                    pub_id:args.pub_id, quoted_pub_id: q_pub_id,
                                    parent_quote_id: insertDT.dataSource.staticData.parentRow.quote_id }},
                                function(response) { insertDT.refresh(); });
                        }
                    }});

            },
            actions: {
                link: {
                    label: 'Dup',
                    type: 'button',
                    onClick: function(args) {
                        var rowValue = args.row.getValue();
                        sic.callMethod({moduleName:'Pub/PubQuoteEdit', methodName:'duplicateQuote', quote_id:rowValue.quote_id },
                            function(cbArgs) {
                                if (cbArgs.status) args.dataTable.refresh();
                            });
                    }
                }
            },
        }
    });
    quotesDataTable.onFirstFeedComplete(function() {
        var importFromProj = new sic.widget.sicElement({parent:quotesDataTable.dsControl.selector});
        importFromProj.selector.addClass("inline filterButton vmid");
        var importFromProjImg = new sic.widget.sicElement({parent:importFromProj.selector, tagName:"img", tagClass:"icon12 vmid"});
        importFromProjImg.selector.attr("src", "/img/insert.png");
        var importFromProjSpan = new sic.widget.sicElement({parent:importFromProj.selector, tagName:"span", tagClass:"vmid"});
        importFromProjSpan.selector.html("Import from project");
        importFromProj.selector.click(function(e){
            sic.loadModule({moduleName:'Project/ProjectList', newTab:'Project', inDialog: true,
                selectCallback: function(selectArgs){
                    var pub_id = args.pub_id;
                    var proj_id = selectArgs.row.getValue().proj_id;

                    // Set lastProject
                    lastProjId = proj_id;
                    importFromLastProjSpan.selector.html("Repeat import ("+lastProjId+" - "+selectArgs.row.getValue().title+")");
                    importFromLastProj.fadeIn();

                    if (pub_id && proj_id) {
                        sic.loadModule({moduleName:'Project/ProjectLineSelect', newTab:'Select', inDialog: true, proj_id: proj_id,
                            closeOKCallback: function(closeOKArgs){
                                sic.callMethod({moduleName:"Pub/PubEdit",
                                        methodName:"importQuotesFromProject", pub_id: pub_id, proj_id: proj_id},
                                    function(response) { quotesDataTable.refresh(); });
                            }
                        });
                    }
                }});
        });

        importFromLastProj = new sic.widget.sicElement({parent:quotesDataTable.dsControl.selector});
        importFromLastProj.selector.addClass("inline filterButton vmid");
        var importFromLastProjImg = new sic.widget.sicElement({parent:importFromLastProj.selector, tagName:"img", tagClass:"icon12 vmid"});
        importFromLastProjImg.selector.attr("src", "/img/insert.png");
        importFromLastProjSpan = new sic.widget.sicElement({parent:importFromLastProj.selector, tagName:"span", tagClass:"vmid"});
        importFromLastProj.selector.click(function(e){

            if (!lastProjId)
            {
                alert("No project selected");
                return;
            }
            var pub_id = args.pub_id;
            if (pub_id) {
                sic.loadModule({moduleName:'Project/ProjectLineSelect', newTab:'Select', inDialog: true, proj_id: lastProjId,
                    closeOKCallback: function(closeOKArgs){
                        sic.callMethod({moduleName:"Pub/PubEdit",
                                methodName:"importQuotesFromProject", pub_id: pub_id, proj_id: lastProjId},
                            function(response) { quotesDataTable.refresh(); });
                    }
                });
            }
        });
        importFromLastProj.displayNone();
    });
    tabPageQuotes.onActive(function(){ quotesDataTable.recalculateInputs(); });

    quotesDataTable.onFieldClick(function(eArgs){
        if (eArgs.field.fieldKey == "subquote_count") {
            eArgs.row.expandToggleSubRow();
        }
    });

    quotesDataTable.onDataFeedComplete(function(eArgs) {
        if (focusLastQuoteRow) {
            var row = quotesDataTable.findLastVisibleRow();
            if (row && row.fields['on_page'] && row.fields['on_page'].input && row.fields['on_page'].input.input) {
                row.fields['on_page'].input.input.selector.focus();
                row.fields['on_page'].input.input.selector.select();
                row.addTempClassName('duplicated');
            }
            focusLastQuoteRow = false;
        }
    });

    if (args.pub_id){
        var response = sic.callMethod({moduleName:"Pub/PubEdit", methodName:"pubSelect", pub_id: args.pub_id});
        if (response && response.data) formUserData.setValue(response.data);
        tabPageBasic.parentTab.setCaption(sic.mergePlaceholders(args.entityTitle, response.data));
        refreshHierarchy();
    } else if (args.initValue) {
        formUserData.setValue(args.initValue);
    }
};
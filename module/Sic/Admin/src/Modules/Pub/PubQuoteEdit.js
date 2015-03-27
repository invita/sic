var F = function(args) {

    if (!args.pub_id && args.staticData && args.staticData.pub_id) args.pub_id = args.staticData.pub_id;

    var tabPage = args.helpers.createTabPage({name:"Quotes", canClose:false});

    var panel = new sic.widget.sicPanel({parent:tabPage.content.selector,
        firstGroupName:"Update Quote"});

    var formQuote = new sic.widget.sicForm({parent:panel.firstGroup.content.selector, captionWidth:"100px"});
    formQuote.addInput({name:"quote_id", type:"text", placeholder:"Id...", readOnly:true});
    formQuote.addInput({name:"pub_id", type:"text", placeholder:"Pub Id...", readOnly:true, value:args.pub_id,
        lookup:sic.mergeObjects(sic.lookup.publication, { }) });

    formQuote.addInput({name:"pub_page", type:"text", placeholder:"Page..." });
    formQuote.addInput({name:"quoted_pub_id", type:"text", placeholder:"Quoted Pub...",
        lookup:sic.mergeObjects(sic.lookup.publication, { fieldMap: { quoted_pub_id: "pub_id" } }) });
    formQuote.addInput({name:"quoted_pub_page", type:"text", placeholder:"Quoted Page..." });
    formQuote.addInput({name:"save", type:"submit", value:"Save", caption:" "}).selector.click(function(e){
        var response = sic.callMethod({moduleName:"Pub/PubQuoteEdit", methodName:"quoteUpdate",
            pub_id: args.pub_id, quote_id: args.quote_id, data:formQuote.getValue()});
        if (response && response.data) {
            formQuote.setValue(response.data);
            args.quote_id = response.data.quote_id;
            tabPage.parentTab.setCaption(sic.mergePlaceholders(args.entityTitle, response.data));
        }
    });

    if (args.quote_id){
        var response = sic.callMethod({moduleName:"Pub/PubQuoteEdit", methodName:"quoteSelect", quote_id: args.quote_id});
        if (response && response.data) formQuote.setValue(response.data);
    }
};
// ------------------------
// |  Tab1  |  Tab2  | ...   } sicTabPage(this).header
// ------------------------
// | Content...              }
// |                         } sicTabPage(this).content
// |                         }
// |                         }
// ------------------------
//
//  Tab1(Tab2)  }  sicTabPage(this).tabButton
//
//
sic.widget.sicTabPage = function(args)
{
    // Init
    var _p = this;
    this.isTabPage = true;
    this.header = null;
    this.content = null;
    this.uniqId = sic.widget._nextTabId();

    this.eventb = sic.object.sicEventBase;
    this.eventb();

    this.parentTab = null;
    this.childTabs = {};

    // Settings
    this.parent = sic.getArg(args, "parent", null);
    this.name = sic.getArg(args, "name", this.uniqId);
    this.caption = sic.getArg(args, "caption", args.name ? this.name : "newTab");
    this.autoActive = sic.getArg(args, "autoActive", true);
    this.unique = sic.getArg(args, "unique", false);
    this.canClose = sic.getArg(args, "canClose", true);
    this.canCloseFirstTab = sic.getArg(args, "canCloseFirstTab", false);
    this.contentText = sic.getArg(args, "contentText", "");
    this.fadeTime = sic.getArg(args, "fadeTime", sic.defaults.fadeTime);
    this.hideHeader = sic.getArg(args, "hideHeader", false);
    this.cropCaptionLength = sic.getArg(args, "cropCaptionLength", 30);

    this.activeGrad = sic.getArg(args, "activeGrad", sic.defaults.tabActiveGrad);
    this.inactiveGrad = sic.getArg(args, "inactiveGrad", sic.defaults.tabInactiveGrad);


    // Events
    this.onClose = function(f) { _p.subscribe("onClose", f); };
    this.onClosed = function(f) { _p.subscribe("onClosed", f); };
    this.onChildClosed = function(f) { _p.subscribe("onChildClosed", f); };
    this.onActive = function(f) { _p.subscribe("onActive", f); };

    // Implementation

    this._createHeader = function(parent){
        _p.header = new sic.widget.sicTabPageHeader({parent:parent, insertAtTop:true});
        _p.header.selector.addClass("sicTabHeader");
        _p.header.selector.sicTabPageHeader = _p.header;
        if (_p.hideHeader) _p.header.displayNone();
    };

    this._createTabButton = function(sicTabHeader){
        var isFirstTab = sicTabHeader.children().length == 0;
        _p.tabButton = new sic.widget.sicElement({parent:sicTabHeader});
        _p.tabButton.selector.addClass("sicTabButton");
        _p.tabButton.setGradient(_p.inactiveGrad, true, true);

        _p.tabButton.captionSpan = new sic.widget.sicElement({parent:_p.tabButton.selector, tagName:'span'});
        _p.tabButton.captionSpan.selector.addClass("sicTabButton_caption");
        if (_p.caption) _p.setCaption(_p.caption);

        if (_p.canClose && (_p.canCloseFirstTab || !isFirstTab)) _p._createCloseSpan();

        _p.tabButton.selector.click(function(e){
            _p.selectTab();
            //alert("("+_p.uniqId+") Child Tabs:\n"+sic.debug(_p.childTabs, 0));
        });
    };

    this._createCloseSpan = function(){
        _p.tabButton.closeSpan = new sic.widget.sicElement({parent:_p.tabButton.selector, tagName:'span'});
        _p.tabButton.closeSpan.selector.addClass("sicTabButton_closeButton");
        _p.tabButton.closeImg = new sic.widget.sicElement({parent:_p.tabButton.closeSpan.selector, tagName:'img'});
        _p.tabButton.closeImg.selector.attr("src", "/img/tabClose2.png");
        _p.tabButton.closeSpan.selector.click(function(e) {
            _p.destroyTab();
        });
    };

    this._createTabContent = function(sicTabHeader){
        _p.content = new sic.widget.sicElement({parent:sicTabHeader});
        _p.content.selector.sicTabPage = _p;
        _p.content.selector.addClass("sicTabContent");
        _p.content.selector.css("display", "none");
        _p.content.selector.html(_p.contentText);
        _p.content.selector.tabPage = _p;

        if (_p.autoActive) _p.selectTab();
    };

    this.selectTab = function(){
        if (_p.tabButton.selector.hasClass("active")) return;
        for (var i in _p.header.pages) {
            var page = _p.header.pages[i];
            page.tabButton.selector.removeClass("active");
            page.tabButton.setGradient(_p.inactiveGrad, true, true);
            page.content.selector.css("display", "none");
        }
        _p.tabButton.selector.addClass("active");
        _p.tabButton.setGradient(_p.activeGrad, true, true);
        _p.content.selector.fadeIn(_p.fadeTime);
        _p.trigger("onActive", {tabPage:_p});
    };

    this.destroyTab = function(){
        _p.trigger("onClose", {tabPage:_p});

        for (var childIdx in _p.childTabs) {
            _p.childTabs[childIdx].destroyTab();
        }
        if (_p.parentTab)
            delete _p.parentTab.childTabs[_p.uniqId];

        var pageToSelectAfterClose = null;
        if (_p.tabButton.selector.hasClass("active"))
            pageToSelectAfterClose = _p.header.findPageBeforeId(_p.uniqId);

        _p.header.removePageRef(_p.uniqId);
        _p.tabButton.selector.remove();
        _p.content.selector.remove();

        if (pageToSelectAfterClose)
            pageToSelectAfterClose.selectTab();

        _p.trigger("onClosed", {tabPage:_p});
        if (_p.parentTab) _p.parentTab.trigger('onChildClosed', {tabPage:_p})
    };

    this.setCaption = function(newCaption) {
        newCaption = newCaption.trim();

        if (_p.cropCaptionLength && newCaption.length > _p.cropCaptionLength)
            newCaption = newCaption.substring(0, _p.cropCaptionLength)+"...";

        _p.caption = newCaption;
        _p.tabButton.captionSpan.selector.html(newCaption);
    };

    this.alertMode = false;
    this.appendTo = function(parent, insertInFront) {

        var contentParent;
        if (parent.isTabPage){

            // Appending to parent sicTabPage
            if (_p.alertMode) alert("append "+_p.name+" to "+_p.parent.name);
            _p.header = parent.header;
            contentParent = parent.header.parent;

            if (contentParent.hasClass("sicTabContent") && contentParent.sicTabPage){
                _p.parentTab = contentParent.sicTabPage;
                _p.parentTab.childTabs[_p.uniqId] = _p;
            }

        } else if (parent.isTabPageHeader){

            // Appending to parent sicTabPageHeader
            if (_p.alertMode) alert("append "+_p.name+" to another tabPage header");
            _p.header = parent;
            contentParent = parent.parent;

            if (contentParent.hasClass("sicTabContent") && contentParent.sicTabPage){
                _p.parentTab = contentParent.sicTabPage;
                _p.parentTab.childTabs[_p.uniqId] = _p;
            }

        } else {

            // Appending to parent sicElement
            if (parent.isSicElement) {
                if (_p.alertMode) alert("append "+_p.name+" to sicElement");
                parent = parent.selector;
            }
            contentParent = parent;

            // Appending to an element (jquery)
            if (_p.alertMode) alert("append "+_p.name+" to jQuery selector");
            _p._createHeader(parent);

            if (parent.hasClass("sicTabContent") && parent.sicTabPage) {
                _p.parentTab = parent.sicTabPage;
                _p.parentTab.childTabs[_p.uniqId] = _p;
            }

        }

        //sic.dump(contentParent);
        //alert(contentParent+" "+parent.isTabPage);

        var pageWithThatName = _p.header.findPageByName(_p.name);

        if (!_p.unique || !pageWithThatName) {
            _p._createTabButton(_p.header.selector, insertInFront);
            _p._createTabContent(contentParent);
            _p.header.addPageReference(_p.uniqId, _p);
        } else {
            for (var i in pageWithThatName)
                this[i] = pageWithThatName[i];

            pageWithThatName.selectTab();
        }
    };

    this.createTabPage = function(args) {
        if (!args) args = {};
        args.parent = _p;
        var newTabPage = new sic.widget.sicTabPage(args);
        newTabPage.parentTabPage = _p.parentTabPage;
        return newTabPage;
    };

    this.createChildPage = function(args) {
        if (!args) args = {};
        args.parent = _p.childTabHeader ? _p.childTabHeader : _p.content.selector;
        var childTabPage = new sic.widget.sicTabPage(args);
        childTabPage.parentTabPage = _p;
        childTabPage.header.parentTabPage = _p;
        _p.childTabHeader = childTabPage.header;
        return childTabPage;
    };

    if (this.parent)
        this.appendTo(this.parent);

};

sic.widget.sicTabPageHeader = function(args){
    var _p = this;
    this._cons = sic.widget.sicElement;
    this._cons(args);

    this.isTabPageHeader = true;

    this.pages = {};
    this.addPageReference = function(uniqId, tabPage){
        _p.pages[uniqId] = tabPage;
    };
    this.removePageRef = function(uniqId){
        delete _p.pages[uniqId];
    };
    this.referenceExists = function(uniqId) {
        return _p.pages[uniqId] ? true : false;
    };
    this.findPageIdByName = function(pageName) {
        for (var pageId in _p.pages) {
            if (_p.pages[pageId].name == pageName)
                return pageId;
        }
        return null;
    };
    this.findPageByName = function(pageName) {
        var pageId = _p.findPageIdByName(pageName);
        if (pageId) return _p.pages[pageId];
        return null;
    };
    this.findPageById = function(uniqId) {
        return _p.pages[uniqId];
    };
    this.findPageBeforeId = function(uniqId) {
        var result = null;
        for (var i in _p.pages){
            if (i == uniqId) break;
            result = _p.pages[i];
        }
        //if (!result) alert(Object.keys(_p.pages));
        if (!result && Object.keys(_p.pages).length > 1) result = _p.pages[Object.keys(_p.pages)[1]];

        return result;
    };
};

// Id Generator
sic.widget._lastTabId = 0;
sic.widget._nextTabId = function(){
    sic.widget._lastTabId += 1;
    return "tab"+sic.widget._lastTabId;
};

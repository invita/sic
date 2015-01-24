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

    // Settings
    this.parent = sic.getArg(args, "parent", null);
    this.name = sic.getArg(args, "name", "newTab");
    this.autoActive = sic.getArg(args, "autoActive", true);
    this.unique = sic.getArg(args, "unique", false);
    this.canClose = sic.getArg(args, "canClose", true);
    this.contentText = sic.getArg(args, "contentText", "");
    this.fadeTime = sic.getArg(args, "fadeTime", sic.defaults.fadeTime);

    this.defaultGradient = "blue";
    this.selectedGradient = "orange";


    // Implementation

    this._createHeader = function(parent){
        _p.header = new sic.widget.sicTabPageHeader({parent:parent, insertAtTop:true});
        _p.header.selector.addClass("sicTabHeader");
    };

    this._createTabButton = function(sicTabHeader){
        _p.tabButton = new sic.widget.sicElement({parent:sicTabHeader});
        _p.tabButton.selector.addClass("sicTabButton");
        _p.tabButton.selector.html(_p.name);

        _p.tabButton.selector.click(function(e){
            _p.selectTab();
        });
    };

    this._createTabContent = function(sicTabHeader){
        _p.content = new sic.widget.sicElement({parent:sicTabHeader});
        _p.content.selector.addClass("sicTabContent");
        _p.content.selector.css("display", "none");
        _p.content.selector.html(_p.contentText);

        if (_p.autoActive) _p.selectTab();
    };

    this.selectTab = function(){
        if (_p.tabButton.selector.hasClass("active")) return;
        for (var i in _p.header.pages) {
            var page = _p.header.pages[i];
            page.tabButton.selector.removeClass("active");
            page.tabButton.setGradient(_p.defaultGradient);
            page.content.selector.css("display", "none");

        }
        _p.tabButton.selector.addClass("active");
        _p.tabButton.setGradient(_p.selectedGradient);
        _p.content.selector.fadeIn(_p.fadeTime);
    };

    this.appendTo = function(parent, insertInFront) {

        var contentParent;
        if (parent.isTabPage){

            // Appending to parent sicTabPage
            _p.header = parent.header;
            contentParent = parent.parent;

        } else {

            // Appending to parent sicElement
            if (parent.isSicElement) parent = parent.selector;
            contentParent = parent;

            // Appending to an element (jquery)
            _p._createHeader(parent);
        }

        var pageWithThatName = _p.header.findPageByName(_p.name);

        if (!_p.unique || !pageWithThatName) {
            _p._createTabButton(_p.header.selector, insertInFront);
            _p._createTabContent(contentParent);
            _p.header.addPageReference(_p.uniqId, _p);
        } else {
            for (i in pageWithThatName)
                this[i] = pageWithThatName[i];

            pageWithThatName.selectTab();
        }
    };

    if (this.parent)
        this.appendTo(this.parent);


    this.tabButton.setGradient("blue");
};

sic.widget.sicTabPageHeader = function(args){
    var _p = this;
    this._cons = sic.widget.sicElement;
    this._cons(args);

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
};

// Id Generator
sic.widget._lastTabId = 0;
sic.widget._nextTabId = function(){
    sic.widget._lastTabId += 1;
    return "tab"+sic.widget._lastTabId;
};

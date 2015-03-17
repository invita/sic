sic.widget.sicDialog = function(args)
{
    // Init
    var _p = this;
    this._cons = sic.widget.sicElement;
    this._cons({ parent:$("body"), tagClass:"sicDialog" });

    // Settings
    this.backgroundOpacity = sic.getArg(args, "backgroundOpacity", 0.4);
    this.title = sic.getArg(args, "title", "Dialog");
    this.text = sic.getArg(args, "text", null);
    this.canClose = sic.getArg(args, "canClose", true);
    this.createMainTab = sic.getArg(args, "createMainTab", true);

    // Implementation
    this.background = new sic.widget.sicElement({parent:this.selector, tagClass:"dialogBg"});
    this.background.selector.css("opacity", this.backgroundOpacity);

    this.container = new sic.widget.sicElement({parent:this.selector, tagClass:"dialogContainer"});

    this.header = new sic.widget.sicElement({parent:this.container.selector, tagClass:"dialogHeader"});

    this.titleDiv = new sic.widget.sicElement({parent:this.header.selector, tagClass:"titleDiv"});

    if (this.canClose) {
        this.closeDiv = new sic.widget.sicElement({parent:this.header.selector, tagClass:"closeDiv"});
        this.closeDiv.selector.html("x");
        this.closeDiv.selector.click(function(e) { _p.close(); });
    }

    this.content = new sic.widget.sicElement({parent:this.container.selector, tagClass:"dialogContent"});

    this.header.setGradient('blue');

    if (this.title) this.titleDiv.selector.html(this.title);
    if (this.text) this.content.selector.html(this.text);

    if (this.createMainTab) {
        this.mainTab = new sic.widget.sicTabPage({
            name: this.title ? this.title : "Dialog",
            parent: this.content.selector,
            canClose: false,
            hideHeader: true
        });
        this.mainTab.onChildClosed(function() { _p.close(); });
    }

    this.close = function() {
        _p.selector.remove();
    };
};
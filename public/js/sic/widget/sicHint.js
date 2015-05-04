sic.widget.sicHint = function(args)
{
    // Init
    var _p = this;
    this._cons = sic.widget.sicElement;
    this._cons({ parent:sic.data.contentElement });
    this.selector.addClass("sicHint");

    // Settings
    this.text = sic.getArg(args, "text", null);
    this.hideOnMouseMove = sic.getArg(args, "hideOnMouseMove", true);
    this.destroyOnHide = sic.getArg(args, "destroyOnHide", true);

    // Implementation
    this.displayNone();

    if (this.text)
        this.selector.html(this.text);

    this.moveToCursor = function(){
        _p.selector.css("left", (sic.mouse.x +12)+"px");
        _p.selector.css("top", (sic.mouse.y -10)+"px");
    };

    this.show = function(){
        _p.selector.stop().fadeIn(sic.defaults.hintFadeTime);
        if (this.hideOnMouseMove) {
            $(document).one("mousemove", function(e) { _p.hide(); });
        }
    };

    this.hide = function(){
        _p.selector.stop().fadeOut(sic.defaults.hintFadeTime, function(){
            if (_p.destroyOnHide) {
                _p.selector.remove();
            }
        });
    };
};

sic.showHint = function(text){
    if (!text) return;
    var hint = new sic.widget.sicHint({text:text});
    hint.moveToCursor();
    hint.show();
};

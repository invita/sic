sic.widget.sicAutoComplete = function(args)
{
    // Init
    var _p = this;
    this._cons = sic.widget.sicHint;
    this._cons(sic.mergeObjects({ hideOnMouseMove: false }, args));
    this.selector.addClass("sicAutoComplete");

    this.lines = sic.getArg(args, "lines", []);
    this.inputSelector = sic.getArg(args, "inputSelector", null);

    for (var i in this.lines) {
        var lineText = this.lines[i];
        var lineDiv = new sic.widget.sicElement({parent:_p.selector});
        lineDiv.selector.addClass("sicAutoCompleteLine");
        lineDiv.selector.html(lineText);
        lineDiv.selector[0].lineText = lineText;
        lineDiv.selector.click(function() {
            if (_p.inputSelector) {
                _p.inputSelector.val(this.lineText);
            }
        })
    }

};


sic.widget.sicAutoComplete = function(args)
{
    // Init
    var _p = this;
    this._cons = sic.widget.sicHint;
    this._cons(sic.mergeObjects({ hideOnMouseMove: false }, args));
    this.selector.addClass("sicAutoComplete");

    this.lines = sic.getArg(args, "lines", []);
    this.typed = sic.getArg(args, "typed", "");
    this.inputSelector = sic.getArg(args, "inputSelector", null);

    for (var i in this.lines) {
        var lineText = this.lines[i];
        var lineTextBuffer = lineText;
        var lineDisplayText = lineText;
        var lineDiv = new sic.widget.sicElement({parent:_p.selector});
        lineDiv.selector.addClass("sicAutoCompleteLine");
        if (this.typed) {
            lineDisplayText = "";
            var typedUpper = this.typed.toUpperCase();
            while (true) {
                var pos = lineTextBuffer.toUpperCase().indexOf(typedUpper, 0);
                if (pos == -1) break;

                lineDisplayText +=
                    lineTextBuffer.substr(0, pos)+
                        "<b>"+lineTextBuffer.substr(pos,typedUpper.length)+"</b>";
                lineTextBuffer = lineTextBuffer.substr(pos+typedUpper.length);
            }

            lineDisplayText += lineTextBuffer;
        }

        lineDiv.selector.html(lineDisplayText);
        lineDiv.selector[0].lineText = lineText;
        lineDiv.selector.click(function() {
            if (_p.inputSelector) {
                _p.inputSelector.val(this.lineText);
            }
        })
    }

};


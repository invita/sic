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

    if (this.typed.value) this.typed = this.typed.value;

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
        lineDiv.selector[0].lineIdx = parseInt(i) +1;
        lineDiv.selector.click(function() {
            if (_p.inputSelector) {
                _p.inputSelector.val(this.lineText);
            }
        });
        lineDiv.selector.hover(function() {
            _p.selector.children().removeClass("marked");
            _p.lineIdx = this.lineIdx;
            //alert(this.lineIdx);
            _p.selector.children(":nth-child("+_p.lineIdx+")").addClass("marked");
        });
    }

    // Key manipulation
    this.lineIdx = 0;
    this.maxLineIdx = this.lines.length;

    this.inputSelector.keydown(function(e) {
        if (e.which == 38) { // Up Key
            _p.lineIdx -= 1;
            if (_p.lineIdx < 0) _p.lineIdx = _p.maxLineIdx;
            _p.selector.children().removeClass("marked");
            _p.selector.children(":nth-child("+_p.lineIdx+")").addClass("marked");
            e.preventDefault();
            return false;
        }
        else if (e.which == 40) { // Down Key
            _p.lineIdx += 1;
            if (_p.lineIdx > _p.maxLineIdx) _p.lineIdx = 0;
            _p.selector.children().removeClass("marked");
            _p.selector.children(":nth-child("+_p.lineIdx+")").addClass("marked");
            //alert();
            e.preventDefault();
            return false;
        } else if (e.which == 27) {
            _p.hide();
        } else if (e.which == 13) {
            _p.selector.children(":nth-child("+_p.lineIdx+")").click();
            _p.hide();
            if (_p.selector.css("display") != "none") {
                e.preventDefault();
                return false;
            }
        }
    });
};


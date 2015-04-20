sic.widget.sicHtmlTable = function(args)
{
    // Init
    var _p = this;
    this._cons = sic.widget.sicElement;
    this._cons(sic.mergeObjects(args, {tagName:"table"}));

    this.lastTr = null;
    this.lastTd = null;
    this.trs = [];

    // Settings
    this.rows = sic.getArg(args, "rows", 1);
    this.columns = sic.getArg(args, "columns", 2);

    this.addTr = function(){
        var tr = new sic.widget.sicElement({parent:_p.selector, tagName:"tr"});
        return tr;
    };
    this.addTd = function(){
        var td = new sic.widget.sicElement({parent:_p.lastTr.selector, tagName:"td"});
        return td;
    };
    this.getCell = function(row, column) {
        var result = null;
        if (_p.trs[row] && _p.trs[row].tds[column])
            result = _p.trs[row].tds[column];
        return result;
    };

    for (var i = 0; i < this.rows; i++) {

        this.lastTr = this.addTr();
        this.lastTr.selector.addClass("sicHtmlTable_tr");
        this.lastTr.tds = [];
        this.trs.push(this.lastTr);

        for (var j = 0; j < this.columns; j++) {
            this.lastTd = this.addTd();
            this.lastTd.selector.addClass("sicHtmlTable_td");
            this.lastTr.tds.push(this.lastTd);
        }
    }
};

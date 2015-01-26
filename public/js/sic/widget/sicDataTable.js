sic.widget.sicDataTable = function(args)
{
    // Init
    var _p = this;
    this._cons = sic.widget.sicElement;
    this._cons({ parent:args.parent });

    this._eventb = sic.object.sicEventBase;
    this._eventb();

    // Settings - Basic
    this.name = sic.getArg(args, "name", null);
    this.caption = sic.getArg(args, "caption", "");

    // Settings - Appearance
    this.cssClass_holderDiv = sic.getArg(args, "cssClass_holderDiv", "sicDataTable");
    this.cssClass_table = sic.getArg(args, "cssClass_table", "sicDataTable_table");

    // Events
    this.onRowClick = function(f) { _p.subscribe("rowClick", f); };
    this.onRowDoubleClick = function(f) { _p.subscribe("rowDoubleClick", f); };
    this.onRowRightClick = function(f) { _p.subscribe("rowRightClick", f); };
    this.onFieldClick = function(f) { _p.subscribe("fieldClick", f); };
    this.onFieldDoubleClick = function(f) { _p.subscribe("fieldDoubleClick", f); };
    this.onFieldRightClick = function(f) { _p.subscribe("fieldRightClick", f); };


    // Implementation
    this.selector.addClass(_p.cssClass_holderDiv);
    this.initialized = false;


    // Table
    this.createTable = function() {
        _p.container = new sic.widget.sicElement({parent:_p.selector});
        _p.container.selector.addClass(_p.cssClass_table);

        _p.table = new sic.widget.sicElement({parent:_p.container.selector, tagName:"table"});
        _p.table.selector.addClass(_p.tableCssClass);
        _p.table.selector.attr("cellpadding", "0");
        _p.table.selector.attr("cellspacing", "0");

        if (_p.width != "auto") _p.table.selector.css("width", _p.width);

        _p.tHead = new Cap.Widget.capTag(_p.table.selector, "thead");
        _p.tBody = new Cap.Widget.capTag(_p.table.selector, "tbody");

        _p.createHeaderRow();
        _p.createRows();
    };

    // Header
    this.createHeaderRow = function() {

        _p.headerRow = new Cap.Widget.capDataTableRow(_p.tHead.selector, {
            headerRow: true,
            enableExtraTr: false,
            bluePrints: _p.columns,
            gradColor: _p.headRowGradient,
            hoverColor: _p.headRowGradient,
            allowEdit: false,
            allowDelete: false,
            dataTable: _p
        });

        _p.headerRow.addHeaderFields();
    };

    this.createRows = function() {
        _p.rows = [];

        for (var rowIdx = -1; rowIdx < this.pageSize; rowIdx++){

            var row = new Cap.Widget.capDataTableRow(_p.tBody.selector, {
                enableExtraTr: _p.extraColumns != null,
                bluePrints: _p.columns,
                extraBluePrints: _p.extraColumns,
                gradColor: _p.dataRowGradient,
                hoverColor: _p.dataRowGradientHover,
                allowEdit: _p.allowEdit,
                allowDelete: _p.allowDelete,
                primaryKey: _p.primaryKey,
                rowDataParser: _p.rowDataParser,
                dataTable: _p,
                rowIdx: rowIdx
            });

            row.addTableFields();
            if (_p.extraColumns)
                row.addExtraFields();

            if (rowIdx == -1)
                _p.insertRow = row;
            else
                _p.rows.push(row);
        }
    };
};






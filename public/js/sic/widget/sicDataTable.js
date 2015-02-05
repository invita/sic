// sicDataTable
// sicDataTableRow
// sicDataTableField
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

    // Data Fields Events
    this.onRowClick = function(f) { _p.subscribe("dataRowClick", f); };
    this.onRowDoubleClick = function(f) { _p.subscribe("dataRowDoubleClick", f); };
    this.onRowRightClick = function(f) { _p.subscribe("dataRowRightClick", f); };
    this.onFieldClick = function(f) { _p.subscribe("dataFieldClick", f); };
    this.onFieldDoubleClick = function(f) { _p.subscribe("dataFieldDoubleClick", f); };
    this.onFieldRightClick = function(f) { _p.subscribe("dataFieldRightClick", f); };

    // Header Fields Events
    this.onHeaderRowClick = function(f) { _p.subscribe("headerRowClick", f); };
    this.onHeaderRowDoubleClick = function(f) { _p.subscribe("headerRowDoubleClick", f); };
    this.onHeaderRowRightClick = function(f) { _p.subscribe("headerRowRightClick", f); };
    this.onHeaderFieldClick = function(f) { _p.subscribe("headerFieldClick", f); };
    this.onHeaderFieldDoubleClick = function(f) { _p.subscribe("headerFieldDoubleClick", f); };
    this.onHeaderFieldRightClick = function(f) { _p.subscribe("headerFieldRightClick", f); };

    // All Fields Events
    this.onAnyRowClick = function(f) { _p.subscribe("rowClick", f); };
    this.onAnyRowDoubleClick = function(f) { _p.subscribe("rowDoubleClick", f); };
    this.onAnyRowRightClick = function(f) { _p.subscribe("rowRightClick", f); };
    this.onAnyFieldClick = function(f) { _p.subscribe("fieldClick", f); };
    this.onAnyFieldDoubleClick = function(f) { _p.subscribe("fieldDoubleClick", f); };
    this.onAnyFieldRightClick = function(f) { _p.subscribe("fieldRightClick", f); };


    // Implementation
    this.selector.addClass(_p.cssClass_holderDiv);
    this.initialized = false;


    // Table
    this.createTable = function() {
        if (!_p.table) {
            _p.table = new sic.widget.sicElement({parent:_p.selector, tagName:"table"});
            _p.table.selector.addClass(_p.cssClass_table);
            _p.table.selector.attr("cellpadding", "0");
            _p.table.selector.attr("cellspacing", "0");
        }

        if (!_p.tHead) _p.tHead = new sic.widget.sicElement({parent:_p.table.selector, tagName:"thead"});
        if (!_p.tBody) _p.tBody = new sic.widget.sicElement({parent:_p.table.selector, tagName:"tbody"});

        _p.createHeaderRow();
        _p.createRows();
    };

    // Header
    this.createHeaderRow = function() {
        _p.headerRow = new sic.widget.sicDataTableRow(_p.tHead.selector, {
            headerRow: true,
            dataTable: _p
        });

        if (!_p.bluePrint) {
            _p.headerRow.addField("init", "No data");
        } else {
            for (var fieldKey in _p.bluePrint.fields) {
                var fieldBP = _p.bluePrint.fields[fieldKey];
                _p.headerRow.addField(fieldBP.fieldKey, fieldBP.fieldLabel);
            }
        }
    };

    this.createRows = function() {
        if (!_p.bluePrint) return;

        _p.rows = [];

        //for (var rowIdx = -1; rowIdx < this.pageSize; rowIdx++){
        for (var rowIdx = 0; rowIdx < _p.bluePrint.rowsPerPage; rowIdx++){

            var row = new sic.widget.sicDataTableRow(_p.tBody.selector, {
                dataTable: _p,
                rowIdx: rowIdx
            });

            if (!_p.bluePrint) {
                row.addField("init", "");
            } else {
                for (var fieldKey in _p.bluePrint.fields) {
                    var fieldBP = _p.bluePrint.fields[fieldKey];
                    row.addField(fieldBP.fieldKey, fieldBP.initValue);
                }
            }

            _p.rows.push(row);
        }
    };

    this.getEventArgs = function(){
        return { dataTable: _p };
    };


    this.getValueType = function(val) {
        return "str";
    };

    this.getInitValueForType = function(valType) {
        return "";
    };

    this.createBluePrintFromData = function(tableData, onlyCheckFirstRow) {
        var bluePrint = {
            fields: {},
            rowsPerPage: 10
        };
        for (var i in tableData) {
            var row = tableData[i];
            for (var fieldName in row) {
                if (!bluePrint.fields[fieldName]) {
                    var fieldBP = {};
                    fieldBP.fieldKey = fieldName;
                    fieldBP.fieldLabel = sic.capitalize(fieldName);
                    fieldBP.fieldType = _p.getValueType(row[fieldName]);
                    fieldBP.initValue = _p.getInitValueForType(fieldBP.fieldType);
                    bluePrint.fields[fieldName] = fieldBP;
                }
            }
            if (onlyCheckFirstRow) break;
        }
        return bluePrint;
    };

    this.setValue = function(tableData) {
        for (var i in tableData){
            if (_p.rows[i]) {
                _p.rows[i].setValue(tableData[i]);
            }
        }
    };

    this.getValue = function(){
    };

    this.initAndPopulate = function(tableData){
        _p.bluePrint = _p.createBluePrintFromData(tableData);
        _p.createTable();
        _p.setValue(tableData);
    };
};


sic.widget.sicDataTableRow = function(tableSectionWnd, args){

    // Init
    var _p = this;
    this._cons = sic.widget.sicElement;
    this._cons({parent:tableSectionWnd, tagName:"tr"});
    this.selector.addClass("sicDataTableRow");

    this._ebase = sic.object.sicEventBase;
    this._ebase();

    this.fields = {};

    // Settings
    this.headerRow = sic.getArg(args, "headerRow", false);
    //this.gradColor = sic.getArg(args, "gradColor", "silver");
    //this.hoverColor = sic.getArg(args, "hoverColor", "gray");
    this.dataTable = sic.getArg(args, "dataTable", null);
    //this.primaryKey = Cap.Util.getArg(args, "primaryKey", null);

    if (!this.headerRow) this.displayNone();

    this.addField = function(colName, colValue) {
        _p.fields[colName] = new sic.widget.sicDataTableField(_p.selector, {dataTable:_p.dataTable, row:_p,
            fieldKey:colName, fieldValue:colValue});
    };

    this.show = function(){
        _p.display();
    };

    this.setValue = function(rowData){

        _p.show();

        for (var fieldName in rowData) {
            if (_p.fields[fieldName]) _p.fields[fieldName].setValue(rowData[fieldName]);
        }
    };

    this.getValue = function(){
        var result = {};
        for (var i in _p.fields)
            result[_p.fields[i].fieldKey] = _p.fields[i].fieldValue;
        return result;
    };

    this.getEventArgs = function(){
        return sic.mergeObjects(_p.dataTable.getEventArgs(), { row: _p });
    };

    // Bind Events
    this.selector.click(function(e){
        if (_p.headerRow) _p.dataTable.trigger("headerRowClick", _p.getEventArgs());
        if (!_p.headerRow) _p.dataTable.trigger("dataRowClick", _p.getEventArgs());
        _p.dataTable.trigger("rowClick", _p.getEventArgs());
        e.preventDefault();
    });
    this.selector.dblclick(function(e){
        if (_p.headerRow) _p.dataTable.trigger("headerRowDoubleClick", _p.getEventArgs());
        if (!_p.headerRow) _p.dataTable.trigger("dataRowDoubleClick", _p.getEventArgs());
        _p.dataTable.trigger("rowDoubleClick", _p.getEventArgs());
        window.getSelection().removeAllRanges();
        e.preventDefault();
    });
    this.selector.bind("contextmenu", function(e){
        if (_p.headerRow) _p.dataTable.trigger("headerRowRightClick", _p.getEventArgs());
        if (!_p.headerRow) _p.dataTable.trigger("dataRowRightClick", _p.getEventArgs());
        _p.dataTable.trigger("rowRightClick", _p.getEventArgs());
        if (_p.dataTable.preventContextMenu) { e.preventDefault(); return false; }
    });
};

sic.widget.sicDataTableField = function(tableRowWnd, args) {

    // Init
    var _p = this;
    this._cons = sic.widget.sicElement;
    this._cons({parent:tableRowWnd, tagName:"td" });

    this.fieldKey = sic.getArg(args, "fieldKey", null);
    this.fieldValue = sic.getArg(args, "fieldValue", null);
    this.row = sic.getArg(args, "row", null);
    this.dataTable = sic.getArg(args, "dataTable", this.row ? this.row.dataTable : null);
    this.headerField = sic.getArg(args, "headerField", this.row ? this.row.headerRow : false);
    this.clearValue = sic.getArg(args, "clearValue", "");

    this.valueDiv = new sic.widget.sicElement({parent:this.selector});

    this.setValue = function(fieldValue){
        _p.fieldValue = fieldValue;
        this.valueDiv.selector.html(_p.fieldValue);
    };

    this.getValue = function(){
        return _p.fieldValue;
    };

    this.getEventArgs = function(){
        return sic.mergeObjects(_p.row.getEventArgs(), { field: _p });
    };

    // Bind events
    this.selector.click(function(e){
        if (_p.headerField) _p.dataTable.trigger("headerFieldClick", _p.getEventArgs());
        if (!_p.headerField) _p.dataTable.trigger("dataFieldClick", _p.getEventArgs());
        _p.dataTable.trigger("fieldClick", _p.getEventArgs());
        e.preventDefault();
    });
    this.selector.dblclick(function(e){
        if (_p.headerField) _p.dataTable.trigger("headerFieldDoubleClick", _p.getEventArgs());
        if (!_p.headerField) _p.dataTable.trigger("dataFieldDoubleClick", _p.getEventArgs());
        _p.dataTable.trigger("fieldDoubleClick", _p.getEventArgs());
        e.preventDefault();
    });
    this.selector.bind("contextmenu", function(e){
        if (_p.headerField) _p.dataTable.trigger("headerFieldRightClick", _p.getEventArgs());
        if (!_p.headerField) _p.dataTable.trigger("dataFieldRightClick", _p.getEventArgs());
        _p.dataTable.trigger("fieldRightClick", _p.getEventArgs());
        if (_p.dataTable.preventContextMenu) { e.preventDefault(); return false; }
    });

    // Set initial value
    this.setValue(this.fieldValue);

};


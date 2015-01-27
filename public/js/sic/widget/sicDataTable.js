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
        _p.fields[colName] = new sic.widget.sicDataTableField(_p.selector, {fieldKey:colName, fieldValue:colValue});
    };

    this.show = function(){
        _p.display();
    };

    this.setValue = function(rowData){

        //if (typeof(_p.rowDataParser) == "function") rowData = _p.rowDataParser(rowData);
        //_p.oldValue = _p.refValue;
        //_p.refValue = rowData;

        _p.show();

        for (var fieldName in rowData) {
            if (_p.fields[fieldName]) _p.fields[fieldName].setValue(rowData[fieldName]);
        }

        //for (var fieldName in _p.fields) {
        //    var sourceFieldName = _p.fields[fieldName].source;
        //    var fieldValue = (rowData && rowData[sourceFieldName]) ? rowData[sourceFieldName] : "";
        //    _p.fields[fieldName].setValue(fieldValue);
        //}

        //if (typeof(_p.dataTable.rowFormatter) == "function"){
        //    _p.dataTable.rowFormatter(_p.getEventArgs());
        //}

    };

    this.getValue = function(){
    };
};

sic.widget.sicDataTableField = function(tableRowWnd, args) {

    // Init
    var _p = this;
    this._cons = sic.widget.sicElement;
    this._cons({parent:tableRowWnd, tagName:"td" });

    this.fieldKey = sic.getArg(args, "fieldKey", null);
    this.fieldValue = sic.getArg(args, "fieldValue", null);
    this.row = sic.getArg(args, "row", null);
    this.dataTable = sic.getArg(args, "dataTable", null);
    this.clearValue = sic.getArg(args, "clearValue", "");

    this.valueDiv = new sic.widget.sicElement({parent:this.selector});

    this.setValue = function(fieldValue){
        _p.fieldValue = fieldValue;
        this.valueDiv.selector.html(_p.fieldValue);
    };

    this.getValue = function(){
    };

    this.setValue(this.fieldValue);

};


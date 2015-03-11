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
    this.primaryKey = sic.getArg(args, "primaryKey", null);
    this.fields = sic.getArg(args, "fields", {});
    this.entityTitle = sic.getArg(args, "entityTitle", null);
    this.dataSource = sic.getArg(args, "dataSource", null);
    this.editorModuleArgs = sic.getArg(args, "editorModuleArgs", null);

    this.rowsPerPage = sic.getArg(args, "rowsPerPage", sic.defaults.dataTableRowsPerPage); // Ignored if dataSource is given

    this.canInsert = sic.getArg(args, "canInsert", true);
    this.canDelete = sic.getArg(args, "canDelete", true);

    // Settings - Appearance
    this.cssClass_holderDiv = sic.getArg(args, "cssClass_holderDiv", "sicDataTable");
    this.cssClass_table = sic.getArg(args, "cssClass_table", "sicDataTable_table");

    // Events
    this.onDataFeed = function(f) { _p.subscribe("dataFeed", f); };

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
    this.constructed = false;
    this.currentPage = 1;
    this.currentPageCount = 1;

    if (_p.dataSource) {
        _p.dataSource.dataTable = _p;
        _p.rowsPerPage = _p.dataSource.pageCount;
    }

    // Table
    this.createTable = function() {

        if (!_p.infoDiv){
            _p.infoDiv = new sic.widget.sicElement({parent:_p.selector, tagClass:"infoDiv"});
            _p.infoDiv.selector.css("display", "none");
        }

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
        if (_p.canInsert)
            _p.createInsertButton();
        if (_p.dataSource)
            _p.createDSControlDiv();
    };

    // Header
    this.createHeaderRow = function() {
        if (_p.headerRow) _p.headerRow.selector.remove();
        _p.headerRow = new sic.widget.sicDataTableRow(_p.tHead.selector, {
            headerRow: true,
            dataTable: _p
        });

        if (!_p.bluePrint || _p.bluePrint.noData) {

        } else {
            for (var fieldKey in _p.bluePrint.fields) {
                var fieldBP = _p.bluePrint.fields[fieldKey];
                _p.headerRow.addField(fieldBP.fieldKey, fieldBP.fieldLabel, fieldBP);
            }
        }
    };

    this.createRows = function() {
        if (_p.rows && _p.rows.length) {
            for (var i in _p.rows) _p.rows[i].selector.remove();
        }

        _p.rows = [];

        if (!_p.bluePrint) return;

        //for (var rowIdx = -1; rowIdx < this.pageSize; rowIdx++){
        for (var rowIdx = 0; rowIdx < _p.rowsPerPage; rowIdx++){

            var row = new sic.widget.sicDataTableRow(_p.tBody.selector, {
                dataTable: _p,
                rowIdx: rowIdx
            });

            if (!_p.bluePrint) {
                row.addField("init", "");
            } else {
                for (var fieldKey in _p.bluePrint.fields) {
                    var fieldBP = _p.bluePrint.fields[fieldKey];
                    row.addField(fieldBP.fieldKey, fieldBP.initValue, fieldBP);
                }
            }

            _p.rows.push(row);
        }
    };

    this.createInsertButton = function() {
        if (_p.insertButton) return;
        _p.insertButton = new sic.widget.sicElement({parent:_p.selector, tagClass:"insertButton"});
        _p.insertButton.img = new sic.widget.sicElement({parent:_p.insertButton.selector, tagName:"img"});
        _p.insertButton.img.selector.addClass("icon16");
        _p.insertButton.img.selector.attr("src", "/img/insert.png");
        _p.insertButton.span = new sic.widget.sicElement({parent:_p.insertButton.selector, tagName:"span"});
        _p.insertButton.span.selector.html("Insert");
        _p.insertButton.selector.click(function(e){
            var row = _p.createEmptyRow();
            var tabName = sic.mergePlaceholders(_p.entityTitle, row);
            var editorModuleArgs = sic.mergeObjects(_p.editorModuleArgs, {newTab:tabName, entityTitle:_p.entityTitle});
            editorModuleArgs.onClosed = function(args){ _p.refresh(); };
            if (_p.dataSource && _p.dataSource.staticData)
                editorModuleArgs.staticData = sic.mergeObjects(_p.dataSource.staticData, editorModuleArgs.staticData);
            sic.loadModule(editorModuleArgs);
        });
    };

    this.createDSControlDiv = function() {
        if (_p.dsControl) return;
        _p.dsControl = new sic.widget.sicElement({parent:_p.selector, insertAtTop:true, tagClass:"dsControl"});

        _p.dsControl.prevPage = new sic.widget.sicElement({parent:_p.dsControl.selector, tagClass:"inline prevButton vmid"});
        _p.dsControl.prevPageImg = new sic.widget.sicElement({parent:_p.dsControl.prevPage.selector, tagName:"img", tagClass:"icon8 vmid"});
        _p.dsControl.prevPageImg.selector.attr("src", "/img/icon/dataTable_prev.png");
        _p.dsControl.prevPageSpan = new sic.widget.sicElement({parent:_p.dsControl.prevPage.selector, tagName:"span", tagClass:"vmid"});
        _p.dsControl.prevPageSpan.selector.html("Prev");
        _p.dsControl.prevPage.selector.click(function(){ _p.switchPage(_p.currentPage-1); });

        _p.dsControl.pageInput = new sic.widget.sicElement({parent:_p.dsControl.selector,
            tagName:"input", tagClass:"inline vmid dataTable_pageInput"});
        _p.dsControl.pageInput.selector.keypress(function(e){
            if (e.which == 13)
                _p.switchPage(_p.dsControl.pageInput.selector.val());
        });
        _p.dsControl.pageInput.selector.val(1);

        _p.dsControl.slashSpan = new sic.widget.sicElement({parent:_p.dsControl.selector, tagClass:"inline vmid"});
        _p.dsControl.slashSpan.selector.html('/');

        _p.dsControl.pageCount = new sic.widget.sicElement({parent:_p.dsControl.selector,
            tagName:"input", tagClass:"inline vmid dataTable_pageCount"});
        _p.dsControl.pageCount.selector.attr("readOnly", true);
        _p.dsControl.pageCount.selector.val(1);

        _p.dsControl.nextPage = new sic.widget.sicElement({parent:_p.dsControl.selector, tagClass:"inline nextButton vmid"});
        _p.dsControl.nextPageSpan = new sic.widget.sicElement({parent:_p.dsControl.nextPage.selector, tagName:"span", tagClass:"vmid"});
        _p.dsControl.nextPageSpan.selector.html("Next");
        _p.dsControl.nextPageImg = new sic.widget.sicElement({parent:_p.dsControl.nextPage.selector, tagName:"img", tagClass:"icon8 vmid"});
        _p.dsControl.nextPageImg.selector.attr("src", "/img/icon/dataTable_next.png");
        _p.dsControl.nextPage.selector.click(function(){ _p.switchPage(_p.currentPage+1); });
    };

    this.switchPage = function(pageIdx) {
        if (isNaN(pageIdx*1)) return;
        _p.currentPage = pageIdx;
        if (_p.currentPage > _p.currentPageCount) _p.currentPage = _p.currentPageCount;
        if (_p.currentPage < 1) _p.currentPage = 1;
        _p.dsControl.pageInput.selector.val(_p.currentPage);
        if (_p.dataSource) {
            _p.dataSource.pageStart = (_p.currentPage -1) * _p.dataSource.pageCount;
            _p.refresh();
        }
    };

    this.getEventArgs = function(){
        return { dataTable: _p };
    };


    this.getValueType = function(val) {
        if (jQuery.isNumeric(val)) {
            return 'int';
        }
        return 'str';
    };

    this.getInitValueForType = function(valType) {
        switch (valType) {
            case 'int': return 0;
            case 'delete': return '<img src="/img/delete.png" class="icon16" />';
            default: return '';
        }
    };

    this.createBluePrintFromData = function(tableData, onlyCheckFirstRow) {
        var bluePrint = {
            fields: {}
        };

        bluePrint.modified = !_p.bluePrint || !_p._lastTableData || _p._lastTableData.length != tableData.length;
        bluePrint.noData = !tableData || !Object.keys(tableData).length;
        _p._lastTableData = tableData;

        for (var i in tableData) {
            var row = tableData[i];
            for (var fieldName in row) {
                if (!bluePrint.fields[fieldName]) {
                    var fieldBP = sic.mergeObjects({}, _p.fields[fieldName]);
                    fieldBP.fieldKey = fieldName;
                    fieldBP.fieldLabel = sic.captionize(fieldName);
                    fieldBP.fieldType = _p.getValueType(row[fieldName]);
                    fieldBP.initValue = _p.getInitValueForType(fieldBP.fieldType);
                    bluePrint.fields[fieldName] = fieldBP;
                }
            }
            if (onlyCheckFirstRow) break;
        }

        // Delete Button
        if (_p.canDelete) {
            var fieldName = '_delete';
            var fieldBP = sic.mergeObjects({}, _p.fields[fieldName]);
            fieldBP.fieldKey = fieldName;
            fieldBP.fieldLabel = 'Delete';
            fieldBP.fieldType = 'delete';
            fieldBP.canSort = false;
            fieldBP.initValue = _p.getInitValueForType(fieldBP.fieldType);
            bluePrint.fields[fieldName] = fieldBP;
        }

        return bluePrint;
    };

    this.createEmptyRow = function(){
        var result = {};
        if (_p.bluePrint) {
            for (var i in _p.bluePrint.fields) {
                var fieldBP = _p.bluePrint.fields[i];
                result[fieldBP.fieldKey] = _p.getInitValueForType(fieldBP.fieldType);
            }
        }
        return result;
    };

    this.setValue = function(tableData) {
        if (!tableData) return;
        for (var i = 0; i < _p.rows.length; i++){
            if (_p.rows[i] && tableData[i]) {
                _p.rows[i].setValue(tableData[i]);
            } else {
                _p.rows[i].hide();
            }
        }
    };

    this.getValue = function(){
    };

    this.info = function(infoText) {
        _p.infoDiv.selector.html(infoText);
        _p.infoDiv.selector.fadeIn(sic.defaults.fadeTime);
    }

    this.reconstruct = function(args){

        _p.bluePrint = _p.createBluePrintFromData(args.data);
        if (_p.bluePrint.modified || !_p.constructed) {
            _p.createTable();
            _p.constructed = true;
        }

        if (_p.bluePrint.noData) {
            _p.info('No data for this table.');
        }
    };

    this.setPaginator = function(rowCount) {
        if (!rowCount) return;
        if (!_p.dsControl) return;

        _p.rowCount = rowCount;
        _p.currentPageCount = Math.floor((rowCount -1) /_p.rowsPerPage) +1;

        if (_p.currentPage > _p.currentPageCount) _p.currentPage = _p.currentPageCount;

        _p.dsControl.pageInput.selector.val(_p.currentPage);
        _p.dsControl.pageCount.selector.val(_p.currentPageCount);
    };

    this.feedData = function(args) {

        _p.trigger('dataFeed', args);

        _p.reconstruct(args);
        _p.setValue(args.data);
        _p.setPaginator(args.rowCount);

        //alert('FeedData '+args);
        /*
        if (!args) return;
        if (!_p.initialized) {
            _p.initAndPopulate(args);
        } else {
            _p.setValue(args.data);
            _p.setPaginator(args.rowCount);
        }
        */
    };

    this.initAndPopulate = function(tableData){
        if (tableData) {
            _p.feedData(tableData);
        }
        else {
            if (!_p.dataSource) return;
            _p.dataSource.callbacks.feedData = _p.feedData;
            _p.dataSource.select();
        }
        /*
        alert('InitAndPopulate '+tableData);
        if (!tableData) {
            if (!_p.dataSource) return;
            _p.dataSource.aSync = true;
            _p.dataSource.callbacks.feedData = _p.feedData;
            _p.dataSource.select();
            return;
        } else {
            setTimeout(function(){_p.feedData(tableData)}, 100);
        }

        if (!_p.initialized) {
            _p.init();
            _p.bluePrint = _p.createBluePrintFromData(tableData);
            _p.createTable();
            _p.initialized = true;
        }
        */
    };

    this.refresh = function() {
        if (!_p.dataSource) return;
        _p.infoDiv.selector.css("display", "none");
        _p.dataSource.select();

        /*
        var selectResponse = _p.dataSource.select();
        if (selectResponse) {
            _p.setValue(selectResponse.data);
            _p.setPaginator(selectResponse.rowCount);
        }
        */
    };


    // if EditorModule given, bind edit events
    if (_p.editorModuleArgs) {
        _p.onRowDoubleClick(function (args) {
            var row = args.row.getValue();
            var tabName = args.row.reprValue();
            var editorModuleArgs = sic.mergeObjects(_p.editorModuleArgs, {
                newTab: tabName,
                entityTitle: _p.entityTitle,
                row: row
            });
            editorModuleArgs.onClosed = function (args) {
                _p.refresh();
            };
            if (_p.dataSource && _p.dataSource.staticData)
                editorModuleArgs.staticData = sic.mergeObjects(_p.dataSource.staticData, editorModuleArgs.staticData);
            if (_p.primaryKey)
                for (var pkIdx in _p.primaryKey)
                    editorModuleArgs[_p.primaryKey[pkIdx]] = row[_p.primaryKey[pkIdx]];
            sic.loadModule(editorModuleArgs);
        });
    }

    // if canDelete, bind delete click event
    if (_p.canDelete) {
        _p.onFieldClick(function(args){
            if (args.field.fieldKey == "_delete") {
                if (confirm('Are you sure you want to delete record "'+args.row.reprValue()+'"?')) {
                    var response = _p.dataSource.delete(args.row.getValue());
                    if (response) _p.setValue(response.data);
                }
            }
        });
    }

    // Sort
    _p.onHeaderFieldClick(function(args){

        if (!_p.dataSource) return;
        if (!args.field.canSort) return;

        if (_p.dataSource.sortField == args.field.fieldKey) {
            // Change order
            _p.dataSource.sortOrder = (_p.dataSource.sortOrder == "asc") ? "desc" : "asc"
        } else {
            // Change sort field
            _p.dataSource.sortField = args.field.fieldKey;
            _p.dataSource.sortOrder = "asc";
        }
        args.field.setSort(_p.dataSource.sortOrder);
        _p.refresh();
    });


    if (this.dataSource) {
        _p.dataSource.callbacks.feedData = _p.feedData;
        _p.initAndPopulate();
    }
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

    this.addField = function(colName, colValue, args) {
        _p.fields[colName] = new sic.widget.sicDataTableField(_p.selector, sic.mergeObjects({dataTable:_p.dataTable, row:_p,
            fieldKey:colName, fieldValue:colValue}, args));
    };

    this.show = function(){
        _p.display();
    };

    this.hide = function(){
        _p.displayNone();
    };

    this.setValue = function(rowData){

        _p.show();

        for (var fieldName in rowData) {
            if (_p.fields[fieldName]) _p.fields[fieldName].setValue(rowData[fieldName]);
        }
    };

    this.getValue = function(){
        var result = {};
        for (var i in _p.fields) {
            if (_p.fields[i].fieldKey[0] == '_') continue;
            result[_p.fields[i].fieldKey] = _p.fields[i].fieldValue;
        }
        return result;
    };

    this.reprValue = function(){
        var reprValue = "";
        var row = _p.getValue();
        if (_p.dataTable.entityTitle) {
            reprValue = sic.mergePlaceholders(_p.dataTable.entityTitle, row);
        } else if (_p.dataTable.primaryKey) {
            for (var i in _p.dataTable.primaryKey){
                if (reprValue) reprValue += ', ';
                reprValue += row[_p.dataTable.primaryKey[i]];
            }
        }
        return reprValue;
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
    this.canSort = sic.getArg(args, "canSort", true);
    this.row = sic.getArg(args, "row", null);
    this.dataTable = sic.getArg(args, "dataTable", this.row ? this.row.dataTable : null);
    this.headerField = sic.getArg(args, "headerField", this.row ? this.row.headerRow : false);
    this.clearValue = sic.getArg(args, "clearValue", "");
    this.visible = sic.getArg(args, "visible", true);

    this.cellDataTable = sic.getArg(args, "cellDataTable", null);
    this.formView = sic.getArg(args, "formView", null);

    this.valueDiv = new sic.widget.sicElement({parent:this.selector, tagClass:"inline"});

    if (_p.headerField) {
        this.sortImg = new sic.widget.sicElement({parent:this.selector, tagName:"img", tagClass:"dataTableSortIcon icon8"});
        this.sortImg.selector.css("display", "none");

        if (_p.canSort)
            this.selector.addClass("clickable");
    }

    this.setSort = function(sortOrder){
        var sortFieldKey = _p.fieldKey
        var field = _p.dataTable.headerRow.fields[sortFieldKey];
        sortOrder = (sortOrder == "asc") ? "asc" : "desc";

        for (var i in field.row.fields) field.row.fields[i].sortImg.selector.css("display", "none");
        field.sortImg.selector.attr("src", "/img/icon/dataTable_"+sortOrder+".png");
        field.sortImg.selector.css("display", "inline-table");
    };

    this.setValue = function(fieldValue){
        _p.fieldValue = fieldValue;
        if (!_p.headerField && _p.cellDataTable) {
            _p.valueDiv.selector.empty();
            _p.cellDataTableInstance = new sic.widget.sicDataTable({
                parent: _p.valueDiv.selector,
                canInsert: false,
                canDelete: false
            });
            _p.cellDataTable.initAndPopulate(_p.fieldValue);

        } else if (!_p.headerField && _p.formView) {
            _p.valueDiv.selector.empty();
            _p.formViewInstance = new sic.widget.sicForm(
                sic.mergeObjects({parent:_p.valueDiv.selector, captionWidth:"100px"}, _p.formView));
            for (var fKey in _p.fieldValue) {
                var fVal = _p.fieldValue[fKey];
                _p.formViewInstance.addInput({name:fKey, type:"flat", placeholder:fKey+"...", value:fVal, readOnly:true});
            }
        } else {
            _p.valueDiv.selector.html(_p.fieldValue);
        }
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

    if (!this.visible) this.displayNone();
};


sic.widget.sicDataTableDataSource = function(args) {
    // Init
    var _p = this;
    this._cons = sic.object.sicEventBase;
    this._cons();

    this.moduleName = sic.getArg(args, "moduleName", null);
    this.methodNames = sic.getArg(args, "methodNames", { select:'dataTableSelect', delete:'dataTableDelete' });
    this.sortField = sic.getArg(args, "sortField", null);
    this.sortOrder = sic.getArg(args, "sortOrder", "asc");
    this.pageStart = sic.getArg(args, "pageStart", 0);
    this.pageCount = sic.getArg(args, "pageCount", sic.defaults.dataTableRowsPerPage);
    this.editModule = sic.getArg(args, "editModule", null);
    this.staticData = sic.getArg(args, "staticData", {});

    this.callbacks = {};
    this.callbacks.feedData = function(args) { };
    this.aSync = true;

    this.getPaginationData = function(){
        return { sortField:_p.sortField, sortOrder:_p.sortOrder, pageStart:_p.pageStart, pageCount:_p.pageCount };
    };

    this.getMethodCallData = function(methodName, args) {
        var methodCallData = {
            moduleName:_p.moduleName,
            methodName:methodName,
            aSync:_p.aSync,
            data:args
        };

        if (_p.staticData) methodCallData.staticData = _p.staticData;

        methodCallData = sic.mergeObjects(methodCallData, _p.getPaginationData());

        return methodCallData;
    }

    this.select = function(args) {
        return sic.callMethod(_p.getMethodCallData(_p.methodNames.select, args), _p.callbacks.feedData);
    }

    this.delete = function(args) {
        return sic.callMethod(_p.getMethodCallData(_p.methodNames.delete, args), _p.callbacks.feedData);
    }
}
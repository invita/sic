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
    this.actions = sic.getArg(args, "actions", {});
    this.filter = sic.getArg(args, "filter", null);
    this.entityTitle = sic.getArg(args, "entityTitle", null);
    this.dataSource = sic.getArg(args, "dataSource", null);
    this.editorModuleArgs = sic.getArg(args, "editorModuleArgs", null);
    this.hoverRows = sic.getArg(args, "hoverRows", true);
    this.hoverCells = sic.getArg(args, "hoverCells", !this.hoverRows);
    this.tabPage = sic.getArg(args, "tabPage", null);
    this.editable = sic.getArg(args, "editable", false);
    this.selectCallback = sic.getArg(args, "selectCallback", null);
    this.customInsert = sic.getArg(args, "customInsert", null);
    this.subDataTable = sic.getArg(args, "subDataTable", null);
    this.canExpand = sic.getArg(args, "canExpand", this.subDataTable ? true : false);
    this.initExpandAll = sic.getArg(args, "initExpandAll", false);
    this.hideNoData = sic.getArg(args, "hideNoData", false);
    this.showPaginator = sic.getArg(args, "showPaginator", true);
    this.initRefresh = sic.getArg(args, "initRefresh", true);
    this.canExportXls = sic.getArg(args, "canExportXls", true);
    this.canExportCsv = sic.getArg(args, "canExportCsv", true);
    this.filterHint = sic.getArg(args, "filterHint", true);

    this.rowsPerPage = sic.getArg(args, "rowsPerPage", sic.defaults.dataTableRowsPerPage); // Ignored if dataSource is given

    this.canInsert = sic.getArg(args, "canInsert", true);
    this.canDelete = sic.getArg(args, "canDelete", true);

    // Settings - Appearance
    this.cssClass_holderDiv = sic.getArg(args, "cssClass_holderDiv", "sicDataTable");
    this.cssClass_table = sic.getArg(args, "cssClass_table", "sicDataTable_table");

    // Events
    this.onDataFeed = function(f) { _p.subscribe("dataFeed", f); };
    this.onDataFeedComplete = function(f) { _p.subscribe("dataFeedComplete", f); };
    this.onFirstFeedComplete = function(f) { _p.subscribe("firstFeedComplete", f); };
    this.onRowSetValue = function(f) { _p.subscribe("rowSetValue", f); };

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
    this.firstFeed = true;

    this.filter = sic.mergeObjects({enabled:true, visible:false, autoApply: true}, this.filter);

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
        if (_p.filter.enabled) _p.createFilterRow();
        _p.createRows();
        if (_p.canInsert)
            _p.createInsertButton();
        if (_p.dataSource) {
            _p.createDSControlDiv("dsControl");
            _p.createDSControlDiv("dsControlBottom");
        }
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

    this.createFilterRow = function() {
        if (_p.filterRow) _p.filterRow.selector.remove();
        _p.filterRow = new sic.widget.sicDataTableRow(_p.tHead.selector, {
            filterRow: true,
            dataTable: _p
        });

        if (_p.bluePrint) {
            for (var fieldKey in _p.bluePrint.fields) {
                var fieldBP = _p.bluePrint.fields[fieldKey];
                _p.filterRow.addField(fieldBP.fieldKey, fieldBP.fieldLabel, fieldBP);
            }
        }

        if (_p.filter.value) _p.filterRow.setFilterValue(_p.filter.value);
    };

    this.createRows = function() {
        if (_p.rows && _p.rows.length) {
            for (var i in _p.rows) {
                if (_p.rows[i].subRowTr) _p.rows[i].subRowTr.selector.remove();
                _p.rows[i].selector.remove();
            }
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

            if (_p.subDataTable) {
                row.createSubRow();
            }

            _p.rows.push(row);
        }
    };

    this.createInsertButton = function() {
        if (_p.insertButton) return;
        _p.insertBar = new sic.widget.sicElement({ parent:_p.selector });
        _p.insertButton = new sic.widget.sicElement({parent:_p.insertBar.selector, tagClass:"insertButton", tagName:"button"});
        _p.insertButton.selector.attr("tabindex", 0);
        _p.insertButton.img = new sic.widget.sicElement({parent:_p.insertButton.selector, tagName:"img"});
        _p.insertButton.img.selector.addClass("icon16");
        _p.insertButton.img.selector.attr("src", "/img/insert.png");
        _p.insertButton.span = new sic.widget.sicElement({parent:_p.insertButton.selector, tagName:"span"});
        _p.insertButton.span.selector.html("Insert");
        if (typeof(_p.customInsert) == "function") {
            _p.insertButton.selector.click(function(e) { _p.customInsert(_p) });
        } else {
            _p.insertButton.selector.click(function(e){
                var row = _p.createEmptyRow();
                var tabName = sic.mergePlaceholders(_p.entityTitle, row);
                var editorModuleArgs = sic.mergeObjects(_p.editorModuleArgs, {newTab:tabName, entityTitle:_p.entityTitle});
                editorModuleArgs.onClosed = function(args){ _p.refresh(); };
                if (_p.dataSource && _p.dataSource.staticData)
                    editorModuleArgs.staticData = sic.mergeObjects(_p.dataSource.staticData, editorModuleArgs.staticData);
                sic.loadModule(editorModuleArgs);
            });
        }
    };

    // Paginator
    this.createDSControlDiv = function(cpName) {
        if (!cpName) cpName = "dsControl";
        if (_p[cpName]) return;
        _p[cpName] = new sic.widget.sicElement({parent:_p.selector, insertAtTop:cpName == "dsControl", tagClass:"dsControl"});

        if (!_p.showPaginator)
            _p[cpName].displayNone();

        // First page button
        _p[cpName].firstPage = new sic.widget.sicElement({parent:_p[cpName].selector, tagClass:"inline prevButton vmid"});
        _p[cpName].firstPageImg = new sic.widget.sicElement({parent:_p[cpName].firstPage.selector, tagName:"img", tagClass:"icon8 vmid"});
        _p[cpName].firstPageImg.selector.attr("src", "/img/icon/dataTable_prev.png");
        _p[cpName].firstPageSpan = new sic.widget.sicElement({parent:_p[cpName].firstPage.selector, tagName:"span", tagClass:"vmid"});
        _p[cpName].firstPageSpan.selector.html("First");
        _p[cpName].firstPage.selector.click(function(){ _p.switchPage(1); });

        // Prev page button
        _p[cpName].prevPage = new sic.widget.sicElement({parent:_p[cpName].selector, tagClass:"inline prevButton vmid"});
        _p[cpName].prevPageImg = new sic.widget.sicElement({parent:_p[cpName].prevPage.selector, tagName:"img", tagClass:"icon8 vmid"});
        _p[cpName].prevPageImg.selector.attr("src", "/img/icon/dataTable_prev.png");
        _p[cpName].prevPageSpan = new sic.widget.sicElement({parent:_p[cpName].prevPage.selector, tagName:"span", tagClass:"vmid"});
        _p[cpName].prevPageSpan.selector.html("Prev");
        _p[cpName].prevPage.selector.click(function(){ _p.switchPage(_p.currentPage-1); });

        // Page inputs
        _p[cpName].pageInput = new sic.widget.sicElement({parent:_p[cpName].selector,
            tagName:"input", tagClass:"inline vmid dataTable_pageInput"});
        _p[cpName].pageInput.selector.keypress(function(e){
            if (e.which == 13)
                _p.switchPage(_p[cpName].pageInput.selector.val());
        });
        _p[cpName].pageInput.selector.val(1);

        _p[cpName].slashSpan = new sic.widget.sicElement({parent:_p[cpName].selector, tagClass:"inline vmid"});
        _p[cpName].slashSpan.selector.html('/');

        _p[cpName].pageCount = new sic.widget.sicElement({parent:_p[cpName].selector,
            tagName:"input", tagClass:"inline vmid dataTable_pageCount"});
        _p[cpName].pageCount.selector.attr("readOnly", true);
        _p[cpName].pageCount.selector.val(1);

        // Next page button
        _p[cpName].nextPage = new sic.widget.sicElement({parent:_p[cpName].selector, tagClass:"inline nextButton vmid"});
        _p[cpName].nextPageSpan = new sic.widget.sicElement({parent:_p[cpName].nextPage.selector, tagName:"span", tagClass:"vmid"});
        _p[cpName].nextPageSpan.selector.html("Next");
        _p[cpName].nextPageImg = new sic.widget.sicElement({parent:_p[cpName].nextPage.selector, tagName:"img", tagClass:"icon8 vmid"});
        _p[cpName].nextPageImg.selector.attr("src", "/img/icon/dataTable_next.png");
        _p[cpName].nextPage.selector.click(function(){ _p.switchPage(_p.currentPage+1); });

        // Last page button
        _p[cpName].lastPage = new sic.widget.sicElement({parent:_p[cpName].selector, tagClass:"inline lastButton vmid"});
        _p[cpName].lastPageSpan = new sic.widget.sicElement({parent:_p[cpName].lastPage.selector, tagName:"span", tagClass:"vmid"});
        _p[cpName].lastPageSpan.selector.html("Last");
        _p[cpName].lastPageImg = new sic.widget.sicElement({parent:_p[cpName].lastPage.selector, tagName:"img", tagClass:"icon8 vmid"});
        _p[cpName].lastPageImg.selector.attr("src", "/img/icon/dataTable_next.png");
        _p[cpName].lastPage.selector.click(function(){ _p.switchPage(_p.currentPageCount); });


        _p[cpName].recsPerPageInput = new sic.widget.sicElement({parent:_p[cpName].selector,
            tagName:"input", tagClass:"inline vmid dataTable_recsPerPageInput"});
        _p[cpName].recsPerPageInput.selector[0].dsControl = _p[cpName];
        _p[cpName].recsPerPageInput.selector.keypress(function(e){
            if (e.which == 13) {
                _p.setPaginatorRowsPerPage(this.dsControl.recsPerPageInput.selector.val());
            }
        });
        _p[cpName].recsPerPageInput.selector.val(_p.dataSource.pageCount);

        _p[cpName].recsPerPageText = new sic.widget.sicElement({parent:_p[cpName].selector, tagClass:"inline vmid"});
        _p[cpName].recsPerPageText.selector.html(' / page');


        // Export
        if (_p.canExportXls) {
            _p[cpName].exportXlsDiv = new sic.widget.sicElement({parent:_p[cpName].selector, tagClass:"inline exportButton vmid", hint:"Export Excel file (xlsx)"});
            _p[cpName].exportXlsImg = new sic.widget.sicElement({parent:_p[cpName].exportXlsDiv.selector, tagName:"img", tagClass:"icon16 vmid"});
            _p[cpName].exportXlsImg.selector.attr("src", "/img/icon/exportXls.png");
            _p[cpName].exportXlsDiv.selector.click(function(){
                if (!_p.dataSource) return;
                _p.dataSource.exportXls();
            });
        }
        if (_p.canExportCsv) {
            _p[cpName].exportCsvDiv = new sic.widget.sicElement({parent:_p[cpName].selector, tagClass:"inline exportButton vmid", hint:"Export Comma separated values file (csv)"});
            _p[cpName].exportCsvImg = new sic.widget.sicElement({parent:_p[cpName].exportCsvDiv.selector, tagName:"img", tagClass:"icon16 vmid"});
            _p[cpName].exportCsvImg.selector.attr("src", "/img/icon/exportCsv.png");
            _p[cpName].exportCsvDiv.selector.click(function(){
                if (!_p.dataSource) return;
                _p.dataSource.exportCsv();
            });
        }

        // Filter
        if (_p.filter.enabled) {
            _p[cpName].filterDiv = new sic.widget.sicElement({parent:_p[cpName].selector, tagClass:"inline filterButton vmid"});
            _p[cpName].filterImg = new sic.widget.sicElement({parent:_p[cpName].filterDiv.selector, tagName:"img", tagClass:"icon16 vmid"});
            _p[cpName].filterImg.selector.attr("src", "/img/icon/dataTable_filter.png");
            _p[cpName].filterSpan = new sic.widget.sicElement({parent:_p[cpName].filterDiv.selector, tagName:"span", tagClass:"vmid"});
            _p[cpName].filterSpan.selector.html("Filter");
            _p[cpName].filterDiv.selector.click(function(){ _p.toggleFilter(); });
            if (_p.filterHint !== false) {
                _p[cpName].filterDiv.setHint("<b>Filter options:</b><br/>"+
                "<br/>"+
                "<b>*</b> - Add a star to search for any characters, example: 'John*' will find 'John Smith' and 'Johnny Bravo'<br/>"+
                "<b>,</b> - List multiple values with comma, example: '1,2,3' will find values 1, 2 and 3<br/>"+
                "<b>..</b> - Search by range with two dots, example: '1..5' will find values 1, 2, 3, 4 and 5.<br/>"+
                "<br/>"+
                "Note: All filter values are automatically fitted with stars on both ends. When you search for 'John', you actually search for '*John*'<br/>"+
                "");
            }
        }
    };

    this.switchPage = function(pageIdx, noPageCountCheck, noRefresh) {
        if (isNaN(pageIdx*1)) return;
        _p.currentPage = pageIdx;
        if (_p.currentPage > _p.currentPageCount && !noPageCountCheck) _p.currentPage = _p.currentPageCount;
        if (_p.currentPage < 1) _p.currentPage = 1;
        _p.dsControl.pageInput.selector.val(_p.currentPage);
        _p.dsControlBottom.pageInput.selector.val(_p.currentPage);
        if (_p.dataSource) {
            _p.dataSource.pageStart = (_p.currentPage -1) * _p.dataSource.pageCount;
            if (!noRefresh) _p.refresh();
        }
    };

    this.goToFirstPage = function(noRefresh) {
        _p.switchPage(1, true, noRefresh);
    };

    this.goToLastPage = function(noRefresh) {
        var lastPage = _p.currentPageCount;
        //alert(_p.rowCount+" "+_p.dataSource.pageCount+" "+(_p.rowCount % _p.dataSource.pageCount == 0));
        if (_p.rowCount % _p.dataSource.pageCount == 0) lastPage++;
        _p.switchPage(lastPage, true, noRefresh);
    };

    this.toggleFilter = function(bool){
        _p.filter.visible = (bool === undefined) ? !_p.filter.visible : bool;

        if (_p.filter.visible) {
            _p.filterRow.display();
            _p.filterRow.recalculateInputs();
        } else {
            _p.filterRow.displayNone();
        }

        //sic.dump(_p.getValue(), 0);
    };

    this.setColumnVisible = function(colName, visible) {
        // Header row
        if (_p.headerRow.fields[colName])
            if (visible) _p.headerRow.fields[colName].display(); else _p.headerRow.fields[colName].displayNone();

        // Filter row
        if (_p.filterRow.fields[colName])
            if (visible) _p.filterRow.fields[colName].display(); else _p.filterRow.fields[colName].displayNone();

        // Data rows
        for (var i = 0; i < _p.rows.length; i++) {
            var field = _p.rows[i].fields[colName];
            if (!field) continue;
            if (visible) field.display(); else field.displayNone();
        }
    };

    this.expandAllRows = function() {
        if (!_p.canExpand) return;

        return;
        for (var i = 0; i < _p.rows.length; i++)
            if (_p.rows[i].lastRowData && !_p.rows[i].subRowTr.isDisplay())
                _p.rows[i].expandToggleSubRow();
    };

    this.recalculateInputs = function(){
        for (var i = 0; i < _p.rows.length; i++)
            _p.rows[i].recalculateInputs();
    };

    this.applyFilter = function() {
        if (_p.filterRow)
            _p.filter.value = _p.filterRow.getFilterValue();
        if (_p.dataSource) {
            _p.dataSource.filter = _p.filter.value;
        }
    };

    this.rowReprValue = function(row, entityTitle, primaryKey){
        if (!entityTitle) entityTitle = _p.entityTitle;
        if (!primaryKey) primaryKey = _p.primaryKey;
        var reprValue = "";
        //var row = _p.getValue();

        if (entityTitle) {
            reprValue = sic.mergePlaceholders(entityTitle, row);
        } else if (primaryKey) {
            reprValue = "Record ";
            for (var i in primaryKey){
                if (reprValue) reprValue += ', ';
                reprValue += row[primaryKey[i]];
            }
        }
        return reprValue;
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
            case 'expand': return '<img src="/img/expand.png" class="icon12" />';
            default: return '';
        }
    };

    this.createBluePrintFromData = function(tableData, onlyCheckFirstRow) {
        var bluePrint = {
            fields: {}
        };

        if (!tableData || !tableData.length) {
            if (_p._lastTableData)
                tableData = _p._lastTableData;
            else
                bluePrint.noData = true;
        }

        // Is bluePrint Modified
        bluePrint.modified = !_p.bluePrint || !_p._lastTableData || !_p._lastTableData.length;
        if (!bluePrint.modified && tableData && tableData[0] && _p._lastTableData && _p._lastTableData[0]) {
            for (var i in tableData[0]) {
                if (_p._lastTableData[0][i] === undefined) {
                    bluePrint.modified = true;
                    break;
                }
            }
            for (var i in _p._lastTableData[0]) {
                if (tableData[0][i] === undefined) {
                    bluePrint.modified = true;
                    break;
                }
            }
        }
        _p._lastTableData = tableData;

        // Expand subDataTable
        if (_p.subDataTable) {
            var exapndName = '_expand';
            var expandBP = sic.mergeObjects({}, _p.fields[exapndName]);
            expandBP.fieldKey = exapndName;
            expandBP.fieldLabel = 'Expand';
            expandBP.fieldType = 'expand';
            expandBP.canSort = false;
            expandBP.canFilter = false;
            expandBP.editable = false;
            expandBP.initValue = _p.getInitValueForType(expandBP.fieldType);
            bluePrint.fields[exapndName] = expandBP;
        }

        for (var i in tableData) {
            var row = tableData[i];
            for (var fieldName in row) {
                if (!bluePrint.fields[fieldName]) {
                    var fieldBP = sic.mergeObjects({}, _p.fields[fieldName]);
                    fieldBP.fieldKey = fieldName;
                    fieldBP.fieldLabel = fieldBP.caption ? fieldBP.caption : sic.captionize(fieldName);
                    fieldBP.fieldType = _p.getValueType(row[fieldName]);
                    fieldBP.initValue = _p.getInitValueForType(fieldBP.fieldType);
                    bluePrint.fields[fieldName] = fieldBP;
                }
            }
            if (onlyCheckFirstRow) break;
        }

        // Actions Field
        if (Object.keys(_p.actions).length) {
            var actionName = '_actions';
            var actionBP = sic.mergeObjects({}, _p.fields[actionName]);
            actionBP.fieldKey = actionName;
            actionBP.fieldLabel = 'Actions';
            actionBP.fieldType = 'actions';
            actionBP.canSort = false;
            actionBP.canFilter = false;
            actionBP.editable = false;
            actionBP.actions = _p.actions;
            bluePrint.fields[actionName] = actionBP;
        }

        // Delete Button
        if (_p.canDelete) {
            var fieldName = '_delete';
            var fieldBP = sic.mergeObjects({}, _p.fields[fieldName]);
            fieldBP.fieldKey = fieldName;
            fieldBP.fieldLabel = 'Delete';
            fieldBP.fieldType = 'delete';
            fieldBP.canSort = false;
            fieldBP.canFilter = false;
            fieldBP.editable = false;
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

    this.hideSubrows = function() {
        for (var i in _p.rows)
            if (_p.rows[i].subRowTr && _p.rows[i].subRowTr.isDisplay())
                _p.rows[i].subRowTr.displayNone();
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
        var result = [];
        for (var i in _p.rows) {
            if (_p.rows[i].active)
                result.push(_p.rows[i].getValue());
        }
        return result;
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

        _p.table.display();
        if (_p.bluePrint.noData) {
            if (_p.hideNoData) {
                _p.table.displayNone();
            } else {
                _p.info('No data for this table.');
            }
        }
    };

    this.setPaginator = function(rowCount) {
        if (!rowCount) return;
        if (!_p.dsControl) return;
        if (!_p.dsControlBottom) return;

        if (_p.dataSource && _p.dataSource.pageCount) _p.rowsPerPage = _p.dataSource.pageCount;

        _p.rowCount = rowCount;
        _p.currentPageCount = Math.floor((rowCount -1) /_p.rowsPerPage) +1;
        //sic.dump({ rowCount: _p.rowCount, rowsPerPage: _p.rowsPerPage, currentPageCount: _p.currentPageCount, currentPage: _p.currentPage });

        if (_p.currentPage > _p.currentPageCount) _p.currentPage = _p.currentPageCount;

        _p.dsControl.pageInput.selector.val(_p.currentPage);
        _p.dsControl.pageCount.selector.val(_p.currentPageCount);
        _p.dsControlBottom.pageInput.selector.val(_p.currentPage);
        _p.dsControlBottom.pageCount.selector.val(_p.currentPageCount);
    };

    this.setPaginatorRowsPerPage = function(newMaxRows) {
        if (newMaxRows > 300) {
            if (!confirm("Datatable will prepare to display "+newMaxRows+" rows. This will take a few seconds. Do you wish to continue?")) return;
        }

        _p.rowsPerPage = newMaxRows;
        _p.dataSource.pageCount = newMaxRows;
        _p.dataSource.pageStart = 0;
        _p.dsControl.recsPerPageInput.selector.val(newMaxRows);
        _p.dsControlBottom.recsPerPageInput.selector.val(newMaxRows);
        //_p.setPaginator(_p.rowCount);

        _p.createRows();
        _p.refresh();
    };

    this.findLastVisibleRow = function() {
        var row = null;
        for (var i in _p.rows)
            if (_p.rows[i].isDisplay()) row = _p.rows[i];
        return row;
    };

    this.feedData = function(args) {

        _p.trigger('dataFeed', args);

        _p.reconstruct(args);
        _p.setValue(args.data);
        _p.setPaginator(args.rowCount);

        _p.trigger('dataFeedComplete', args);

        if (_p.firstFeed) {
            _p.trigger('firstFeedComplete', args);
            if (_p.dataSource && _p.dataSource.filter && _p.filterRow) {
                _p.filterRow.setFilterValue(_p.dataSource.filter);
            }
            if (_p.filter.value && _p.filter.autoApply){
                _p.applyFilter();
                _p.refresh();
            }

            _p.firstFeed = false;
        }

        if (_p.initExpandAll) {
            _p.expandAllRows();
        }
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
    };

    this.refresh = function(resetPagination) {
        if (!_p.dataSource) return;

        if (resetPagination) {
            _p.goToFirstPage(true);
        }

        _p.infoDiv.selector.css("display", "none");
        if (_p.subDataTable) _p.hideSubrows();
        _p.dataSource.select();
    };


    // if EditorModule given, bind edit events
    if (_p.editorModuleArgs) {
        _p.onFieldDoubleClick(function (args) {
            if (typeof(_p.selectCallback) == "function") {
                _p.selectCallback(args);
                if (_p.tabPage) {
                    _p.tabPage.destroyTab();
                }
                else if (_p.parent.tabPage && _p.parent.tabPage.parentTab) {
                    _p.parent.tabPage.parentTab.destroyTab();
                }
                else if (_p.parent.tabPage) {
                    _p.parent.tabPage.destroyTab();
                }

                return;
            }

            var fieldKey = args.field.fieldKey;
            var editorModuleArgs = _p.editorModuleArgs;
            var row = args.row.getValue();
            if (_p.editorModuleArgs[fieldKey]) {
                row = sic.mergeObjects(row, row[fieldKey]);
                editorModuleArgs = _p.editorModuleArgs[fieldKey];
            }
            if (typeof(editorModuleArgs.parseRow) == "function") row = editorModuleArgs.parseRow(row);

            //var tabName = args.row.reprValue();
            editorModuleArgs = sic.mergeObjects({
                entityTitle: _p.entityTitle,
                primaryKey: _p.primaryKey
            }, editorModuleArgs);

            editorModuleArgs = sic.mergeObjects(editorModuleArgs, {
                newTab: _p.rowReprValue(row, editorModuleArgs.entityTitle, editorModuleArgs.primaryKey),
                row: row
            });

            editorModuleArgs.onClosed = function (args) {
                _p.refresh();
            };

            if (_p.dataSource && _p.dataSource.staticData)
                editorModuleArgs.staticData = sic.mergeObjects(_p.dataSource.staticData, editorModuleArgs.staticData);
            if (_p.primaryKey)
                for (var pkIdx in _p.primaryKey) {
                    editorModuleArgs[_p.primaryKey[pkIdx]] = row[_p.primaryKey[pkIdx]];
                }

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

    // if canExpand, bind expand click event
    if (_p.canExpand) {
        _p.onFieldClick(function(args){
            if (args.field.fieldKey == "_expand") {
                args.row.expandToggleSubRow();
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

        if (_p.initRefresh)
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
    this.active = false;
    this.subRowTr = null;
    this.tempClassName = "";

    this.isModified = false;

    // Settings
    this.dataTable = sic.getArg(args, "dataTable", null);

    this.headerRow = sic.getArg(args, "headerRow", false);
    this.filterRow = sic.getArg(args, "filterRow", false);
    this.subRow = sic.getArg(args, "subRow", false);
    this.parentRowTr = sic.getArg(args, "row", null);
    this.dataRow = !this.headerRow && !this.filterRow && !this.subRow;


    // Implementation
    if (!this.subRow && this.dataTable.hoverRows) this.selector.addClass("hoverable");
    if (this.dataRow || this.subRow) this.displayNone();
    if (this.filterRow && !this.dataTable.filter.visible) this.displayNone();

    this.addField = function(colName, colValue, args) {
        _p.fields[colName] = new sic.widget.sicDataTableField(_p.selector, sic.mergeObjects({dataTable:_p.dataTable, row:_p,
            fieldKey:colName, fieldValue:colValue}, args));
    };

    this.show = function(){
        _p.display();
        //if (_p.subRowTr) _p.subRowTr.show();
        _p.active = true;
    };

    this.hide = function(){
        _p.displayNone();
        if (_p.subRowTr) _p.subRowTr.hide();
        _p.active = false;
    };

    this.setValue = function(rowData){

        if (_p.tempClassName) {
            _p.selector.removeClass(_p.tempClassName);
            _p.tempClassName = "";
        }
        _p.show();
        _p.lastRowData = rowData;

        for (var fieldName in rowData) {
            if (_p.fields[fieldName]) _p.fields[fieldName].setValue(rowData[fieldName]);
        }

        _p.dataTable.trigger('rowSetValue', sic.mergeObjects(_p.getEventArgs(), {rowData:rowData}));
    };

    this.getValue = function(){
        var result = {};
        for (var i in _p.fields) {
            if (_p.fields[i].fieldKey[0] == '_') continue;
            result[_p.fields[i].fieldKey] = _p.fields[i].getValue();
        }
        return result;
    };

    this.updateRow = function() {
        if (!_p.dataTable.dataSource) return;
        _p.dataTable.dataSource.updateRow({orig:_p.lastRowData, row:_p.getValue()});
        _p.isModified = false;
    };

    this.reprValue = function(){
        return _p.dataTable.rowReprValue(_p.getValue());
    };

    this.getFilterValue = function() {
        var result = {};
        if (!_p.dataTable.filterRow) return result;
        for (var i in _p.dataTable.filterRow.fields) {
            var filterField = _p.dataTable.filterRow.fields[i];
            var filterFieldValue = filterField.getFilterValue();
            if (filterFieldValue)
                result[filterField.fieldKey] = filterFieldValue;
        }
        return result;
    };

    this.setFilterValue = function(filterValue){

        for (var i in _p.dataTable.filterRow.fields) {
            if (filterValue[i])
                _p.dataTable.filterRow.fields[i].setFilterValue(filterValue[i]);
        }
    };

    this.createSubRow = function() {
        _p.subRowTr = new sic.widget.sicDataTableRow(tableSectionWnd, sic.mergeObjects(_p.getEventArgs(), {
            subRow: true }));
        _p.subRowTr.addField('subField', '', sic.mergeObjects(_p.getEventArgs(), {
            colSpan: Object.keys(_p.fields).length, subRowField: true }));
        var subRowField = _p.subRowTr.fields['subField'];
        subRowField.selector.css("padding-left", "50px");

        _p.subRowTr.subDataTable = new sic.widget.sicDataTable(sic.mergeObjects(_p.dataTable.subDataTable, {
            parent: subRowField.selector, initRefresh: false, hideNoData: true
        }));

    };

    this.expandToggleSubRow = function() {
        //_p.subRowTr.expandToggle();
        if (_p.subRowTr.isDisplay()) {
            _p.subRowTr.displayNone();
        } else {
            _p.subRowTr.display();
            if (_p.subRowTr.subDataTable.dataSource) {
                _p.subRowTr.subDataTable.dataSource.staticData.parentRow = _p.getValue();
            }
            _p.subRowTr.subDataTable.initAndPopulate();
            if (_p.subRowTr.subDataTable.rows)
                _p.subRowTr.subDataTable.recalculateInputs();
        }
    };

    this.getEventArgs = function() {
        return sic.mergeObjects(_p.dataTable.getEventArgs(), { row: _p });
    };

    this.recalculateInputs = function(){
        if (_p.filterRow)
            for (var i in _p.fields) _p.fields[i]._recalcInputWidth();

        for (var i in _p.fields) {
            if (_p.fields[i].editable && _p.fields[i].dataField)
                _p.fields[i]._recalcInputWidth();
        }
    };

    this.addTempClassName = function(className) {
        if (_p.tempClassName) _p.selector.removeClass(_p.tempClassName);
        _p.tempClassName = className;
        _p.selector.addClass(_p.tempClassName);
    };

    // Bind Events
    this.selector.click(function(e){
        if (_p.headerRow) _p.dataTable.trigger("headerRowClick", _p.getEventArgs());
        if (!_p.headerRow) _p.dataTable.trigger("dataRowClick", _p.getEventArgs());
        _p.dataTable.trigger("rowClick", _p.getEventArgs());
        //e.preventDefault();
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
    this.canFilter = sic.getArg(args, "canFilter", this.canSort);
    this.row = sic.getArg(args, "row", null);
    this.dataTable = sic.getArg(args, "dataTable", this.row ? this.row.dataTable : null);
    this.clearValue = sic.getArg(args, "clearValue", "");
    this.visible = sic.getArg(args, "visible", typeof(this.fieldKey) == "string" && this.fieldKey.substr(0,2) != "__");
    this.tagClass = sic.getArg(args, "tagClass", "");
    this.caption = sic.getArg(args, "caption", "");
    this.hint = sic.getArg(args, "hint", null);
    this.hintF = sic.getArg(args, "hintF", null);
    this.width = sic.getArg(args, "width", null);
    this.editable = sic.getArg(args, "editable", this.dataTable.editable);
    this.colSpan = sic.getArg(args, "colSpan", null);
    this.editorType = sic.getArg(args, "editorType", "text");
    this.updateOnEnter = sic.getArg(args, "updateOnEnter", true);
    this.displayType = sic.getArg(args, "displayType", "");

    this.headerField = sic.getArg(args, "headerField", this.row ? this.row.headerRow : false);
    this.filterField = sic.getArg(args, "filterField", this.row ? this.row.filterRow : false);
    this.subRowField = sic.getArg(args, "subRowField", false);
    this.dataField = !this.headerField && !this.filterField && !this.subRowField;

    this.cellDataTable = sic.getArg(args, "cellDataTable", null);
    this.formView = sic.getArg(args, "formView", null);
    this.actions = sic.getArg(args, "actions", null);
    this.autoSplitPipes = sic.getArg(args, "autoSplitPipes", ", ");

    if (!this.subRowField) {
        this.valueDiv = new sic.widget.sicElement({parent:this.selector, tagClass:"inline"});
        if (this.displayType == "button" && this.dataField)
            this.valueDiv.setGradient("blue");
    }

    if (this.displayType == "button")
        this.selector.addClass("dataTable_td_button");

    this.hasInput = false;

    if (this.colSpan) this.selector.attr("colSpan", this.colSpan);

    if (this.headerField) {
        // Header field
        this.sortImg = new sic.widget.sicElement({parent:this.selector, tagName:"img", tagClass:"dataTableSortIcon icon8"});
        this.sortImg.selector.css("display", "none");
        if (this.canSort)
            this.selector.addClass("sortable");
    } else if (this.filterField) {
        // Filter field
        this.input = new sic.widget.sicInput({parent:this.valueDiv.selector, name:this.fieldKey,
            caption:false, readOnly:!this.canFilter, showModified:false});
        this.input.selector.addClass('dataTableFilterInput');
        if (!this.canFilter) this.input.selector.addClass('disabled');
        this.input.onEnterPressed(function(e) {
            _p.dataTable.applyFilter();
            _p.dataTable.refresh();
        });
        this.hasInput = true;
    } else if (this.subRowField) {
        // Subrow Field
    } else {
        // Data field
        if (this.editable && this.dataField) {

            if (this.editorType == "checkbox")
                this.selector.addClass('dataTableCheckboxCell');

            this.input = new sic.widget.sicInput({parent:this.valueDiv.selector, name:this.fieldKey,
                caption:false, showModified:true, type:this.editorType });
            this.input.selector.addClass('dataTableValueInput');

            this.input.onModified(function(modArgs) {
                if (modArgs.modified) _p.row.isModified = true;
            });

            if (this.editorType == "checkbox") {
                this.input.selector.click(function(e) {

                    //$(this).prop('checked', true);
                    //sic.dump($._data( $(this)[0], "events" ), 10);
                    //var foo = $._data( $(this)[0], "events" );
                    //sic.dump(foo.click[0].handler, 10);
                    //$(this).prop("checked", !$(this).prop("checked"));
                });
            }

            //if (!this.canEdit) this.input.selector.addClass('disabled');
            if (this.updateOnEnter) {
                this.input.onEnterPressed(function(e) {
                    //_p.dataTable.applyFilter();
                    //_p.dataTable.refresh();
                    //sic.dump(_p.row.getValue());
                    _p.row.updateRow();
                });
            }
            this.hasInput = true;
        } else {
            if (this.dataTable.hoverCells) this.selector.addClass("hoverable");
        }
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

        if (_p.dataField && _p.cellDataTable) {
            _p.valueDiv.selector.empty();
            _p.cellDataTableInstance = new sic.widget.sicDataTable({
                parent: _p.valueDiv.selector,
                canInsert: false,
                canDelete: false
            });
            _p.cellDataTable.initAndPopulate(_p.fieldValue);

        } else if (_p.dataField && _p.formView) {
            _p.valueDiv.selector.empty();
            _p.formViewInstance = new sic.widget.sicForm(
                sic.mergeObjects({parent:_p.valueDiv.selector, captionWidth:"100px"}, _p.formView));
            _p.formViewInstance.selector.addClass("dataTableFormView");
            for (var fKey in _p.fieldValue) {
                var fVal = _p.fieldValue[fKey];
                if (typeof(fKey) == "string" && fKey.substr(0,3) == "---")
                    _p.formViewInstance.addHr();
                else {
                    if (typeof(fVal) == "object" && typeof(fVal[0]) == "object") {
                        var newval = "";
                        for (var k in fVal) {
                            if (newval) newval += "<br />";
                            newval += fVal[k].value;
                        }
                        fVal = newval;
                    }
                    _p.formViewInstance.addInput({name:fKey, type:"flat", value:fVal, readOnly:true});

                    /*
                    var inputArgs = {name:fKey, type:"flat", value:fVal, readOnly:true};
                    if (fVal && fVal[0] && fVal[0].codeId) {
                        inputArgs.isArray = true;
                        inputArgs.withCode = sic.codes.pubSource;
                    }
                    _p.formViewInstance.addInput(inputArgs);
                    */
                }
            }
        } else if (_p.dataField && _p.actions) {
            _p.valueDiv.actions = {};
            for (var aKey in _p.actions) {
                var actionArgs = _p.actions[aKey];
                var actionType = sic.getArg(actionArgs, 'type', 'link');
                var actionLabel = sic.getArg(actionArgs, 'label', sic.captionize(aKey));
                var actionOnClick = sic.getArg(actionArgs, 'onClick', function(args) {});
                var action;
                switch (actionType) {
                    case "link": default:
                        action = new sic.widget.sicElement({parent:_p.valueDiv.selector});
                        action.selector.html(actionLabel);
                        break;
                    case "button":
                        action = new sic.widget.sicInput({parent:_p.valueDiv.selector, type:'button'});
                        action.setValue(actionLabel);
                        break;
                }
                action.selector[0].actionOnClick = actionOnClick;
                action.selector.click(function(e){
                    if (!this.actionOnClick) return;
                    var clickArgs = sic.mergeObjects(_p.getEventArgs(), {action: actionArgs});
                    this.actionOnClick(clickArgs);
                });
                _p.valueDiv.actions[aKey] = action;
            }
            //_p.valueDiv.selector.html('Actions!');
        } else if (_p.filterField) {

        } else if (_p.headerField) {
            _p.valueDiv.selector.html(_p.fieldValue);
        } else {
            // Replace pipes
            var fVal = _p.fieldValue;
            if (_p.autoSplitPipes) fVal = sic.replacePipes(fVal, _p.autoSplitPipes, 0);

            if (_p.editable && _p.dataField) {
                _p.input.setValue(fVal);
                _p.input.calcModified();
                //_p.valueDiv.selector.html(fVal);
            } else {
                if (!_p.subRowField)
                    _p.valueDiv.selector.html(fVal);
            }
        }
    };

    this.getValue = function(){
        if (_p.hasInput)
            return _p.input.getValue();

        return _p.fieldValue;
    };

    this.getFilterValue = function() {
        if (!_p.dataTable.filterRow) return null;
        var filterField = _p.dataTable.filterRow.fields[_p.fieldKey];
        if (filterField && filterField.input)
            return filterField.input.getValue();
        else
            return null;
    };

    this.setFilterValue = function(filterValue) {
        var filterField = _p.dataTable.filterRow.fields[_p.fieldKey];
        filterField.input.setValue(filterValue);
    };

    this.getEventArgs = function(){
        return sic.mergeObjects(_p.row.getEventArgs(), { field: _p });
    };

    this._recalcInputWidth = function(){
        if (_p.hasInput) {
            _p.input.input.selector.css("width", "");
            var newWidth = _p.selector.width()+7;
            if (_p.width && newWidth < _p.width) newWidth = _p.width;
            _p.input.input.selector.css("width", newWidth+"px");
        }
    };

    // Bind events
    this.selector.click(function(e){
        if (_p.headerField) _p.dataTable.trigger("headerFieldClick", _p.getEventArgs());
        if (_p.dataField) _p.dataTable.trigger("dataFieldClick", _p.getEventArgs());
        _p.dataTable.trigger("fieldClick", _p.getEventArgs());
        //e.preventDefault();
    });
    this.selector.dblclick(function(e){
        if (_p.headerField) _p.dataTable.trigger("headerFieldDoubleClick", _p.getEventArgs());
        if (_p.dataField) _p.dataTable.trigger("dataFieldDoubleClick", _p.getEventArgs());
        _p.dataTable.trigger("fieldDoubleClick", _p.getEventArgs());
        e.preventDefault();
        return false;
    });
    this.selector.bind("contextmenu", function(e){
        if (_p.headerField) _p.dataTable.trigger("headerFieldRightClick", _p.getEventArgs());
        if (_p.dataField) _p.dataTable.trigger("dataFieldRightClick", _p.getEventArgs());
        _p.dataTable.trigger("fieldRightClick", _p.getEventArgs());
        if (_p.dataTable.preventContextMenu) { e.preventDefault(); return false; }
    });

    // Set initial value
    this.setValue(this.fieldValue);

    if (this.hint) this.setHint(this.hint);
    if (this.hintF && _p.dataField) {
        this.setHint("");
        this.showHint = function(){ _p.hintF(_p.getEventArgs()); }
    }
    if (!this.visible) this.displayNone();
    if (this.tagClass) this.selector.addClass(this.tagClass);
    if (this.filterField || (this.editable && this.dataField)) this.dataTable.onDataFeedComplete(_p._recalcInputWidth);
};


sic.widget.sicDataTableDataSource = function(args) {
    // Init
    var _p = this;
    this._cons = sic.object.sicEventBase;
    this._cons();

    this.moduleName = sic.getArg(args, "moduleName", null);
    this.methodNames = sic.getArg(args, "methodNames", { select:'dataTableSelect', delete:'dataTableDelete',
        updateRow:'dataTableUpdateRow', exportXls:'dataTableExportXls', exportCsv:'dataTableExportCsv' });
    this.filter = sic.getArg(args, "filter", {});
    this.filterMode = sic.getArg(args, "filterMode", "normal");
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
            filter: _p.filter,
            filterMode: _p.filterMode,
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

    this.updateRow = function(args) {
        return sic.callMethod(_p.getMethodCallData(_p.methodNames.updateRow, args), _p.callbacks.feedData);
    }

    this.exportXls = function(args) {
        return sic.callMethod(_p.getMethodCallData(_p.methodNames.exportXls, args), function(rArgs) {
            if (rArgs.status && rArgs.link) location.href = rArgs.link;
        });
    }

    this.exportCsv = function(args) {
        return sic.callMethod(_p.getMethodCallData(_p.methodNames.exportCsv, args), function(rArgs) {
            if (rArgs.status && rArgs.link) location.href = rArgs.link;
        });
    }
}
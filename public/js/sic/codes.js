sic.codes = {
    load: function(callback) {
        sic.callMethod({moduleName:'System/Codes', methodName:"getCodes", aSync:true}, function(data) {
            for (var codesSetName in data) {
                sic.codes[codesSetName] = {};
                for (var idx in data[codesSetName]) {
                    var code = data[codesSetName][idx];
                    sic.codes[codesSetName][code["code_id"]] = code["value"];
                }
            }
            if (typeof(callback) == "function") { callback(); }
        });
    }
};

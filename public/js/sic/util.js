sic.getArg = function(args, idx, defaultVal) {
    if (!args) return defaultVal;
    var result = args[idx];
    if (typeof(result) == "undefined") result = defaultVal;

    if (typeof(defaultVal) == "boolean") result = result ? true : false;
    else if (typeof(defaultVal) == "float") result = parseFloat(result);
    else if (typeof(defaultVal) == "integer") result = parseInt(result);
    else if (typeof(defaultVal) == "string") result = result ? result : defaultVal;

    return result;
};

sic.mergeObjects = function(obj1, obj2) {
    var result = {};

    if (typeof(obj1) != "undefined")
        for (var idx in obj1)
            result[idx] = obj1[idx];

    if (typeof(obj2) != "undefined")
        for (var idx in obj2)
            result[idx] = obj2[idx];

    return result;
};

sic.dump = function(obj, depth, nl) {
    alert(sic.debug(obj, depth, nl));
};

sic.debug = function(obj, depth, nl) {

    if (typeof(obj) == "string") return obj;
    if (typeof(obj) == "number" ||
        typeof(obj) == "boolean") return new String(obj);
    //if (typeof(obj) == "undefined") return "undefined";

    var dumpRc = function(obj, depth, nl, spaces){
        if (depth == -1){
            if (typeof(obj) == "object")
                return "{...}"+nl;
            else if (typeof(obj) == "function") {
                var args = "";
                for (var i=0; i<obj.length; i++){ if (args) args += ", "; args += "..."; }
                return "function ("+args+")"+nl;
            }
            //else if (typeof(obj) == "undefined") {
            //    return nl;
            //}
            else
                return new String(obj)+nl;
        }

        var result = "";
        for (var key in obj) {
            result += spaces+key+" : ";
            if (typeof(obj[key]) == "object"){
                if (depth > 0) result += nl;
                result += dumpRc(obj[key], depth -1, nl, spaces+"    ");
            } else {
                result += dumpRc(obj[key], -1, nl, "");
            }
        }
        return result;
    };

    if (typeof(depth) == "undefined") depth = 2;
    if (typeof(nl) == "undefined") nl = "\n";

    return dumpRc(obj, depth, nl, "")
}

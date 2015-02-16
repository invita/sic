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

sic.capitalize = function(strVal) {
    return strVal && typeof(strVal) == "string" ? strVal.substr(0, 1).toUpperCase() + strVal.substr(1) : "";
};

sic.captionize = function(strVal) {
    if (!strVal || typeof(strVal) != "string") return "";
    var result = "";
    for(var i = 0; i < strVal.length; i++) {
        var char = strVal[i];

        if (char >= 'A' && char <= 'Z') char = " "+char;
        if (i == 0) char = char.toUpperCase();

        result = result + char;
    }
    return result;
};

sic.mergePlaceholders = function(str, valueMapObj) {
    if (!str) return "";
    if (typeof(valueMapObj) == "object") {
        for (var key in valueMapObj) {
            var searchRegEx = new RegExp('%'+key+'%', 'ig');
            str = str.replace(searchRegEx, valueMapObj[key]);
        }
    }
    return str;
};

sic.dump = function(obj, depth, nl, spaceChar) {
    alert(sic.debug(obj, depth, nl, spaceChar));
};

sic.debug = function(obj, depth, nl, spaceChar) {

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
            result += spaces+"["+key+"]"+spaceChar+"="+spaceChar;
            if (typeof(obj[key]) == "object"){
                if (depth > 0) result += nl;
                result += dumpRc(obj[key], depth -1, nl, spaces+spacesChars);
            } else {
                result += dumpRc(obj[key], -1, nl, "");
            }
        }
        return result;
    };

    if (typeof(depth) == "undefined") depth = 2;
    if (typeof(nl) == "undefined") nl = "\n";
    if (typeof(spaceChar) == "undefined") spaceChar = " ";
    var spacesChars = spaceChar+spaceChar+spaceChar+spaceChar;

    return dumpRc(obj, depth, nl, "")
}

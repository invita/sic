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
    if (!strVal || typeof(strVal) != 'string') return '';
    var result = '';
    var lastChar = '';
    var nextUpper = true;
    for(var i = 0; i < strVal.length; i++) {
        var char = strVal[i];

        if (nextUpper) {
            char = char.toUpperCase();
            nextUpper = false;
        }

        if (char == '_') { char = ' '; nextUpper = true; }
        if (char >= 'A' && char <= 'Z' && lastChar != ' ') char = ' '+char;

        lastChar = char;
        result = result + char;
    }
    return result;
};

sic.mergePlaceholders = function(str, valueMapObj) {
    if (!str) return "";
    if (typeof(valueMapObj) == "object") {
        for (var key in valueMapObj) {
            var searchRegEx = new RegExp('%'+key+'%', 'ig');
            var replaceVal = undefined;
            if (typeof(valueMapObj[key]) == "string" || typeof(valueMapObj[key]) == "number") replaceVal = valueMapObj[key];
            else if (valueMapObj[key] && typeof(valueMapObj[key]) == "object" && Object.keys(valueMapObj).length) {
                replaceVal = "";
                for (var k in valueMapObj[key]){
                    if (replaceVal) replaceVal += ', ';
                    replaceVal += valueMapObj[key][k];
                }
            }
            if (replaceVal !== undefined) {
                str = str.replace(searchRegEx, replaceVal);
            }
        }
    }
    while (str.indexOf('%') != -1) str = str.replace('%', '[').replace('%', '=?]');
    return str;
};

sic.removeStarsFromObject = function(obj, recursive) {
    for (var key in obj) {
        if (typeof(obj[key]) == "string")
            obj[key] = obj[key].replace(/\*/g, "");
        if (typeof(obj[key]) == "object" && !Array.isArray(obj[key]) && typeof(obj[key].value) == "string")
            obj[key].value = obj[key].value.replace(/\*/g, "");

        // Recursive
        if (recursive && typeof(obj[key]) == "object" && Array.isArray(obj[key])) {
            obj[key] = sic.removeStarsFromObject(obj[key]);
        }
    }
    return obj;
};

sic.replacePipes = function(value, newSeparator, depth) {
    if (!value) return value;
    if (typeof(newSeparator) == "undefined") newSeparator = ", ";
    if (typeof(depth) == "undefined") depth = 3;

    // If object given, duplicate, don't touch original
    if (typeof(value) == "object") value = sic.mergeObjects(value);

    return sic._replacePipes(value, newSeparator, depth);
};

sic._replacePipes = function(value, newSeparator, depth) {
    if (depth > 0 && typeof(value) == "object")
        for (var k in value)
            value[k] = sic._replacePipes(value[k], newSeparator, depth -1);

    if (typeof(value) == "string")
        value = value.replace(/\|\|/g, newSeparator);

    return value;
};

sic.splitPipes = function(value) {
    if (typeof(value) != "string") return value;
    return value.split("||");
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

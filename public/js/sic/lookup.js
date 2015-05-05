sic.lookup = {
    user: {

    },
    publication: {
        resolve: { moduleName:"Lookup/Publication", methodName:"resolve", emptyValue: "None" },
        lookup: { moduleName:"Pub/PubSearch" },
        edit: { moduleName:"Pub/PubEdit", newTab:"Entity", entityTitle: "Entity %pub_id% - %title%" }
    },
    project: {

    },
    projectLine: {

    },
    quote: {

    }
};

sic.hint = {
    publication: function(row){
        var result = "";

        var stringifyField = function(value, separator, args) {
            if (!args) args = {};
            value = sic.splitPipes(value);
            var line = "";
            if (!Array.isArray(value)) value = [value];

            for (var i in value) {
                if (line) line += separator;
                if (args.prefix) line += args.prefix;
                line += "<span class=\"hintPropVal\">"+value[i]+"</span>";
                if (args.postfix) line += args.postfix;
            }
            return line;
        }

        var defaultAmp = "<span class=\"hintPropKey\"> &amp; </span>";
        var colonAmp = "<span class=\"hintPropKey\"> &colon; </span>";
        var commaAmp = "<span class=\"hintPropKey\">&comma; </span>";

        if (row.creator_author) {
            if (result) result += defaultAmp;
            result += stringifyField(row.creator_author, defaultAmp);
        }

        if (row.creator_editor) {
            if (result) result += defaultAmp;
            result += stringifyField(row.creator_editor, defaultAmp, {postfix:"<span class=\"hintPropKey\"> (ed.)</span>"});
        }

        if (row.creator_organization) {
            if (result) result += defaultAmp;
            result += stringifyField(row.creator_organization, defaultAmp, {postfix:"<span class=\"hintPropKey\"> (org.)</span>"});
        }

        if (result) result += "<span class=\"hintPropKey\">. </span>";

        if (row.title || row.addtitle) result += "<span class=\"hintPropKey\">&quot;</span>";
        if (row.title) {
            result += stringifyField(row.title, colonAmp);
        }
        if (row.addtitle) {
            result += "<span class=\"hintPropKey\"> [</span>" +
            stringifyField(row.addtitle, colonAmp) + "<span class=\"hintPropKey\">]</span>";
        }
        if (row.title || row.addtitle) result += "<span class=\"hintPropKey\">&quot;. </span>";

        if (row.edition) {
            result += stringifyField(row.edition, commaAmp, {prefix:"<span class=\"hintPropKey\">(ed.) </span>"});
        }

        if (row.volume) {
            if (row.edition) result += commaAmp;
            result += stringifyField(row.volume, commaAmp, {prefix:"<span class=\"hintPropKey\">(vol.) </span>"});
        }

        if (row.issue) {
            if (row.edition || row.volume) result += commaAmp;
            result += stringifyField(row.issue, commaAmp, {prefix:"<span class=\"hintPropKey\">(no.) </span>"});
        }

        if (result) result += "<span class=\"hintPropKey\">.|, </span>";

        if (row.place) {
            result += stringifyField(row.place, commaAmp);
        }
        if (row.publisher) {
            if (row.place) result += colonAmp;
            result += stringifyField(row.publisher, commaAmp);
        }
        if (result) result += "<span class=\"hintPropKey\">.|, </span>";

        if (row.year) {
            result += stringifyField(row.year, commaAmp);
        }

        if (row.page) {
            if (row.year) result += commaAmp;
            result += stringifyField(row.page, commaAmp, {prefix:"<span class=\"hintPropKey\">pp. </span>"});
            if (result) result += "<span class=\"hintPropKey\">.</span>";
        }

        return result;
    }
}

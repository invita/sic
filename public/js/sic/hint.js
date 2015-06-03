
sic.hint = {};
sic.hint.publication = function(pubId) {
    sic.callMethod({
        moduleName: "Pub/PubEdit",
        methodName: "pubSelect",
        pub_id: pubId,
        aSync: true
    }, function(cbArgs) {
        sic.hint.publicationShowRow(cbArgs.data);
    });
};

/*
 [pubCreator] =
 [1] = author
 [2] = addAuthor
 [3] = editor
 [4] = addEditor
 [5] = organization
 [6] = translator
 [pubIdno] =
 [1] = cobiss
 [2] = isbn
 [3] = issn
 [4] = doi
 [5] = sistory
 [pubSource] =
 [1] = title
 [2] = editor
 [3] = creator
 [4] = series
 [5] = collection
 [6] = string
 [pubOnline] =
 [1] = url
 [2] = when
 [3] = title
*/

sic.hint.publicationShowRow = function(row) {

    var result = "";

    var findAllCodes = function(data, codeId) {
        var found = [];
        for (var i in data) if (data[i].codeId == codeId && data[i].value) found.push(data[i].value);
        return found ? found : null;
    };

    for (var i in sic.codes.pubCreator)
        if (row.creator && row.creator[0])
            row["creator_"+sic.codes.pubCreator[i]] = findAllCodes(row.creator, i);

    for (var i in sic.codes.pubSource)
        if (row.source && row.source[0])
            row["source_"+sic.codes.pubSource[i]] = findAllCodes(row.source, i);

    for (var i in sic.codes.pubOnline)
        if (row.online && row.online[0])
            row["online_"+sic.codes.pubOnline[i]] = findAllCodes(row.online, i);

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

    if (row.creator_author && row.creator_author[0]) {
        if (result) result += defaultAmp;
        result += stringifyField(row.creator_author, defaultAmp);
    }

    if (row.creator_addAuthor && row.creator_addAuthor[0]) {
        if (result) result += defaultAmp;
        result += stringifyField(row.creator_addAuthor, defaultAmp);
    }

    if (row.creator_editor && row.creator_editor[0]) {
        if (result) result += defaultAmp;
        result += stringifyField(row.creator_editor, defaultAmp, {postfix:"<span class=\"hintPropKey\"> (ed.)</span>"});
    }

    if (row.creator_addEditor && row.creator_addEditor[0]) {
        if (result) result += defaultAmp;
        result += stringifyField(row.creator_addEditor, defaultAmp, {postfix:"<span class=\"hintPropKey\"> (ed.)</span>"});
    }

    if (row.creator_organization && row.creator_organization[0]) {
        if (result) result += defaultAmp;
        result += stringifyField(row.creator_organization, defaultAmp, {postfix:"<span class=\"hintPropKey\"> (org.)</span>"});
    }

    if (row.creator_translator && row.creator_translator[0]) {
        if (result) result += defaultAmp;
        result += stringifyField(row.creator_translator, defaultAmp, {postfix:"<span class=\"hintPropKey\"> (trans.)</span>"});
    }

    if (result) result += "<span class=\"hintPropKey\">. </span>";

    if (row.title || row.addtitle) result += "<span class=\"hintPropKey\">&quot;</span>";
    if (row.title) {
        result += stringifyField(row.title, colonAmp);
    }
    if (row.addtitle && row.addtitle[0]) {
        result += "<span class=\"hintPropKey\"> [</span>" +
        stringifyField(row.addtitle, colonAmp) + "<span class=\"hintPropKey\">]</span>";
    }
    if (row.title && row.title[0] || row.addtitle && row.addtitle[0]) result += "<span class=\"hintPropKey\">&quot;. </span>";

    if (row.edition && row.edition[0]) {
        result += stringifyField(row.edition, commaAmp, {prefix:"<span class=\"hintPropKey\">(ed.) </span>"});
    }

    if (row.volume && row.volume[0]) {
        if (row.edition && row.edition[0]) result += commaAmp;
        result += stringifyField(row.volume, commaAmp, {prefix:"<span class=\"hintPropKey\">(vol.) </span>"});
    }

    if (row.issue && row.issue[0]) {
        if (row.edition || row.volume) result += commaAmp;
        result += stringifyField(row.issue, commaAmp, {prefix:"<span class=\"hintPropKey\">(no.) </span>"});
    }

    if (row.edition && row.edition[0] ||
        row.volume && row.volume[0] ||
        row.issue && row.issue[0]) result += "<span class=\"hintPropKey\">, </span>";

    if (row.place && row.place[0]) {
        result += stringifyField(row.place, commaAmp);
    }
    if (row.publisher && row.publisher[0]) {
        if (row.place) result += colonAmp;
        result += stringifyField(row.publisher, commaAmp);
    }
    if (result) result += "<span class=\"hintPropKey\">, </span>";

    if (row.year && row.year[0]) {
        result += stringifyField(row.year, commaAmp);
    }

    if (row.page && row.page[0]) {
        if (row.year) result += commaAmp;
        result += stringifyField(row.page, commaAmp, {prefix:"<span class=\"hintPropKey\">pp. </span>"});
        if (result) result += "<span class=\"hintPropKey\">.</span>";
    }

    if (row.source_editor && row.source_editor[0] ||
        row.source_creator && row.source_creator[0] ||
        row.source_title && row.source_title[0] ||
        row.source_series && row.source_series[0] ||
        row.source_collection && row.source_collection[0] ||
        row.source_string && row.source_string[0]) result += "<span class=\"hintPropKey\">In: </span>";

    if (row.source_editor && row.source_editor[0]) {
        result += stringifyField(row.source_editor, defaultAmp, {prefix:"<span class=\"hintPropKey\">(ed.) </span>"});
    }

    if (row.source_creator && row.source_creator[0]) {
        if (row.source_editor && row.source_editor[0]) result += "<span class=\"hintPropKey\">, </span>";
        result += stringifyField(row.source_creator, defaultAmp);
    }

    if (row.source_title && row.source_title[0]) {
        if (row.source_editor && row.source_editor[0] ||
            row.source_creator && row.source_creator[0]) result += "<span class=\"hintPropKey\">, </span>";
        result += stringifyField(row.source_title, colonAmp);
    }

    if (row.source_series && row.source_series[0]) {
        result += "<span class=\"hintPropKey\">(</span>";
        result += stringifyField(row.source_series, commaAmp);
        result += "<span class=\"hintPropKey\">) </span>";
    }

    if (row.source_collection && row.source_collection[0]) {
        result += "<span class=\"hintPropKey\">(</span>";
        result += stringifyField(row.source_collection, commaAmp);
        result += "<span class=\"hintPropKey\">) </span>";
    }

    if (row.source_string && row.source_string[0]) {
        result += stringifyField(row.source_string, colonAmp);
        result += " ";
    }


    if (row.online_title && row.online_title[0] ||
        row.online_url && row.online_url[0] ||
        row.online_when && row.online_when[0]) result += "<span class=\"hintPropKey\">Online: </span>";

    if (row.online_title && row.online_title[0]) {
        result += stringifyField(row.online_title, commaAmp);
    }

    if (row.online_url && row.online_url[0]) {
        if (row.online_title && row.online_title[0])
            result += "<span class=\"hintPropKey\">, </span>";
        result += stringifyField(row.online_url, commaAmp);
    }

    if (row.online_when && row.online_when[0]) {
        result += "<span class=\"hintPropKey\"> (</span>";
        result += stringifyField(row.online_when, commaAmp);
        result += "<span class=\"hintPropKey\">) </span>";
    }

    sic.showHint(result);
}

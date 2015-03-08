sic.object.sicFileUploader = function(args)
{
    // Init
    var _p = this;
    this._cons = sic.widget.sicElement;
    this._cons({ parent:$("body"), tagName:"input", attr: { type:"file" },
        style:{ display: "none" }, tagId:sic.object._nextFileUploadId()});

    this._ebase = sic.object.sicEventBase;
    this._ebase();

    // Settings
    this.autoUpload = sic.getArg(args, "autoUpload", true);
    this.fileNamePrefix = sic.getArg(args, "fileNamePrefix", "");

    // Events
    this.onUploadComplete = function(f) { _p.subscribe("onUploadComplete", f); };

    // Implementation
    this.pickedFileName = "";

    this.chooseFile = function() {
        _p.selector.click();
    };

    this.upload = function(e) {
        sic.loading.show();

        var data = new FormData();
        $.each(e.target.files, function(key, value) {
            data.append(key, value);
        });
        data.append("fileNamePrefix", _p.fileNamePrefix);

        $.ajax({
            url: "/uploadFile",
            type: "POST",
            data: data,
            cache: false,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function(data, textStatus, jqXHR)
            {
                //sic.dump(data);
                _p.trigger("onUploadComplete", data);
                sic.loading.hide();
            },
            error: function(jqXHR, textStatus, errorThrown)
            {
                alert("Error: " + textStatus);
                sic.loading.hide();
            }
        });
    };

    this.getFileName = function() {
        return _p.fileNamePrefix + _p.pickedFileName;
    };

    if (this.autoUpload) {
        this.selector.change(function(e){
            var fileName = _p.selector.val().replace(/\\/g, '/');
            _p.pickedFileName = fileName.substring(fileName.lastIndexOf('/') +1);
            _p.upload(e);
        });
        this.chooseFile();
    }

};

// Id Generator
sic.object._lastFileUploadId = 0;
sic.object._nextFileUploadId = function(){
    sic.object._lastFileUploadId += 1;
    return "file"+sic.object._lastFileUploadId;
};

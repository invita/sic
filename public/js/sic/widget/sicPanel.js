sic.widget.sicPanel = function(args)
{
    // Init
    var _p = this;
    this._cons = sic.widget.sicElement;
    this._cons({ parent:args.parent });
    this.selector.addClass("sicPanel");
    this.groups = [];
    this.firstGroup = null;

    // Settings
    this.firstGroupName = sic.getArg(args, "firstGroupName", "");

    // Implementation
    this.addGroup = function(groupName){
        var group = new sic.widget.sicPanelGroup({parent:_p.selector, name:groupName});
        _p.groups.push(group);
        if (!_p.firstGroup) _p.firstGroup = group;
        return group;
    };

    if (this.firstGroupName)
        this.addGroup(this.firstGroupName);
};

sic.widget.sicPanelGroup = function(args){
    var _p = this;
    this._cons = sic.widget.sicElement;
    this._cons({ parent:args.parent });
    this.selector.addClass("sicPanelGroup");

    this.name = sic.getArg(args, "name", "");

    // Header
    this.header = new sic.widget.sicElement({parent:this.selector});
    this.header.selector.addClass("header");

    // Content
    this.content = new sic.widget.sicElement({parent:this.selector});
    this.content.selector.addClass("content");

    this.setName = function(newName){
        _p.name = newName;
        _p.header.selector.html(_p.name);
        if (_p.name)
            _p.header.display();
        else
            _p.header.displayNone();
    };

    this.setName(_p.name);
};
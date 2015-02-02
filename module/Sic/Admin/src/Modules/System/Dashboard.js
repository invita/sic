var F = function(args){

    var tabPage = args.helpers.createTabPage({name:"System"});
    var childPage = tabPage.createChildPage({name:"Dashboard", canClose:false});
    var childPage2 = childPage.createChildPage({name:"Dashboard2"});

};
angular.module('service.mainAppLinker',[]).service('mainAppLinker',function(dB){

    mApp = {};

    mApp.hideMenu = {value:false};
    mApp.hideMainChoice = {value:true};
    mApp.hideDownLoadForm = {value:true};

    // This two variables show how the 
    mApp.hideDownLoadFormAcc = {value:true};
    mApp.hideDashboard = {value:false};


    // For the category
    mApp.hideCategoryEditInterface = {value:true};

    mApp.hideDashboard = {value:true};

    mApp.hideSave = {value:true};

    mApp.categoryPageActive = false;

    mApp.hideSetup = {value:false};
    
    mApp.inSetup = {value:true};

    return mApp;



});

angular.module('service.mainAppLinker',[]).service('mainAppLinker',function(dB){

    var self = this;

    self.hideMenu = {value:false};
    self.hideMainChoice = {value:false};
    self.hideDownLoadForm = {value:true};

    // This two variables show how the 
    self.hideDownLoadFormAcc = {value:true};
    self.hideDashboard = {value:false};

    // For the category
    self.hideCategoryEditInterface = {value:true};

    self.hideDashBoard = {value:true};

    self.hideSave = {value:false};

    self.categoryPageActive = false;



});

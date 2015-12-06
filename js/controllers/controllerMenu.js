

angular.module('controller.menuController',['service.mainAppLinker','service.downloadFormService']).controller('menuController',
        ['mainAppLinker','downloadFormService','$rootScope',function(mAppLn,dlFs,$rootScope){

    var self = this;

    self.hideMenu = mAppLn.hideMenu;

    self.menActive = {download : "active",
                      update : "",
                      dashboard : "",
                      categories : "",
                      config : ""};
    
    self.activateMen = function(menItem){

        for(var item in self.menActive){
            self.menActive[item] = "";
        }

        self.menActive[menItem] = "active";

    };


    self.clickUpdate = function(){

        mAppLn.hideMainChoice.value = true;
        mAppLn.hideDownLoadForm.value = false;

        // This two variables show how the 
        mAppLn.hideDownLoadFormAcc.value = false;
        mAppLn.downLoadFromFile = true;

        self.activateMen('update');

        $rootScope.$emit('clearLog',null);

        dlFs.setFormBehaviour('updateDatabase');

    };

    self.clickDownload = function(){

        mAppLn.hideMainChoice.value = false;
        mAppLn.hideDownLoadForm.value = true ;

        self.activateMen('download');


    };


}]);

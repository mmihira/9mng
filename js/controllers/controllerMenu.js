

angular.module('controller.menuController',['service.mainAppLinker','service.downloadFormService','service.categoryEdit']).controller('menuController',
        ['mainAppLinker','downloadFormService','categoryEditService','$rootScope',function(mAppLn,dlFs,catES,$rootScope){

    var self = this;

    self.hideMenu = mAppLn.hideMenu;

    // These variables controll the styling for which menue is currently active
    self.menActive = {download : "active",
                      update : "",
                      dashboard : "",
                      categories : "",
                      config : ""};
    
    /*
     * This function set the one menue item to "active" and the rest
     * to empty.
     * @param   menItem     The specific menue item to set as active.
     *                      menItem must be a key in the map menActive
     */
    self.activateMen = function(menItem){

        for(var item in self.menActive){
            self.menActive[item] = "";
        }

        self.menActive[menItem] = "active";

    };

    self.clickCategories = function(){
        mAppLn.hideMainChoice.value = true;
        mAppLn.hideDownLoadForm.value = true;
        mAppLn.hideDownLoadFormAcc.value = true;
        mAppLn.downLoadFromFile = true;
        mAppLn.hideCategoryEditInterface.value = false;
        self.activateMen('categories');
        catES.update();

    }


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
        mAppLn.hideCategoryEditInterface.value = true;

        self.activateMen('download');


    };


}]);

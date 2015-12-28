

angular.module('controller.menuController',
        ['service.databaseInterface','service.mainAppLinker','service.downloadFormService',
        'service.categoryEdit','service.netPosition','service.netCashFlow','service.Setup']).controller('menuController',
        ['dBInt','mainAppLinker','downloadFormService','categoryEditService','netPosChart','netCashFlow',
        'setup','$rootScope',
        function(dBInt,mAppLn,dlFs,catES,netPosChart,netCashFlow,setup,$rootScope){

    var self = this;

    self.hideMenu = mAppLn.hideMenu;

    self.inSetup = mAppLn.inSetup;

    // These variables controll the styling for which menue is currently active
    self.menActive =  mAppLn.menActive;
    self.menHide = mAppLn.menHide;

    /**
     * Hides all the sections except that
     * which is specied in the parameter
     * except.
     */ 
    self.hideAllExcept = function(except){

        Object.keys(self.menHide).forEach(function(k){
            self.menHide[k].value = true;
        });

        self.menHide[except].value = false;

    };

    
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

    /**
     * Global cleanup and intialisation function
     */
    self.cleanUp = function(){

        if( mAppLn.categoryPageActive){
            catES.onExit();
            mAppLn.categoryPageActive = false;
        }

    }

    self.clickCategories = function(){

        mAppLn.categoryPageActive = true;

        self.hideAllExcept('categories');
        self.activateMen('categories');

        catES.initialise();

    }


    self.clickUpdate = function(){

        self.cleanUp();


        self.hideAllExcept('download');

        // This two variables show how the 
        mAppLn.hideMainChoice.value = true;
        mAppLn.hideDownLoadFormAcc.value = false;

        self.activateMen('update');

        $rootScope.$emit('clearLog',null);

        dlFs.setFormBehaviour('updateDatabase');

    };

    self.clickDownload = function(){

        self.cleanUp();

        self.hideAllExcept('all');
        mAppLn.hideDownLoadForm.value = false;
        mAppLn.hideDownLoadFormAcc.value = true;
        dlFs.setFormBehaviour('downloadFromExistingFile');


        self.activateMen('download');


    };

    self.clickSave = function(){

        self.hideAllExcept('save');

        self.activateMen('save');


    }

    self.clickDashboard = function(){

        self.hideAllExcept('dashboard');

        self.activateMen('dashboard');

        // Create the net position data
        netPosChart.createNetPosData();
        netCashFlow.createNetCashFlow();

        if( dBInt.hasBeenInit() ){ 
            netPosChart.updateChart.value = !netPosChart.updateChart.value;
            netCashFlow.updateChart.value = !netCashFlow.updateChart.value;
        }

    }

    self.clickSetup = function(){

        self.hideAllExcept('setup');

        setup.initialise();

        self.activateMen('setup');

    };


}]);

angular.module('service.mainAppLinker',[]).service('mainAppLinker',function(dB){

    mAppLn = {};

    mAppLn.hideMenu = {value:false};
    mAppLn.hideMainChoice = {value:true};
    mAppLn.hideDownLoadForm = {value:true};

    // This two variables show how the 
    mAppLn.hideDownLoadFormAcc = {value:true};
    mAppLn.hideDashboard = {value:false};


    // For the category
    mAppLn.hideCategoryEditInterface = {value:true};

    mAppLn.hideDashboard = {value:true};

    mAppLn.hideSave = {value:true};

    mAppLn.categoryPageActive = false;

    mAppLn.hideSetup = {value:false};
    
    mAppLn.inSetup = {value:true};

// These variables controll the styling for which menue is currently active
    mAppLn.menActive = {download : "",
                      update : "",
                      dashboard : "",
                      categories : "",
                      config : "",
                      save: "",
                      setup:"active"};

    mAppLn.menHide = { download: mAppLn.hideDownLoadForm,
                     dashboard: mAppLn.hideDashboard,
                     categories: mAppLn.hideCategoryEditInterface,
                     save : mAppLn.hideSave,
                     downLoadFormAcc: mAppLn.hideDownLoadFormAcc,
                     mainChoice : mAppLn.hideMainChoice,
                     setup : mAppLn.hideSetup,
                     all : {value:false}

                     };

    /**
     * Hides all the sections except that
     * which is specied in the parameter
     * except.
     */ 
    mAppLn.hideAllExcept = function(except){

        Object.keys(mAppLn.menHide).forEach(function(k){
            mAppLn.menHide[k].value = true;
        });

        mAppLn.menHide[except].value = false;

    };

    
    /*
     * This function set the one menue item to "active" and the rest
     * to empty.
     * @param   menItem     The specific menue item to set as active.
     *                      menItem must be a key in the map menActive
     */
    mAppLn.activateMen = function(menItem){

        for(var item in mAppLn.menActive){
            mAppLn.menActive[item] = "";
        }

        mAppLn.menActive[menItem] = "active";

    };


    return mAppLn;



});

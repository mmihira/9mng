/**
 * This service is used to determine which of the menues is currently active.
 * State information about which elements in the application are hidden are included here.
 * Functions for hiding particular parts of the app are also here.
 */
angular.module('service.mainAppLinker',[]).service('mainAppLinker',function(){

    var mAppLn = {};

    mAppLn.hideMenu = {value:false};
    mAppLn.hideMainChoice = {value:true};
    mAppLn.hideDownLoadForm = {value:true};

    mAppLn.hideDownLoadFormAcc = {value:true};
    mAppLn.hideDashboard = {value:false};

    mAppLn.hideCategoryEditInterface = {value:true};

    mAppLn.hideDashboard = {value:true};

    mAppLn.hideSave = {value:true};

    mAppLn.categoryPageActive = false;

    mAppLn.hideSetup = {value:false};

    mAppLn.hideExample = {value:true};
    
    mAppLn.inSetup = {value:true};


    // These variables controll the styling for which menue is currently active.
    mAppLn.menActive = {download : "",
                      update : "",
                      dashboard : "",
                      example:"",
                      categories : "",
                      config : "",
                      save: "",
                      setup:"active"};

    /**
     * This objects is used to determine which part of the application
     * is visible at any one time. The menue controller will call this
     * function to hide or show a menue.
     */
    mAppLn.menHide = { download: mAppLn.hideDownLoadForm,
                     example: mAppLn.hideExample,
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
     * @param except  The menu item that won't be hidden.
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

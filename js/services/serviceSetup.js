/**
 */
angular.module('service.Setup',
        ['service.Config','service.mainAppLinker','service.downloadFormService','service.databaseInterface']).service('setup',
        ['config','mainAppLinker','downloadFormService','dBInt',function(config,mAppLn,dlFs,dBInt){

    var setup = {};

    setup.newAccountNames = {values:[]};
    setup.accountName = {value:""};

    setup.createNewDatabase = function(){


    };

    setup.initialise = function(){

        setup.accountName.value = "";
        setup.newAccountNames.values.length = 0;

    };

    setup.addNewAccount = function(){

        setup.newAccountNames.values.push(setup.accountName.value);

    };


    setup.createNewDatabase = function(){

        for( var acc of setup.newAccountNames.values ){

            config.accountNames.value.push(acc);
            dBInt.createNewAccount(acc);

        }

        mAppLn.inSetup.value = false;
        mAppLn.hideSetup.value = true;

    };


    return setup;

}]);

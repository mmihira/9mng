/**
 */
angular.module('service.Setup',['service.Config','service.mainAppLinker','service.downloadFormService']).service('setup',
        ['config','mainAppLinker','downloadFormService',function(config,mAppLn,dlFs){

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


    return setup;

}]);

angular.module('controller.setup',['service.mainAppLinker','service.Setup']).controller('setupControl',
        ['mainAppLinker','setup',function(mAppLn,setup){

    var self = this;

    self.hide = mAppLn.hideSetup;

    self.accountName = setup.accountName;
    self.clickAddAccount = setup.addNewAccount;
    self.newAccountNames = setup.newAccountNames;


}]);

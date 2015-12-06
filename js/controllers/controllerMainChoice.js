angular.module('controller.mainChoice',['service.mainAppLinker','service.downloadFormService']).controller('mainChoice',
        ['mainAppLinker','downloadFormService',function(mAppLn,dlFS){

    var self = this;

    self.hide = mAppLn.hideMainChoice;

    self.clickLoadFromFile = function(){

        mAppLn.hideDownLoadForm.value = false;
        self.hide.value = true;
        mAppLn.hideDownLoadFormAcc.value = true;
        dlFS.setFormBehaviour('downloadFromExistingFile');

    };


}]);

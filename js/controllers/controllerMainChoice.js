angular.module('controller.mainChoice',['service.mainAppLinker']).controller('mainChoice',['mainAppLinker',function(mAppLn){

    var self = this;

    self.hide = mAppLn.hideMainChoice;

    self.clickLoadFromFile = function(){

        mAppLn.hideDownLoadForm.value = false;
        self.hide.value = true;
        mAppLn.downLoadFromFile = true;

    };


}]);

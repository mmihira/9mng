

angular.module('controller.menuController',['service.mainAppLinker']).controller('menuController',['mainAppLinker',function(mAppLn){

    var self = this;

    self.hideMenu = mAppLn.hideMenu;


}]);

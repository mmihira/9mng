angular.module('controller.save',['service.mainAppLinker','service.CSVWriter']).controller(
'controllerSave',['mainAppLinker','CSVWriter',
function(mAppLn,csvW){

    var self = this;

    self.hideSave = mAppLn.hideSave;

    self.save = csvW.save;

}]);

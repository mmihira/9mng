angular.module('controller.categoryEdit',['service.categoryInterface','service.mainAppLinker','service.categoryEdit']).controller(
'categoryEditController',['catInt','mainAppLinker' , 'categoryEditService','$scope',
function(catInt,mAppLn,catES,$scope){

    var self = this;

    
    self.hide = mAppLn.hideCategoryEditInterface;

    // The names showed in the avaialbles categories panel
    self.catNames = catES.catNames;

}]);


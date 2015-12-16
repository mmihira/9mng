angular.module('controller.categoryEdit',['service.categoryInterface','service.mainAppLinker','service.categoryEdit']).controller(
'categoryEditController',['catInt','mainAppLinker' , 'categoryEditService','$scope',
function(catInt,mAppLn,catES,$scope){

    var self = this;

    
    self.hide = mAppLn.hideCategoryEditInterface;

    /*
     * A function which returns the tag associated with a category
     */
    self.returnCatTag = function(catname){

        return catInt.getCategoryReference(catname).tag;

    };

    // The names showed in the avaialbles categories panel
    self.catNames = catES.catNames;

    // The identifiers to show for the selected category
    self.catIdentifiers = catES.catIdentifiersShown;

}]);


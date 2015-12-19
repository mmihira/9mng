angular.module('controller.categoryEdit',['service.categoryInterface','service.mainAppLinker','service.categoryEdit',
                'service.databaseInterface']).controller(
'categoryEditController',['catInt','mainAppLinker' , 'categoryEditService','dBInt','$scope',
function(catInt,mAppLn,catES,dBInt,$scope){

    var self = this;

    
    self.hide = mAppLn.hideCategoryEditInterface;

    // The current category clicked by the user
    self.currCatName = catES.currCatName;

    self.catTableEls = catES.catTableEls;

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


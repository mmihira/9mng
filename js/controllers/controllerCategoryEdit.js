angular.module('controller.categoryEdit',['service.categoryInterface','service.mainAppLinker','service.categoryEdit',
                'service.databaseInterface']).controller(
'categoryEditController',['catInt','mainAppLinker' , 'categoryEditService','dBInt','$scope',
function(catInt,mAppLn,catES,dBInt,$scope){

    var self = this;

    
    self.hide = mAppLn.hideCategoryEditInterface;

    // The current category clicked by the user
    self.currCatName = catES.currCatName;

    
    self.newCategory = "";
    self.selectedTag = "";

    // The allowed tags to display in the drop down.
    self.allowedTags = catInt.returnTags();

    // The elements in the category display
    self.catTableEls = catES.catTableEls;


    // Add the newly labeled category to the
    // database
    self.addNewCategory = function(){

        var newCat = catInt.addNewCategory(self.newCategory,"");

        if( newCat == null){

            alert("Not inserted");

        }

        catES.update();



    };

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


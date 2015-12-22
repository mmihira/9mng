angular.module('controller.categoryEdit',['service.categoryInterface','service.mainAppLinker','service.categoryEdit',
                'service.databaseInterface']).controller(
'categoryEditController',['catInt','mainAppLinker' , 'categoryEditService','dBInt','$scope',
function(catInt,mAppLn,catES,dBInt,$scope){

    var self = this;
    
    self.hide = mAppLn.hideCategoryEditInterface;

    // The current category clicked by the user
    self.currCatName = catES.currCatName;
    
    // The name typed in for the new category
    self.newCategory = "";
    // The category identifier selected for the new category
    self.selectedTag = "";
    // The new identifier for the category
    self.newIdentifier = "";


    // The allowed tags to display in the drop down.
    self.allowedTags = catInt.returnTags();

    // The elements in the category display
    self.catTableEls = catES.catTableEls;

    self.yearsInFilter = catES.yearsInFilter;

    self.filterParam = catES.filterParam; 

    // Called when the slider value changes
    self.refreshTable = function(value){

        catES.catTableEls.values = catES.refreshCatTable(value.value[0],value.value[1]);

    }

    
    // Add the newly labeled category to the
    // database
    self.addNewCategory = function(){


        var newCat = catInt.addNewCategory(self.newCategory,self.selectedTag);

        if( newCat == null){

            alert("Not inserted");

        }

        catES.update();

    };

    // Adds the new identifier to the databse
    // This will also recategorise the data
    // and update the category view down the bottom
    self.addNewIdentifier = function(){

        console.log(self.currCatName);
        console.log(self.newIdentifier);

        // Add the new identifier
        catInt.addNewCategoryIdentifier(self.currCatName.value,self.newIdentifier);

        //
        catES.updateIdentifiers(self.currCatName.value);

        self.newIdentifier = "";

    }


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


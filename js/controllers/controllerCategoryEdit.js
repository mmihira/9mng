angular.module('controller.categoryEdit',['service.categoryInterface','service.mainAppLinker','service.categoryEdit',
                'service.databaseInterface','service.Config']).controller(
'categoryEditController',['catInt','mainAppLinker' , 'categoryEditService','dBInt','config','$scope',
function(catInt,mAppLn,catES,dBInt,config,$scope){

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
    self.allowedTags = config.returnTags();

    self.yearsInFilter = catES.yearsInFilter;
    self.filterParam = catES.filterParam; 
    self.hideCategorised = catES.hideCategorised;

    self.tableData = catES.tableData;

    // Called when the slider value changes
    self.refreshTable = function(value){

        var _self = self;

        return function(value){

            _self.tableData.data = catES.getNewCatTable(_self.hideCategorised.value,value.value[0],value.value[1]);

            catES.currentRangeValue.min = value.value[0];
            catES.currentRangeValue.max = value.value[1];

            _self.tableData.change = !_self.tableData.change;

        };

    }();

    self.toggleShowCategorised = function(){

        // Call this instead of the local function to reset the min and max
        catES.refreshCatTable();

    };

    self.reCategoriseAndShow = function(){

        // Recategorise all the data
        dBInt.reCategorise();

        // Refresh the table
        catES.refreshCatTable();

    };

    /**
     * Removes an identifier from the 
     * database
     */
    self.removeIdentifier = function(ident){

        catInt.removeIdentifier(ident); 

        catES.updateIdentifiers(self.currCatName.value);

    };

    
    // Add the newly labeled category to the
    // database
    self.addNewCategory = function(){


        var newCat = catInt.addNewCategory(self.newCategory,self.selectedTag);

        if( newCat == null){

            alert("Not inserted");

        }

        catES.updateCatNames();

    };

    // Adds the new identifier to the databse
    // This will also recategorise the data
    // and update the category view down the bottom
    self.addNewIdentifier = function(){


        // Add the new identifier
        catInt.addNewCategoryIdentifier(self.currCatName.value,self.newIdentifier);

        //
        catES.updateIdentifiers(self.currCatName.value);

        self.newIdentifier = "";

        self.reCategoriseAndShow();

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


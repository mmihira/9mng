/**
 * The category edit service is injected by the categoryEdit controller
 * and the categoryName derective. It contains functions necessary on
 * the category edit page.
 */
angular.module('service.categoryEdit',['service.categoryInterface','service.databaseInterface']).service('categoryEditService',[
'catInt','dBInt',
function(catInt,dBInt){

    var catES = {};

    // The names of the categories on the left panel
    catES.catNames = [];

    // The identyfying strings for the currently selected
    // category
    catES.catIdentifiersShown = [];

    catES.currCatName = {value:""};

    // These are the elements shown in the table
    catES.catTableEls = {values:[]};


    /*
     * Update the identifiers shown.
     * @param   catName     The category to update
     */ 
    catES.updateIdentifiers = function(catName){

        var identifiers = catInt.getCategoryIdentifiers(catName);

        catES.catIdentifiersShown.length = 0;
        identifiers.forEach(function(e){catES.catIdentifiersShown.push(e);});

        catES.currCatName.value = catName;


    };


    /*
     * Called each time the category menu items is clicked.
     * It will update the categor name array
     */
    catES.update = function(){

        catES.catNames.length = 0;

        catES.catIdentifiersShown.length = 0;

        var temp =  catInt.getExistingCategoryNames();

        for( i of temp){

            catES.catNames.push(i);

        }

        catES.catTableEls.values = dBInt.getUncategorised();

    };




    return catES;

}]);


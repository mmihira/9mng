/**
 */
angular.module('service.categoryEdit',['service.categoryInterface']).service('categoryEditService',[
'catInt',
function(catInt){

    var catES = {};

    // The names of the categories on the left panel
    catES.catNames = [];

    // The identyfying strings for the currently selected
    // category
    catES.catIdentifiersShown = [];

    /*
     * Update the identifiers shown.
     * @param   catName     The category to update
     */ 
    catES.updateIdentifiers = function(catName){

        var identifiers = catInt.getCategoryIdentifiers(catName);

        catES.catIdentifiersShown.length = 0;
        identifiers.forEach(function(e){catES.catIdentifiersShown.push(e);});


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

    };




    return catES;

}]);

/**
 */
angular.module('service.categoryEdit',['service.categoryInterface']).service('categoryEditService',[
'catInt',
function(catInt){

    var catES = {};

    // The names of the categories on the left panel
    catES.catNames = [];

    /*
     * Called each time the category menu items is clicked.
     * It will update the categor name array
     */
    catES.update = function(){

        catES.catNames.length = 0;
        var temp =  catInt.getExistingCategoryNames();
        for( i of temp){
            catES.catNames.push(i);
        }

    };




    return catES;

}]);


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
    catES.tableData = {change:false, data:[]};

    catES.yearsInFilter = [];


    catES.filterParam = {
            minString:"",
            maxString:"",
            minValue:"5",
            maxValue:"100",
            id:"test"};

    // Setup the filter
    catES.setupFilter = function(){

        var unCategorised = dBInt.getUncategorised();

        // sort the data
        unCategorised.sort(function(a,b){ return a.date.getTime() - b.date.getTime();})

        catES.filterParam.minValue = unCategorised[0].date.getTime();
        catES.filterParam.maxValue = unCategorised[unCategorised.length-1].date.getTime();

        catES.filterParam.minString = unCategorised[0].date.toLocaleDateString();
        catES.filterParam.maxString = unCategorised[unCategorised.length-1].date.toLocaleDateString();

       

    };




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

    /**
     * Called when the category page is exited.
     * Clears up watches so we don't slow down the
     * rest of the application
     */
    catES.onExit = function(){



    }

    /**
     * Refreshes the category table to include
     * only those that fit inbetween the arguments.
     * 
     */
    catES.refreshCatTable = function(min,max){

        if (typeof min == 'undefined' || typeof max == 'undefined') {

            return dBInt.getUncategorised().sort(function(a,b){return a.date.getTime() - b.date.getTime();});

        }else{

            var temp = dBInt.getUncategorised();

            return temp.filter(function(el){ return (el.date.getTime() <= max) && (el.date.getTime() >= min);})
                       .sort(function(a,b){return a.date.getTime() - b.date.getTime();});

        }

    }


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

        catES.tableData.data = catES.refreshCatTable();
        catES.tableData.change = !catES.tableData.change;

        // Clear the  year array
        catES.yearsInFilter.length = 0;
        // Repopulate the year array
        dBInt.getAvailableYears().forEach(function(e){catES.yearsInFilter.push(e);});

        catES.setupFilter();

    };




    return catES;

}]);


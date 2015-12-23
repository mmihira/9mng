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
    catES.hideCategorised = {value:false};
    catES.currentRangeValue = {min:0,max:0};

    catES.filterParam = {
            minString:"",
            maxString:"",
            minValue:"5",
            maxValue:"100",
            id:"test"};

    // Setup the filter
    catES.setupFilter = function(hideCategorised){

        var data = [];

        if(hideCategorised){

            data = dBInt.getUncategorised();

        }else{

            data = dBInt.getAllData();

        }

        // sort the data
        data.sort(function(a,b){ return a.date.getTime() - b.date.getTime();})

        catES.filterParam.minValue = data[0].date.getTime();
        catES.filterParam.maxValue = data[data.length-1].date.getTime();

        catES.filterParam.minString = data[0].date.toLocaleDateString();
        catES.filterParam.maxString = data[data.length-1].date.toLocaleDateString();

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
    catES.getNewCatTable = function(hideCategorised,min,max){

        var data = [];

        if( hideCategorised){


            data = dBInt.getUncategorised();


        }else{


            data = dBInt.getAllData();


        }

        if (typeof min == 'undefined' || typeof max == 'undefined') {

            return data.sort(function(a,b){return a.date.getTime() - b.date.getTime();});

        }else{

            return data.filter(function(el){ return (el.date.getTime() <= max) && (el.date.getTime() >= min);})
                       .sort(function(a,b){return a.date.getTime() - b.date.getTime();});

        }

    };

    /**
     * Run when the user clicks the
     * showOnlyCategorised Tickbox 
     */
    catES.refreshCatTable = function(){


        // Reset the min and max
        catES.setupFilter(catES.hideCategorised.value);

        // Reset the table data
        catES.tableData.data = catES.getNewCatTable(catES.hideCategorised.value,
                                                    (catES.currentRangeValue.min == 0 ) ? undefined : catES.currentRangeValue.min,
                                                    (catES.currentRangeValue.max == 0 ) ? undefined : catES.currentRangeValue.max);

        // Tell the directive to reload the table
        catES.tableData.change = !catES.tableData.change;

    };

    catES.updateCatNames = function(){

        catES.catNames.length = 0;

        catES.catIdentifiersShown.length = 0;

        var temp =  catInt.getExistingCategoryNames();

        for( i of temp){

            catES.catNames.push(i);

        }

    }


    /*
     * Called each time the category menu items is clicked.
     * It will update the categor name array
     */
    catES.initialise = function(){

        catES.updateCatNames();

        // Setup the table data
        catES.tableData.data = catES.getNewCatTable(false);
        catES.tableData.change = !catES.tableData.change;

        // Clear the  year array
        catES.yearsInFilter.length = 0;
        // Repopulate the year array
        dBInt.getAvailableYears().forEach(function(e){catES.yearsInFilter.push(e);});

        catES.setupFilter(true);

    };





    return catES;

}]);


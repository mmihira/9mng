/**
 */
angular.module('service.balanceSheet',
        ['service.databaseInterface','service.Config','service.categoryInterface']).service('balanceSheet',
        ['dBInt','config','catInt',function(dBInt,config,catInt){

    var balS = {};

    balS.updateTable = {value:false};
    balS.data = {data:[],dates:[]};


    /**
     * This function updates the service variables  bals.updateTable and bals.data
     * bals.data looks like {data:[Object,Object,..],dates[Date Object, Date Object,...]}
     *
     * The date objects in bals.data.dates are the months in the column, that is they are the
     * last 4 months in which data is available.
     *
     * The  Objects in bals.data.data look like :
     *  { tag:[{category1:[v11,..v1f]},...{category2:[v21,..v2f]}]
     *  Here tag is one of the categorty tags. Each tag contains an array of objects which look like
     *  {category1:[v11,..v1f]}. Here category belongs to tag. v is a float value. The ordering of
     *  v corresponds in order extactly to the dates in bals.dates. That is v11 here is the sum of all
     *  transactions of bals.data.dates[0] under category1 which belongs to the tag key.
     *
     */
    balS.updateData = function(){

        // workout the dates
        // Get the last 5 months
        var dates = dBInt.getLastNYearMonthsDates(4,['SAVER','NETBANK']);
        var accounts = config.returnAccountNames();

        var tempData = [];
        var tempObject = {};
        var currentRef = {};
        var currentCatRef = {};
        var tempValue = {};
        // An array of database Elements
        var tempElArray = [];
        var sign = null;
        // An array of strings which are category names belonging to a specific tag.
        var categoryArrays = [];

        for( var tagName of config.returnTags().filter(function(x){return x !='Internal';}) ){

            tempObject = {};
            tempObject[tagName] = [];
            tempData.push(tempObject);

            // Get a reference to the data for this tag. Just for clode clarity
            currentRef = tempData[tempData.length -1][tagName];

            // We will look at all categories. Later on modify for specific selections.
            categoryArrays = catInt.getCategoryNameByTag(tagName);
            categoryArrays.push("No Category");
            for(var catName of categoryArrays ){

                tempObject = {};
                tempObject[catName] = [];
                currentRef.push(tempObject);

                currentCatRef = currentRef[currentRef.length -1][catName];

                for(var date of dates){

                    tempValue = new BigDecimal("0.0");

                    for(var acc of accounts){

                        if( catName == "No Category" ){
                           // Handle the case where transactions have no categories
                           if(tagName == 'Expenditure'){
                               sign = 'negative';
                           }else if (tagName == "Income"){
                               sign = 'positive';
                           }

                            tempElArray = dBInt.filterData([date.getFullYear()],[date.getMonth()],acc,true,{sign:sign,incCat:[catName]});

                        }else{
                            tempElArray = dBInt.filterData([date.getFullYear()],[date.getMonth()],acc,false,{incCat:[catName]});
                        }

                        // Consider adding in check code to ensure transactions are of the same sign.

                        for(var el of tempElArray){

                            // Sum up the transactions for each month.
                            tempValue = tempValue.add(el.value); 
                        }

                    }

                    currentCatRef.push(Math.abs(tempValue.floatValue().toFixed(0)));

                }

            }

        }

        balS.data.data = tempData;
        balS.data.dates =  dates;

    };




    return balS;

}]);

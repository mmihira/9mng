/**
 */
angular.module('service.balanceSheet',
        ['service.databaseInterface','service.Config','service.categoryInterface']).service('balanceSheet',
        ['dBInt','config','catInt',function(dBInt,config,catInt){

    var balS = {};

    balS.updateTable = {value:false};
    balS.data = {data:[],dates:[]};


    /**
     * Returns the data structure which is assigned to bals.data
     */
    balS.updateData = function(){

        // workout the dates
        // Get the last 5 months
        var dates = dBInt.getLastNYearMonthsDates(4,['SAVER','NETBANK']);
        var accounts = config.returnAccountNames();

        // Returned data must be of format
        //  [ { tag:[{category1:[v11,..v1f]},...{category2:[v21,..v2f]}] },
        //  ....]
        var tempData = [];
        var tempObject = {};
        var currentRef = {};
        var currentCatRef = {};
        var tempValue = {};
        var tempElArray = [];
        var sign = null;
        var categoryArrays = [];

        for( var tagName of config.returnTags().filter(function(x){return x !='Internal';}) ){

            tempObject = {};
            tempObject[tagName] = [];
            tempData.push(tempObject);

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
                           if(tagName == 'Expenditure'){
                               sign = 'negative';
                           }else if (tagName == "Income"){
                               sign = 'positive';
                           }

                            tempElArray = dBInt.filterData([date.getFullYear()],[date.getMonth()],acc,true,{sign:sign,incCat:[catName]});

                        }else{
                            tempElArray = dBInt.filterData([date.getFullYear()],[date.getMonth()],acc,false,{incCat:[catName]});
                        }

                        for(var el of tempElArray){

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

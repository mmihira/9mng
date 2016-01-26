/**
 * Responsible for creation of the cashflow chart
 */
angular.module('service.netCashFlow',['service.databaseInterface']).service('netCashFlow',['dBInt',function(dBInt){

    var netCF = {};

    netCF.data = {value:[]};
    netCF.updateChart = {value:false};

    netCF.createNetCashFlow = function(){

        var years = [2015];
        var months = [0,1,2,3,4,5,6,7,8,9,10,11];
        var dataMap = {};
        var dataDateMap = {};
        var dataFinal = [];
        var accs = ['SAVER','NETBANK','GOAL'];

        for( var acc of accs){

            dataMap[acc]=  dBInt.filterData(years,['all'],acc,true,{incTag:['Income','Expenditure']});

        }

        console.log(dataMap);

        for (var yr of years ){
            dataDateMap[yr] = {};
            for( var mn of months){
                dataDateMap[yr][mn] = new BigDecimal("0.0");

            }
        }

        var tmpValRef = {};
        Object.keys(dataMap).forEach(function(key){
            dataMap[key].forEach(function(val){

                tmpValRef = dataDateMap[val.date.getFullYear()][val.date.getMonth()];
                dataDateMap[val.date.getFullYear()][val.date.getMonth()] = tmpValRef.add(val.value);

            });
        });
        

        Object.keys(dataDateMap).sort(function(a,b){return parseInt(a) - parseInt(b) ;}).forEach(function( yr ){

            Object.keys(dataDateMap[yr]).sort(function(c,d){return parseInt(c)-parseInt(d);}).forEach(function(mn){

                dataFinal.push( { name: yr+'-'+ String(parseInt(mn) + 1) , value: dataDateMap[yr][mn].floatValue() } );

            });

        });

        console.log(dataFinal);

        netCF.data.value = dataFinal;

   };

    return netCF;

}]);

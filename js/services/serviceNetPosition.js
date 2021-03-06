/**
 * Responsible for creation of the Net Position chart
 */
angular.module('service.netPosition',['service.databaseInterface']).service('netPosChart',['dBInt',function(dBInt){

    var netPos = {};

    netPos.data = {value:[]};
    netPos.updateChart = {value:false};

    netPos.createNetPosData = function(){

        // Get the latest year
        var yearsAvail = dBInt.getAvailableYears();
        // Sort in ascending
        yearsAvail.sort(function(a,b){return a - b;});
        // Get latest year possible
        var years = [yearsAvail[yearsAvail.length-1]];

        var months = [0,1,2,3,4,5,6,7,8,9,10,11];
        var dataMap = {};
        var dataFinal = [];
        var accs = ['SAVER','NETBANK','GOAL'];
        var tmpVal = [];

        for (var yr of years ){

            dataMap[yr]= {};

            for( var mn of months){

                tmpVal = [];

                for( var acc of accs){

                    tmpVal.push( dBInt.getLastTransaction(yr,mn,acc) );
                }

                dataMap[yr][mn] = tmpVal
                    .map(function(el){ if( el !== null)
                                       {return el.balance;}
                                       else
                                       {return new BigDecimal("0.0");} 
                                     })
                    .reduce(function(prev,curr){ return prev.add( curr );})
                    .floatValue();

            }

        }

        

        Object.keys(dataMap).sort(function(a,b){return parseInt(a) - parseInt(b) ;}).forEach(function( yr ){

            Object.keys(dataMap[yr]).sort(function(c,d){return parseInt(c)-parseInt(d);}).forEach(function(mn){

                dataFinal.push( { name: yr+'-'+ String(parseInt(mn) + 1) , value: dataMap[yr][mn] } );

            });

        });

        netPos.data.value = dataFinal;

   };

    return netPos;

}]);

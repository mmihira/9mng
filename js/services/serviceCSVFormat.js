
angular.module('service.CSVFormat',[]).service('CSVFormat',function(){

    var csvF = {};

    csvF.catTypeStart = "%catstart";
    csvF.catTypeEnd = "%catend";
    csvF.catValStart = "%catvatstart";
    csvF.catValEnd = "%catvalend";

    csvF.catOutFormat = {
        catName : 0,
        catTag : 1,
        catIdent : 0,
        catIdentName : 1

    };


    /*

    csvF.dataOutFormat = {
        acc:0,
        id:1,
        day:2,
        month:3,
        year:4,
        description:5,
        value:6,
        balance:7,
        category:9
    };

    //*/

    csvF.dataOutFormat = {
        acc:0,
        day:1,
        month:2,
        year:3,
        description:4,
        value:5,
        balance:6,
        category:7
    };


    csvF.getNoColsReqForElementCSV = function(){

        var sorted = Object.keys(csvF.dataOutFormat)
                            .map(function(e){return csvF.dataOutFormat[e];})
                            .sort(function(a,b){return a -b;});

        return sorted[sorted.length -1];

    };

    return csvF;

});


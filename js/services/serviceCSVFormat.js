
angular.module('service.CSVFormat',[]).service('CSVFormat',function(){

    var csvF = {};

    csvF.catTypeStart = "%catstart";
    csvF.catTypeEnd = "%catend";
    csvF.catValStart = "%catvatstart";
    csvF.catValEnd = "%catvalend";

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

    return csvF;

});


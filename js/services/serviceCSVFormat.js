
angular.module('service.CSVFormat',[]).service('CSVFormat',function(){

    var csvF = {};

    csvF.catTypeStart = "%catstart";
    csvF.catTypeEnd = "%catend";
    csvF.catValStart = "%catvatstart";
    cavF.catValEnd = "%catvalend";

    csvF.dataOutFormat = {
        acc:0,
        id:1,
        day:2,
        month:3,
        year:4,
        shortDescript:5,
        value:6,
        balance:7,
        description:8,
        category:9
    };

});


/**
 * Holds the format in which data in the database will be output
 * to a CSV file.
 *
 */
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

    // Chaiging csvF will only change how the data is read.
    // The data is written by the CSVWriter and dataOutFormat
    // is actuallly not consulted in the writing process.
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


    /**
     * Returns the no of columsn required when writing
     * a database element to file. Not currently used in
     * any other functions.
     */
    csvF.getNoColsReqForElementCSV = function(){

        var sorted = Object.keys(csvF.dataOutFormat)
                            .map(function(e){return csvF.dataOutFormat[e];})
                            .sort(function(a,b){return a -b;});

        return sorted[sorted.length -1];

    };

    return csvF;

});


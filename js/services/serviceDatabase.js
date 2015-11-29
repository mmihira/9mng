/**
 * Databaseconfig service contains all memeber variables related to the
 * the configuration of the database as well as memeber functions for 
 * editing/modifying the datastored.
 * Function here are :
 *  - createDatabaseElement
 *  - addToDataBaseFromFile
 *
 */
angular.module('service.database',['service.databaseElement']).service('dB',function(dBElement){

    var dB =  {};

    dB.allData = [];

    dB.dMap = {};

    dB.typeOfAccounts = ['EveryDaySmart','GoalSaver','NetBankSaver'];

    dB.rawDataFormat = {
                        date:0,
                        value:1,
                        description:2,
                        balance:3
    };

    /*
     * This function is called after creating a new DataBaseElement using the
     * constructor dBElement.createDatabaseElement. This function transforms the 
     * raw data into a fully fleshed DataBaseElement. Also note that the 
     * original values are deferenced. 
     */
    dB.tranformRawDataRow = function(row){


    };


    /**
     * @param   data        This is the result return from the papaparse
     *                      parse function.
     * @param   account     The account type of interest.
     */
    dB.addToDataBaseFromFile = function(dataWrapper,account){
        data = dataWrapper.data;

        for(var fileRow of data){
            // Create a new database Element
            // The column of the csv data is specied in the variable dB.rawDataFormat
            var tempRow = new dBElement.createDatabaseElement({
                        date: fileRow[dB.rawDataFormat.date] ,
                        value: fileRow[dB.rawDataFormat.value] ,
                        description: fileRow[dB.rawDataFormat.description] ,
                        balance: fileRow[dB.rawDataFormat.balance] 
                     },
                     false);

            console.log(tempRow);

            // Transform into proper database format
            



        }

    };

    return dB;
});

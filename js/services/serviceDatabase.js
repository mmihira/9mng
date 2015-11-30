/**
 * Databaseconfig service contains all memeber variables related to the
 * the configuration of the database as well as memeber functions for 
 * editing/modifying the datastored.
 * Function here are :
 *  - addToDataBaseFromFileNew
 *  - addToDataBaseFromfileExisting
 *  - tranformRawdataRow
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

        var newDate = Date.parse(row.rawDate);
        if( newDate == NaN ){ 
            throw new Error("Bad Date Format");
        }

        row.value = new BigDecimal(row.rawValue); 
        row.balance = new BigDecimal(row.rawBalance);
        row.description = row.rawDescription.replace(/\s+/g, " ");
        row.date = new Date(newDate);


    };

    /**
     *
     */
    db.addToDataBaseFromfileExisting = function(dataWrapper){
        var data = dataWrapper.data;

    }

    /**
     * @param   data        This is the result return from the papaparse
     *                      parse function.
     * @param   account     The account type of interest.
     * @param   addLog      Is a function called to add messages to a running log
     *                      
     */
    dB.addToDataBaseFromFileNew = function(dataWrapper,account,addLog){

        var data = dataWrapper.data;

        var tempDataVec = [];

        for(var fileRow of data){

            // Remove any rows with no data
            // We will not raise an error and instead let
            // the ledger balance check to run
            if(
                fileRow[dB.rawDataFormat.date] == "" |
                fileRow[dB.rawDataFormat.value] == "" |
                fileRow[dB.rawDataFormat.description] == "" |
                fileRow[dB.rawDataFormat.balance] == "" )
            {
                addLog("Empty row found and ignored");
                continue;
            }

            // Create a new database Element
            // The column of the csv data is specied in the variable dB.rawDataFormat
            var tempRow = new dBElement.createDatabaseElement({
                        date: fileRow[dB.rawDataFormat.date] ,
                        value: fileRow[dB.rawDataFormat.value] ,
                        description: fileRow[dB.rawDataFormat.description] ,
                        balance: fileRow[dB.rawDataFormat.balance] 
                     },
                     false);

            // Transform the raw value into database types
            dB.tranformRawDataRow(tempRow);

            tempDataVec.push(tempRow);

        }

        // Check that the data provided itself is internally consistent
        // That is the data is correctly ordered in the ledger
        var balance = true;
        for(var i = 1; i < tempDataVec.length; i ++){
            // compareTo returns 0 if equal
            if(tempDataVec[i-1].balance.compareTo(tempDataVec[i].balance.subtract(tempDataVec[i].value))){
                balance = false;
            }
        }
        if(!balance){
            // Try finding balance in reverse order
            balance = true;
            for(var i = 0; i < (tempDataVec.length-1); i ++){
                // compareTo returns 0 if equal
                if(tempDataVec[i+1].balance.compareTo(tempDataVec[i].balance.subtract(tempDataVec[i].value))){
                    balance = false;
                }
            }
        }

        if(!balance){
            addLog("Data uploaded was not a balanced ledger");
            return;
        }else{
            addLog("Data uploaded was a balanced ledger");
        }



    };

    return dB;
});

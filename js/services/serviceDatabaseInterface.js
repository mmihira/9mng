/**
 * databaseinserface service contains all function which
 * make use of or modify the database. Note that this
 * module will inject the database module
 * Functions included are :
 *  - addToDataBaseFromFileNew
 *  - addToDataBaseFromfileExisting
 *  - tranformRawdataRow
 *
 */
angular.module('service.databaseInterface',['service.database','service.databaseElement']).service('dBInt',
        ['dB','dBElement',function(dB,dBElement){

    var dBInt = {};

    /*
     * This function is called after creating a new DataBaseElement using the
     * constructor dBElement.createDatabaseElement. This function transforms the 
     * raw data into a fully fleshed DataBaseElement. Also note that the 
     * original values are deferenced. 
     */
    dBInt.tranformRawDataRow = function(row){

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
    dBInt.addToDataBaseFromfileExisting = function(dataWrapper,addLog){

        var data = dataWrapper.data;

        /**************************************************************/
        /* Process the category type Data */
        /**************************************************************/

        var catendreached = false;
        var catcounter = 0;
        var z = 0;
        
        while(catendreached === false){

            if (data[z][0] === "%catend")
            {
                catendreached = true;
            }
            else
            {
                //_glbl.cat_db[data[z][0]] = _glbl.catg.createNewCat(data[z][0],data[z][1]);
                catcounter++;
                
            }
            z++;
        }

        /**************************************************************/
        /* Process the category Value Data*/
        /**************************************************************/

        //Ignore the %catvalstart 
        var catvalendreached = false;
        z++;
        
        // While not reached the end of category data, add any user categories.
        while(catvalendreached === false)
        {
            // Remove when debugging not required.
            console.log(data[z]);
            
            // Reached the end of the user category data.
            if (data[z][0] === "%catvalend")
            {
                z++;
                catvalendreached = true;
            }
            else
            // Add to the user category to the database.
            {
                //_glbl.cat[data[z][0]] = _glbl.cat_db[data[z][1]];
                //catvalcounter++;
                z++;
            }
            // Remove when debugging not required.
        }

        /**************************************************************/
        /* Process the database data  */
        /**************************************************************/





    }

    /**
     * @param   data        This is the result return from the papaparse
     *                      parse function.
     * @param   account     The account type of interest.
     * @param   addLog      Is a function called to add messages to a running log
     *                      
     */
    dBInt.addToDataBaseFromFileNew = function(dataWrapper,account,addLog){

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

    return dBInt;

}]);


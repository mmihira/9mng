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
angular.module('service.databaseInterface',['service.database','service.databaseElement','service.CSVFormat','service.customDateParser']).service('dBInt',
        ['dB','dBElement','CSVFormat','customDateParser',function(dB,dBElement,csvF,cDate){

    var dBInt = {};

    /*
     * This function is called after creating a new DataBaseElement using the
     * constructor dBElement.createDatabaseElement. This function transforms the 
     * raw data into a fully fleshed DataBaseElement. Also note that the 
     * original values are deferenced. 
     */
    dBInt.tranformRawDataRow = function(row){

        row.value = new BigDecimal(row.rawValue); 
        row.balance = new BigDecimal(row.rawBalance);
        row.description = row.rawDescription.replace(/\s+/g, " ");
        row.date = cDate.parseCom(row.rawDate);


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
        z++;
        var catvalendreached = false;

        // While not reached the end of category data, add any user categories.
        while(catvalendreached === false)
        {
            
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

        var endOfFile = false;
        var tempRow = {};
        var tempDatabaseElement = {};
        var dataCount = 0;

        while(!endOfFile){

            if(data[z][0] == ""){

                endOfFile = true;

            }else{

                

                tempRow.date = new Date(data[z][csvF.dataOutFormat.year],
                                       data[z][csvF.dataOutFormat.month],
                                       data[z][csvF.dataOutFormat.day],
                                       0,0,0);

                tempRow.acc = data[z][csvF.dataOutFormat.acc];
                tempRow.id = data[z][csvF.dataOutFormat.id];
                tempRow.description = data[z][csvF.dataOutFormat.description];
                tempRow.value = new BigDecimal(data[z][csvF.dataOutFormat.value]);
                tempRow.balance = new BigDecimal(data[z][csvF.dataOutFormat.balance]);
                tempRow.category = data[z][csvF.dataOutFormat.category];

                tempDatabaseElement = new dBElement.createDatabaseElement(tempRow,true);

                if (dB.dMap.hasOwnProperty(tempRow.acc) === false)
                {
                    dB.dMap[tempRow.acc] = {};
                    addLog("Created account : "+ tempRow.acc + " in database.")
                }

                if (dB.dMap[tempRow.acc].hasOwnProperty(tempRow.date.getFullYear()) === false)
                {
                    // Add the year
                    dB.dMap[tempRow.acc][tempRow.date.getFullYear()] = {};            
                }

                if (dB.dMap[tempRow.acc][tempRow.date.getFullYear()].hasOwnProperty(tempRow.date.getMonth()) === false)
                {
                    // add the month
                    dB.dMap[tempRow.acc][tempRow.date.getFullYear()][tempRow.date.getMonth()] = {data:[]};            
                }

                //  Add the new row to the date map
                dB.dMap[tempRow.acc][tempRow.date.getFullYear()][tempRow.date.getMonth()].data.push(tempDatabaseElement);
                
                // Add the new row to the vector storage
                dB.allData.push(tempDatabaseElement);

                dataCount++;

            }

            z++;
        }

        addLog(dataCount + " entries added to database.");

    };

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

        console.log("Hello");

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
                        balance: fileRow[dB.rawDataFormat.balance],
                        acc: account
                     },
                     false);

            // Transform the raw value into database types
            dBInt.tranformRawDataRow(tempRow);

            tempDataVec.push(tempRow);

        }

        // Check that the data provided itself is internally consistent
        // That is the data is correctly ordered in the ledger
        var balance = true;

        var reverse = false;
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
                if(tempDataVec[i].balance.compareTo(tempDataVec[i+1].balance.add(tempDataVec[i].value))){
                    balance = false;
                }
            }

            if(balance){reverse = true;}
        }

        // Reverse the data if the balance was found in revese order
        // This is because we need the data in ascending order by date
        if(reverse){ tempDataVec.reverse();}

        if(!balance){
            addLog("Data uploaded was not a balanced ledger");
            return;
        }else{
            addLog("Data uploaded was a balanced ledger");
        }

        // Find any instances of overlapping data
        // If the first entry is allready in the database
        // then we need to find if there is an overlap.
        // If the first entry is not in the database then
        // then none of the following entries can overlap
        var startOfInput = 0;
        if(dBInt.findMatching(tempDataVec[0]) == null){

            // None of the data to be input is allready in the database

        }else{

            // Find the extent of the overlap
            for (var i = 0 ; i < tempDataVec.length; i++){
                if(dBInt.findMatching(tempDataVec[i]) != null ){
                    // Not null means that the data allready exists
                    startOfInput++;
                }
            }
        }

        if(startOfInput == tempDataVec.length){
            addLog("All data currently exists in database");
            return;
        }

        // If the first element to be added conserves the balance
        // in the database then we can add all the data. This is because
        // the data interally allready balances
        var lastAddedData = dBInt.getLastDataAdded(account);
        if(lastAddedData == null)
        {
            addLog("Specified account does not exist in database.");
            return;
        }

        var firstValRef = tempDataVec[startOfInput];

        if(lastAddedData.ref.balance.compareTo(firstValRef.balance.subtract(firstValRef.value))){
            addLog("Data to be added did not balance in database");
            return;
        }else{
            addLog("Data balanced correctly in database");
        }

    };

    /**
     * Returns a reference to the last data added to the
     * database in a given account. If the account doesn't
     * exists a null object is returned. If the account 
     * exists then one value must exist in the object. So
     * we don't check to see whether there are no years, or months,
     * or data.
     *
     * @param   acc     The account from which to get the last
     *                  object added.
     * @return  
     * Returns an object :
     * {ref:  A reference to the last object added],
     *  date: A date object of the last object added} 
     *
     */
    dBInt.getLastDataAdded = function(acc){

        if( dB.dMap.hasOwnProperty(acc) == false ){
            return null;
        }

        var years = Object.keys(dB.dMap[acc]).map(function(x){ return parseInt(x);})
        var maxYear = Math.max(...years);

        var months = Object.keys(dB.dMap[acc][maxYear]).map(function(x){ return parseInt(x);})
        var maxMonth = Math.max(...months);

        var dBElref = dB.dMap[acc][maxYear][maxMonth].data;
        var dataRef = dBElref[dBElref.length -1];
        
        return {ref:dataRef, date:dataRef.date};

    };
    
    /**
     * Returns a reference to an entry in the database if it exists.
     * A reference exists in the database if the date,value,balance,
     * and description all match.
     * @param   toMatch     A fully formed serviceDatabaseElement.
     *                      The category attribute will be ignored.
     * @return  ref         An object {ref: A reference to the matched
     *                      data} or null if no match could be found.
     */
    dBInt.findMatching = function(toMatch){

        var year = toMatch.date.getFullYear();
        var month = toMatch.date.getMonth();

        if( !dB.dMap.hasOwnProperty(toMatch.acc)){
           return null;
        } 


        if( !dB.dMap[toMatch.acc].hasOwnProperty(year) ){
            return null;
        }
        
        if( !dB.dMap[toMatch.acc][year].hasOwnProperty(month) ){
            return null;
        }


        // Now serch for the data in the list
        var dBref =   dB.dMap[toMatch.acc][year][month];

        for( var i of dBref.data ){


            if( i.description == toMatch.description  &&
                (!i.value.compareTo(toMatch.value)) &&
                (!i.balance.compareTo(toMatch.balance)) &&
                i.date.getDay() == toMatch.date.getDay()
              ){
                  return {ref:i};
              }
        }

        return null;
    };

    /**
     * Validates that the entire database is correctly balanced
     * @param   Acc     The account on which to check balance
     * @return          True if correctly balanced false otherwise
     */
    dBInt.checkDatabaseBalance = function(acc){

    };


    return dBInt;

}]);


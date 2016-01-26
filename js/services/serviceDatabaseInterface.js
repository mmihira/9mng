/**
 * databaseinserface service contains all function which
 * make use of or modify the database. Note that this
 * module will inject the database module
 * Functions included are :
 *  - tranformRawdataRow
 *  - addToDataBaseFromFileNew
 *  - addToDataBaseFromfileExisting
 *  - addElementToDatabase
 *  - getLastDataAdded
 *  - findMatching
 *  - checkDatabaseBalance
 *  - filterData
 *  - getCategoryOfEl
 *  - getUncategorised
 *  - getAvailableYears
 *  - getLastNYearMonthsDates
 *  - reCategorise
 *  - getLastTransaction
 *  - createNewAccount
 */
angular.module('service.databaseInterface',
        ['service.database','service.databaseElement','service.CSVFormat',
        'service.customDateParser','service.categoryClass','service.categoryInterface','service.Config']).service('dBInt',
        ['dB','dBElement','CSVFormat','customDateParser','categoryClass','catInt','config',
        function(dB,dBElement,csvF,cDate,catClass,catInt,config){

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

        // prevent click twice
        if( dB.allData.length > 0 || Object.keys(dB.dMap).length > 0){
            addLog("Data all ready existing in database");
            return null;
        }


        var data = dataWrapper.data;

        /**************************************************************/
        /* Process the category type Data */
        /**************************************************************/


        var accStart = false;
        var accEnd = false;
        var catendreached = false;
        var catStart = false;
        var catcounter = 0;
        var z = 0;


        // Find the account names first
        while(accStart === false){

            if(data[z][0] === "%accStart"){

                accStart = true;
                z++;

            }else{

                z++;

            }
        }

        while(accEnd === false){

            if (data[z][0] === "%accEnd")
            {
                accEnd = true;
                z++;
            }
            else
            {
                // Add the acc to the config file
                config.accountNames.value.push(data[z][0]);
                z++;
                
            }
        }

        // find catstart first
        while(catStart === false){
            if(data[z][0] === "%catstart"){

                catStart = true;

            }else{

                z++;

            }
        }
        
        while(catendreached === false){

            z++;

            if (data[z][0] === "%catend")
            {
                catendreached = true;
                z++;
            }
            else
            {
                // Add the new category to the database
                catInt.addNewCategory(data[z][csvF.catOutFormat.catName],
                                      data[z][csvF.catOutFormat.catTag]);
                catcounter++;
                
            }
        }


        /**************************************************************/
        /* Process the category Value Data*/
        /**************************************************************/

        //Ignore the %catvalstart 
        z++;
        var catvalendreached = false;
        var catIdent = "";
        var catIdentName = "";

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
                 catIdent = data[z][csvF.catOutFormat.catIdent];
                 catIdentName = data[z][csvF.catOutFormat.catIdentName];
                 catInt.addNewCategoryIdentifier(catIdentName,catIdent);
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

            if(data[z][0] === ""){

                endOfFile = true;

            }else{

                

                tempRow.date = new Date(data[z][csvF.dataOutFormat.year],
                                       // Date months start from 0 not from 1
                                       parseInt(data[z][csvF.dataOutFormat.month])-1,
                                       data[z][csvF.dataOutFormat.day],
                                       0,0,0);

                tempRow.acc = data[z][csvF.dataOutFormat.acc];
                tempRow.id = data[z][csvF.dataOutFormat.id];
                tempRow.description = data[z][csvF.dataOutFormat.description];
                tempRow.value = new BigDecimal(data[z][csvF.dataOutFormat.value]);
                tempRow.balance = new BigDecimal(data[z][csvF.dataOutFormat.balance]);
                // If category does not exist then a null reference is returned
                tempRow.category = catInt.getCategoryReference(data[z][csvF.dataOutFormat.category]);

                tempDatabaseElement = new dBElement.createDatabaseElement(tempRow,true);

                dBInt.addElementToDatabase(tempDatabaseElement);
                
                dataCount++;

            }

            z++;
        }

        var a = dB.dMap;

        addLog(dataCount + " entries added to database.");

    };

    /**
     * Adds a fully formed databaseElement object into the database
     * @param   toAdd   The databaseElement to add to the database
     */
    dBInt.addElementToDatabase = function(toAdd){

            if (dB.dMap.hasOwnProperty(toAdd.acc) === false)
            {
                dB.dMap[toAdd.acc] = {};
            }

            if (dB.dMap[toAdd.acc].hasOwnProperty(toAdd.date.getFullYear()) === false)
            {
                // Add the year
                dB.dMap[toAdd.acc][toAdd.date.getFullYear()] = {};            
            }

            if (dB.dMap[toAdd.acc][toAdd.date.getFullYear()].hasOwnProperty(toAdd.date.getMonth()) === false)
            {
                // add the month
                dB.dMap[toAdd.acc][toAdd.date.getFullYear()][toAdd.date.getMonth()] = {data:[]};            
            }

            //  Add the new row to the date map
            dB.dMap[toAdd.acc][toAdd.date.getFullYear()][toAdd.date.getMonth()].data.push(toAdd);
            
            // Add the new row to the vector storage
            dB.allData.push(toAdd);

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

        var tempElementVec = [];

        for(var fileRow of data){

            // Remove any rows with no data
            // We will not raise an error and instead let
            // the ledger balance check to run
            if(
                fileRow[dB.rawDataFormat.date] === "" ||
                fileRow[dB.rawDataFormat.value] === "" ||
                fileRow[dB.rawDataFormat.description] === "" ||
                fileRow[dB.rawDataFormat.balance] === "" )
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

            tempElementVec.push(tempRow);

        }

        // Check that the data provided itself is internally consistent
        // That is the data is correctly ordered in the ledger
        var balance = true;

        var reverse = false;
        for(var i = 1; i < tempElementVec.length; i ++){
            // compareTo returns 0 if equal
            if(tempElementVec[i-1].balance.compareTo(tempElementVec[i].balance.subtract(tempElementVec[i].value))){
                balance = false;
            }
        }

        if(!balance){
            // Try finding balance in reverse order
            balance = true;
            for(var i = 0; i < (tempElementVec.length-1); i ++){
                // compareTo returns 0 if equal
                if(tempElementVec[i].balance.compareTo(tempElementVec[i+1].balance.add(tempElementVec[i].value))){
                    balance = false;
                }
            }

            if(balance){reverse = true;}
        }

        // Reverse the data if the balance was found in revese order
        // This is because we need the data in ascending order by date
        if(reverse){ tempElementVec.reverse();}

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
        if(dBInt.findMatching(tempElementVec[0]) === null){

            // None of the data to be input is allready in the database

        }else{

            // Find the extent of the overlap
            for (var i = 0 ; i < tempElementVec.length; i++){
                if(dBInt.findMatching(tempElementVec[i]) != null ){
                    // Not null means that the data allready exists
                    startOfInput++;
                }
            }
        }

        if(startOfInput === tempElementVec.length){
            addLog("All data currently exists in database");
            return;
        }

        // If the first element to be added conserves the balance
        // in the database then we can add all the data. This is because
        // the data interally allready balances
        var lastAddedData = dBInt.getLastDataAdded(account);
        if(lastAddedData != null)
        {

            var firstValRef = tempElementVec[startOfInput];
            if(lastAddedData.ref.balance.compareTo(firstValRef.balance.subtract(firstValRef.value))){
                addLog("Data to be added did not balance in database");
                return;
            }else{
                addLog("Data balanced correctly in database");
            }
        }else{

            // Check if the account exists or not
            if( dB.dMap.hasOwnProperty(account) === false ){

                addLog("The specified account did not exist !");
                return;
            }else{

                addLog("There was no data in this account. All data will be added.");
            }
        }

        // Now add the data to the database
        var count = 0;
        for(var i = startOfInput; i < tempElementVec.length; i ++){

            catInt.categorise(tempElementVec[i]);
            dBInt.addElementToDatabase(tempElementVec[i]);
            count ++;

        }


        addLog("Added " + count + " of " + tempElementVec.length + " to the database.");
        addLog("Database is balanced ? " + dBInt.checkDatabaseBalance(account));

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

        if( dB.dMap.hasOwnProperty(acc) === false ){
            return null;
        }

        if( Object.keys(dB.dMap[acc]).length === 0 ){
            return null;
        }

        var years = Object.keys(dB.dMap[acc]).map(function(x){ return parseInt(x);});
        var maxYear = Math.max(...years);

        var months = Object.keys(dB.dMap[acc][maxYear]).map(function(x){ return parseInt(x);});
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


            if( i.description === toMatch.description  &&
                (!i.value.compareTo(toMatch.value)) &&
                (!i.balance.compareTo(toMatch.balance)) &&
                i.date.getDay() === toMatch.date.getDay()
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

        if( dB.dMap.hasOwnProperty(acc) === false ){
            return null;
        }


        // Build a list of all the transactions in chronological order
        var tLe = [];

        var years = Object.keys(dB.dMap[acc]).map(function(x){ return parseInt(x);});
        years.sort(function(a,b){return a - b;});

        for(var year of years){

            var months = Object.keys(dB.dMap[acc][year]).map(function(x){ return parseInt(x);});
            months.sort(function(a,b){return a - b;});

            for(var month of months){

                var dBElref = dB.dMap[acc][year][month].data;

                for(var el of dBElref){

                    tLe.push(el);
                }

            }

        }

        var balance = true;

        for (var i = 1; i < tLe.length; i ++){

            // if non zero then not equal
            if(tLe[i-1].balance.compareTo(tLe[i].balance.subtract(tLe[i].value))){
                balance = false;
                break;
            }
        }
                
        return balance;
    };

    /**
     * Returns Database elements based on a number of filters
     * 
     * @param yrs   The years to include as an array. To include
     *              all possible years use ['all'] 
     * @param mn    The months to include. To include all
     *              possible months ['all']
     * @param acc   The account only one can be specified
     *
     * @param dNCat The default behaviour if data has been uncategorised
     *              true to add and false otherwise
     * @param {type} param is a struct with structure
     * {
     *  nIncCat:    an array of category strings which cannot match the category of the data.
     *  incTag:     an array of tags. One of which must match 
     *  incCat :    an array of category strings, only 1 must match to be included
     *  sign:       Either positive of negative.  If positive only transaction with positive values
     *              are included otherwise only negative values.
     * }
     *
     * @return {array}
     *              format is [[str type yr-mnt,BigDecimal,float value],...,]
     *              Only the existing data is returned.
     *  
     */
    dBInt.filterData = function(yrs,mn,acc,dNCat,param)
    {

        var filters = { 
                        'incCat' : (param.hasOwnProperty('incCat')) ? param.incCat : null,
                        'nIncCat' : (param.hasOwnProperty('nIncCat')) ? param.nIncCat : null,
                        'incTag' : (param.hasOwnProperty('incTag')) ? param.incTag : null,
                        'sign'  : (param.hasOwnProperty('sign')) ? param.sign : null
        };

        var data = [];
        
        // The months to filter
        if(mn.length > 0)
        {
            if(mn[0] === "all")
            {
                // The months in the index start from 0 not from 1
                mn = [0,1,2,3,4,5,6,7,8,9,10,11];
            }
        }

        // A variable to hold a temporary reference to the
        // database
        var tdb = {};

        if (dB.dMap.hasOwnProperty(acc))
        {
            tdb = dB.dMap[acc]; 

            if(yrs.length > 0)
            {
                if(yrs[0] === "all"){
                    yrs = Object.keys(dB.dMap[acc])
                            .map(function(x){ return parseInt(x);})
                            .sort(function(a,b){return a - b;});
                }
            }

            // This object stores relevant check parameters
            // If all the values associated with the keys in this
            // object are true then that entry is returned
            var     checkArray = []; 
            var     check = false;
            var     currEl = {};
            var     catRef = {};


            for (var i in yrs)
            {

                if (tdb.hasOwnProperty(yrs[i]))
                {
                    for( var m in mn)
                    {
                        // include the month only if the month is present in the data.
                        if( tdb[yrs[i]].hasOwnProperty(mn[m]))
                        {
                                                        
                            for( var x in tdb[yrs[i]][mn[m]].data)
                            {
                                checkArray = [];
                                check = false;

                                currEl = tdb[yrs[i]][mn[m]].data[x];
                                catRef =  dBInt.getCategoryOfEl(currEl);

                                // If incTag is present at least one tag must match
                                if(filters['incTag'] != null){

                                    if( catRef === null){

                                        checkArray.push( dNCat);

                                    }else{

                                        checkArray.push( ( filters['incTag'].indexOf(catRef.tag) != -1 ) ? true : false );
                                    }

                                }


                                // Look for elements where a must include
                                // category is present
                                if(filters['incCat'] != null){
                                    

                                    if( catRef === null){

                                        checkArray.push( dNCat );

                                    }else{

                                        checkArray.push( (filters['incCat'].indexOf(catRef.name) != -1 ) ? true : false );
                                    }

                                }

                                // Ensure elements doesn't contain
                                // the following categories
                                if(filters['nIncCat'] != null){
                                    

                                    if( catRef === null){

                                        checkArray.push( dNCat );

                                    }else{

                                        checkArray.push( (filters['nIncCat'].indexOf(catRef.name) === -1 ) ? true : false );
                                    }

                                }

                                // Ensure the transaciton matches the sign if specified
                                if(filters['sign'] != null){
                                    
                                    if( filters['sign'] === 'positive'){

                                        if( currEl.value.floatValue() >= 0 ){
                                            checkArray.push(true);
                                        }else{
                                            checkArray.push(false);
                                        }

                                    }else if ( filters['sign'] === 'negative'){
                                        if( currEl.value.floatValue() < 0 ){
                                            checkArray.push(true);
                                        }else{
                                            checkArray.push(false);
                                        }

                                    }
                                }


                                check = checkArray.every(function(e){return e === true;});

                                // If the check value is true then add the element to the
                                // array to return
                                if(check === true){
                                    data.push( currEl);

                                }
                                    
                            }
                        }
                    }
                }
            }
        }

        
        return data;
        
    };

    /**
     * @param   el      The element to look up
     *
     * @return          Returns the category object associated 
     *                  with a particular element. If the element 
     *                  is not categorised then null is  returned.
     */
    dBInt.getCategoryOfEl = function(el){

        if( el.category === null){
            return null;
        }else{

            return el.category; 

        }

    };

    /**
     * Returns an array of references to objects which have no category
     * @return  An array of reference to database objects which have no category
     */
    dBInt.getUncategorised = function(){

        return dB.allData.map(function(e){ 
            if(e.category === null){return e;}else{return null;}
                        }).filter(function(e){ return e != null;});

    };

    /**
     * Return an array of all the data
     */
    dBInt.getAllData = function(){

        return dB.allData.map(function(e){return e;});

    };







    /**
     * Returns the years known by the database.
     * That is in what years does the database hold
     * records of a transaction
     * @return  An array of integers representing the years
     */
    dBInt.getAvailableYears = function(){

        var Years = {};

        Object.keys(dB.dMap).forEach(
                function(e){ 
                    Object.keys(dB.dMap[e]).forEach(
                        function(x){if(!Years.hasOwnProperty(x)){Years[x]=[];}
                                    }
                        );
                }
            );

        return Object.keys(Years);

    };

    /**
     * Get the last N Year/Month values which exist in the database
     * @param   n   The number of year month combinations to return
     * @param   acc Which accounts to consider. If anyone of the accounts
     *              has data for that year-month, then that year-month is returned.
     * @return      an array of dates objects
     */
    dBInt.getLastNYearMonthsDates = function(n, Accs){

        var ret = [];
        var count = 0;
        var Years = dBInt.getAvailableYears(); 
        var Months = [11,10,9,8,7,6,5,4,3,2,1,0];
        var tempDate = {};

        // sort in descending order
        Years.sort(function(a,b){return b-a;});

        for(var acc of Accs){

            for(var year of Years){

                for(var month of Months){

                    if( dB.dMap[acc].hasOwnProperty(year)){

                        if(dB.dMap[acc][year].hasOwnProperty(month) ){

                            tempDate = new Date(year,month,2,0,0,0);
                            if( ret.indexOf(tempDate.getTime()) === -1 && count < n){
                                ret.push(tempDate.getTime());
                                count ++;
                            }

                        }
                    }

                }
            }

        }

        return ret.map(function(e){return new Date(e);});

    };

     /**
     * Recategorises the data overwriting any
     * exisitng categories
     */
    dBInt.reCategorise = function(){

        for( var el of dB.allData ){

            catInt.categorise(el);
        }

    };

    /**
     * For a given year, month and account
     * return the last transaction in the order
     * of the ledger. Used for determining
     * the net position.
     * @return  The element if it exists, and null
     *          otherwise
     */
    dBInt.getLastTransaction = function(year,month,acc){

        var tmp = {};

        if( dB.dMap.hasOwnProperty(acc) ){
            if( dB.dMap[acc].hasOwnProperty(year) ){
                if(dB.dMap[acc][year].hasOwnProperty(month)){

                    tmp = dB.dMap[acc][year][month].data;
                    return tmp[tmp.length -1];

                }else{
                    return null;
                }
            }else{
                return null;
            }
        }else{
            return null;
        }

    };

    /**
     * Return true if the database has been intialised
     * That is if data has been input into the database
     */
    dBInt.hasBeenInit = function(){

        return (dB.allData.length > 0 ) ? true : false ;

    };

    /**
     * Creates a newAccount in the database
     */
    dBInt.createNewAccount = function(acc){

        dB.dMap[acc] = {};

    };


    return dBInt;

}]);


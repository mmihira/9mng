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
angular.module('service.database',[]).service('dB',function(dBElement){

    var dB =  {};

    dB.allData = [];

    dB.dMap = {};

    dB.typeOfAccounts = ['EveryDaySmart','GoalSaver','NetBankSaver'];

    /*
     * rawDataFormat holds key value pairs describing for each key
     * which column (the value) in the raw database which holds
     * that value
     */
    dB.rawDataFormat = {
                        date:0,
                        value:1,
                        description:2,
                        balance:3
    };
    
    return dB;
});

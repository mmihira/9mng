/**
 * The categoryDatabase service holds category data.
 */
angular.module('service.categoryDatabase',['service.categoryClass']).service('catDB',['categoryClass',function(catClass){

    var catDB = {};


    /**
     * The known tags in the program
     */
    catDB.tags = ['Internal','Expenditure','Income'];

    /**
     * Holds categoryClass objects which reperesent unique categories
     * used to identify transactions. catDb.dB is a map where the key
     * is the name of the category and the value is the categoryClass
     * object. Ex {food: Object,...}
     */
    catDB.dB = {};

    /**
     * dBIdentifiers is map where the keys are unqiue strings and the value 
     * is the associated categoryClass object. That is the presense of the
     * string in a description indicates the transaction belongs to the
     * associated category. { 'identyfying string': Object }
     */
    catDB.dBIdentifiers = {};

    return catDB;

}]);

/**
 * The categoryDatabase service holds category data.
 */
angular.module('service.categoryDatabase',['service.categoryClass']).service('catDB',['categoryClass',function(catClass){

    var catDB = {};

    /**
     *
     */
    catDB.dB = {};

    /**
     *
     */
    catDB.dBIdentifiers = {};

}]);

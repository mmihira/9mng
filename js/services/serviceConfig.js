/**
 * Generic utility functions go here.
 * Exampel conversion of dates etc.
 */
angular.module('service.Config',[]).service('config',function(){

    var config = {};

    config.accountNames = {value:[]};

    /**
     * The known category tags in the program
     */
    config.tags = ['Internal','Expenditure','Income'];

    config.returnTags = function(){ return config.tags.map(function(e){return e;});};

    config.returnAccountNames = function(){ return config.accountNames.value.map(function(e){return e;}); };



    return config;

});

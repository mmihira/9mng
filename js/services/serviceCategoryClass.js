/**
 * A categoryClass represents an instancec of a category.
 * This service is purely used to hold the constructor to
 * create a new category. Furthermore there are methods
 * associates with modifying the category.
 */
angular.module('service.categoryClass',[]).service('categoryClass',function(){

    var catClass = {};

    catClass.createNewCategory = function(name){

        this.name = name;
        this.tags = [];
        this.identifiers = [];

    };

    return catClass;

});


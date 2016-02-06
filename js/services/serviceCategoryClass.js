/**
 * A categoryClass represents an instance of a category.
 * This service is purely used to hold the constructor to
 * create a new category. Furthermore there are methods
 * associated with modifying the category.
 */
angular.module('service.categoryClass',[]).service('categoryClass',function(){

    var catClass = {};

    catClass.createNewCategory = function(name,tag,idents){

        if (typeof idents == 'undefined') {
                idents = [];
        }



        this.name = name;
        this.tag = tag;
        this.identifiers = idents;

    };

    return catClass;

});


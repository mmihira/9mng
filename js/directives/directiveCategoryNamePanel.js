/**
 * This directive is an attribute used in the category page.
 * It's sole purpose is to add a click listener which will
 * hide all the other category panels except this one.
 * We do this by injecting service.categoryEdit which has
 * the catES array containing the names of the categories 
 * Panels. We chose to collapse all these panels except the
 * one that was clicked. The directive creates a private
 * scope which holds the name of the corresponding 
 * category.
 *
 */
angular.module("directive.categoryNameAttribute",['service.categoryEdit']).directive("categoryName", [ 'categoryEditService', function(catES){
    return {

        restrict: "A",

        scope : {name : "@name"},

        link: function(scope,element,attr){
            
            element.on('click',
                function(){
                    // Create a closure to avoid confusion with name variables
                    var _scope = scope;
                    var _catES = catES;
                    var _thisName = scope.name;

                    return function(){

                        _scope.$apply(function(){
                            
                            // Get a reference to all other categoryName panels
                            // and collapse them. Not including the current
                            // categoryName. We know the id of the collapsible 
                            // panel because they are formatted like "collapse<name>"
                           _catES.catNames
                                .filter(function(e){ return e != _thisName;})
                                .forEach( function(e){

                                    $("#collapse"+e).collapse('hide');
                                
                            });

                            // Update the identifiers shown
                            _catES.updateIdentifiers(_thisName);
                            
                        });

                    };

                }());
        }
    };
}]);

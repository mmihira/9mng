/**
 *
 */
angular.module("directive.date.filter",['service.downloadFormService']).directive("dateFilter", [ 'downloadFormService', function(dlFormServ){
    return {

        restrict: "E",
        // We want access to the parent scope so we can put the variables there
        scope : {
            filterParam: '=',
            id : "@",
            onChange : "="
        },

        template: "<b>{{filterParam.minString}}</b> <input id=\"{{id}}filter\" type=\"text\" class=\"span2\" value=\"\" data-slider-min=\"{{filterParam.minValue}}\" data-slider-max=\"{{filterParam.maxValue}}\" data-slider-step=\"1\" data-slider-value=\"[{{filterParam.minValue}},{{filterParam.maxValue}}]\"/> <b>{{filterParam.maxString}}</b>",

        link: function(scope,element,attr){

            // Need to wait for the element to be fully added to the dom before we finnaly initialise it.
            element.ready(
                function(){
                    $("#" + scope.id+"filter").slider({

                   formatter: function(value) {

                                var min = new Date(value[0]);
                                var max = new Date(value[1]);
                                
		                        return min.toLocaleDateString() + " to " + max.toLocaleDateString();
	                        } 
                    
                    
                    });


                    $("#" + scope.id+"filter").slider().on('slide',function(){
                        var _onChange = scope.onChange;
                        var _scope = scope;
                        return function(val){
                                _scope.$apply(function(){_onChange(val);});
                                console.log("here");

                        };
                    }());

                }
                );

            // Resets the value
            scope.$watchGroup(["filterParam.minValue","filterParam.maxValue"],function(){
                var _scope = scope;
                return function(newVal,oldVal) {
                    if(newVal == oldVal){
                        return;
                    }
                    $("#" + _scope.id+"filter").slider('setAttribute','min',_scope.filterParam.minValue);
                    $("#" + _scope.id+"filter").slider('setAttribute','max',_scope.filterParam.maxValue);
                };
            }());


            
        }
    };
}]);

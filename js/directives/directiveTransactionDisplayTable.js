/**
 * The tableData attribute must be populated with an object with the keys 
 * 'change' and 'data'. 'change' must contain a boolean value. 'change' 
 * must be an array of values. Eacg time 'change' switches from false to true
 * the table is rebuilt.
 */
angular.module("directive.transaction.table",[]).directive("transactionTable", [function(){
    return {

        restrict: "E",
        // We want access to the parent scope so we can put the variables there
        scope : {
            tableData : "="
        },

        template:'<table class="table table-hover table-condensed">'
                  + '<tr><th>Date</th><th>Description</th><th>Category</th></tr>' 
                  + '</table>',

        link: function(scope,element,attr){

            scope.refreshTable = function(){

                var _scope = scope;
                var _element = element;

                var tableEl = _element.find('table');

                var tempRow = {};

                var dateEl = document.createElement('th');
                dateEl.innerHTML = "Date";

                var descEl= document.createElement('th');
                dateEl.innerHTML = "Description";

                var catEl = document.createElement('th');
                dateEl.innerHTML = "Category";

                var header = document.createElement('tr');
                    header.appendChild(dateEl);
                    header.appendChild(descEl);
                    header.appendChild(catEl);
                
                var thead = document.createElement("thead");
                thead.appendChild(header);



                return function(){

                    tableEl.empty();
                    tableEl.append(thead);
                    
                    var tbody = document.createElement("tbody");

                    for( var el of _scope.tableData.data ){

                        var tempRow = document.createElement("tr");
                        tempRow.innerHTML = "<td>" + el.getDateAsString()+ '</td>' +
                                            '<td>' + el.description + '</td>' +
                                            '<td>' + el.returnCategoryName() + '</td>';
                        
                        tbody.appendChild(tempRow);
                    }

                    tableEl.append(tbody);
                };

            }();

            console.log(scope);

            scope.$watch('tableData.change',function(){ scope.refreshTable();});
            
        }
    };
}]);

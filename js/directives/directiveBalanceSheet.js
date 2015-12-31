/**
 * The tableData attribute must be populated with an object with the keys 
 * 'change' and 'data' and 'categories'.  
 * The data value has structure like :
 *  [ { tag:[{category1:[v11,..v1f]},...{category2:[v21,..v2f]}] },
 *  ....]
 *  v11 must be a string value representing a number.
 *  The above structure must be followed because the table is built row
 *  by row.
 * Each time 'change' switches from false to true
 * the table is rebuilt.
 */
angular.module("directive.balance.sheet",[]).directive("balanceSheet", [function(){
    return {

        restrict: "E",
        // We want access to the parent scope so we can put the variables there
        scope : {
            tableData : "=",
            updateTable : "="
        },

        template:'<table class="table table-hover table-condensed">'
                  + '</table>',

        link: function(scope,element,attr){

            scope.refreshTable = function(){

                var _scope = scope;
                var _element = element;

                var tableEl = _element.find('table');

                var tempRow = {};

                return function(){

                    var thead = document.createElement("thead");

                            var header = document.createElement('tr');

                                var catEl = document.createElement('th');
                                catEl.innerHTML = "";
                                catEl.colSpan = "2";

                                header.appendChild(catEl);

                                for(var date of _scope.tableData.dates){
                                    catEl = document.createElement('th');
                                    catEl.innerHTML = String(parseInt(date.getMonth())+1) + '/' + date.getFullYear();

                                    header.appendChild(catEl);
                                }


                    thead.appendChild(header);
                    tableEl.empty();
                    tableEl.append(thead);

                    var tbody = document.createElement("tbody");
                    var tempTd = {};
                    var tagName = null;
                    var catName = null;


                    for( var el of _scope.tableData.data ){

                        var tempRow = document.createElement("tr");

                        tempRow.className += "danger";

                        tagName = Object.keys(el)[0];
                        tempRow.innerHTML =  '<td colspan="0">'+tagName+'</td>';
                        tbody.appendChild(tempRow);

                        for(var catObj of el[tagName] ){

                            tempRow = document.createElement("tr");  
                            catName = Object.keys(catObj)[0];
                            tempRow.innerHTML = '<td>' + "   " +  '</td>';

                            tempRow.innerHTML += '<td>'+catName+'</td>';

                            for(var val of catObj[catName]){
                                tempRow.innerHTML += '<td>'+String(val)+'</td>';
                            }

                            tbody.appendChild(tempRow);

                        }


                    }

                    tableEl.append(tbody);
                };

            }();

            console.log(scope);

            scope.$watch('updateTable.value',function(){ scope.refreshTable();});
            
        }
    };
}]);

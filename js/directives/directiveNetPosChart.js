/**
 */
angular.module("directive.netPosChart",[]).directive("netPosition", [function(){
    return {

        restrict: "E",

        scope : {
            dimensions : '=',
            data : '=',
            update : '='
        },

        template:'<svg></svg>',

        link: function(scope,element,attr){

                scope.$watch('update.value',function(){

                var _scope = scope;
                var _element = element;
                // Note that we bind this
                var _drawer = function(){
                    
                    var _data   = _scope.data.value;
                    _element.find('svg').empty();
                    
                    // Fill in the next element
                    // The last element will have a not_last element being true;
                    for(var i = 0; i < _data.length-1 ; i++)
                    {
                        _data[i]["next"] = _data[i+1];
                    }

                    //console.log(_data);

                    _data[_data.length-2]["next"]["not_last"] = true;

                    var margin = {top: 20, right: 30, bottom: 30, left: 80},
                    width = _element.parent().width() - margin.left - margin.right;            
                    height = scope.dimensions.height - margin.top - margin.bottom;

                    var x = d3.scale.ordinal()
                        .rangeRoundBands([0, width], .1);

                    var y = d3.scale.linear()
                        .range([height, 0]);

                    var xAxis = d3.svg.axis()
                        .scale(x)
                        .orient("bottom");

                    var yAxis = d3.svg.axis()
                        .scale(y)
                        .orient("left");
                        //.ticks(10, "%");
                    
                    /* These methods don't work :
                    var svg = d3.select("#stest")
                    var svg = d3.select("#dsb_d3netcashflow_svg")
                    hardcoding the svg in works, but creating the svg via document.createElement(svg) doesn't
                    might have to call document.createElementNS but haven't tested it.
                    // I can only seem to get it to work like this */
                    var svg = d3.select(_element.find('svg')[0])
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .attr("float","left")
                            .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                    /*d3.tsv("data.tsv", type, function(error, data) {
                      x.domain(data.map(function(d) { return d.name; }));
                      y.domain([0, d3.max(data, function(d) { return d.value; })]);*/
                    x.domain(_data.map(function(d) { return d.name; }));
                    y.domain([d3.min(_data, function(d) { return d.value; }), d3.max(_data, function(d) { return d.value; })]);
                    
                    svg.append("g")
                      .attr("class", "x axis")
                      .attr("transform", "translate(0," + height + ")")
                      .call(xAxis);

                    svg.append("g")
                      .attr("class", "y axis")
                      .call(yAxis)
                    .append("text")
                      .attr("transform", "rotate(-90)")
                      .attr("y", 6)
                      .attr("dy", ".71em")
                      .style("text-anchor", "end")
                      .text("$AUSD");
                    
                    var d3line = svg.selectAll(".b").data(_data);
                    d3line.enter().append("line")
                      .attr("class", "netposline")
                      .attr("x1", function(d) { return (x(d.name) + x.rangeBand()/2) ; })
                      .attr("x2", function(d) { 
                          if(!d.hasOwnProperty('not_last'))
                            { 
                                return (x(d.next.name) + x.rangeBand()/2) ; 
                            }else{
                                return (x(d.name) + x.rangeBand()/2); 
                            }
                        })
                      .attr("y1", function(d) {return y(d.value);})
                      .attr("y2", function(d) {
                          if(!d.hasOwnProperty('not_last'))
                            { 
                                return y(d.next.value); 
                            }else{
                                return y(d.value); 
                            }
                        });
                               

                    }.bind(this);

                    return function(newVal,oldVal){

                        // This is the main function which runs
                        // when the watch calls

                        // Don't do anything on startup
                        if(newVal == oldVal){return null;}
                        
                        // setTimeout feels hacky but 
                        // can't think of anyother way
                        // Esssentially we put this at the end of the que of functions
                        // that are executing. Then when the drawing function has finished 
                        // this will run
                        setTimeout(_drawer,0);

                    };

                }());

            }
        };
}]);


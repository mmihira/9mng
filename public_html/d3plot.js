_glbl.d3plot.createNetCashFlow = function(yrs)
{
    var nc = _glbl.dbint.get_data({  acc:"NETBANK",
                            val_bal:"val",
                            deb_cred:"cred",
                            notinc:["8600","4239"],
                            notinccat:[],
                            inc:[],
                            inccat:[],
                            yrs:yrs ,
                            mo:["all"]                          
                        });
    var gi = _glbl.dbint.get_data({  acc:"GOAL",
                            val_bal:"val",
                            deb_cred:"cred",
                            notinc:["2659"],
                            notinccat:[],
                            inc:[],
                            inccat:[],
                            yrs:yrs ,
                            mo:["all"]                          
                        });
    var so = _glbl.dbint.get_data({  acc:"SAVER",
                            val_bal:"val",
                            deb_cred:"deb",
                            notinc:["4239","8600"],
                            notinccat:[],
                            inc:[],
                            inccat:[],
                            yrs:yrs ,
                            mo:["all"]                          
                        });
    
    var _data = [];

    // Determine which off the accounts has the most data.
    var srt = [[nc,function(l,r){return parseFloat(l) + parseFloat(r);}], 
               [gi,function(l,r){return parseFloat(l) + parseFloat(r);}], 
               [so,function(l,r){return parseFloat(l) + parseFloat(r);}]
                ];
                
    // Sort the data so that the symbol with the most data goes first
    srt.sort(function(x,y){return x[0].length-y[0].length;});
    
    // Make the data vector of format [[yr-mo as string,float value],.....]    
    // We make the date vector big enough to fit the largest data length.
    for(var i in srt[srt.length-1][0])
    {
        _data.push({name:srt[srt.length-1][0][i][0],value:0.0});
    }

    for(var i = 0 ; i < srt.length; i++)
    {
        var accvref = srt[i][0];
        for(var k = 0; k < accvref.length; k++)
        {
            //make sure we are looking at the same month
            if( accvref[k][0] === _data[k]["name"])
            {
                // format is like this 
                //[{name:$$ ,vlaue:$$ },{}]
                _data[k]["value"] = srt[i][1](_data[k]["value"],accvref[k][1]);
            }
        }
    }
    
    //var _data = [{name:"A",value:.08167},{name:"B",value:.01492},{name:"C",value:.02782},{name:"D",value:.04253},{name:"E",value:.12702},{name:"F",value:.02288},{name:"G",value:.02015},{name:"H",value:.06094},{name:"I",value:.06966},{name:"J",value:.00153},{name:"K",value:.00772},{name:"L",value:.04025},{name:"M",value:.02406},{name:"N",value:.06749},{name:"O",value:.07507},{name:"P",value:.01929},{name:"Q",value:.00095},{name:"R",value:.05987},{name:"S",value:.06327},{name:"T",value:.09056},{name:"U",value:.02758},{name:"V",value:.00978},{name:"W",value:.02360},{name:"X",value:.00150},{name:"Y",value:.01974},{name:"Z",value:.00074}];
    
    console.log(_data);
    
    var margin = {top: 20, right: 30, bottom: 30, left: 80},
    width = 1100 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

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
    var svg = d3.select("#dsb_d3netcashflow").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
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
      .text("Frequency");
    
    svg.selectAll(".bar")
      .data(_data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.name); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) {
          if(d.value >= 0){
                return y(d.value);
            }
            else{
                return y(0);
            }
        })
      .attr("height", function(d) {
          if(d.value >= 0){
                return y(0) - y(d.value);
          }
          else{
                return y(d.value)-y(0); 
          }
      });
    
    
      
      
};
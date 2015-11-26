_glbl.d3plot.createNetCashFlow = function(yrs)
{
    var nc = _glbl.dbint.get_data({  acc:"NETBANK",
                            val_bal:"val",
                            deb_cred:"cred",
                            notinc:[],
                            notinccat:[],
                            notinccattag:["Internal"],
                            inc:[],
                            inccat:[],
                            yrs:yrs ,
                            mo:["all"]                          
                        });
                        
    var gi = _glbl.dbint.get_data({  acc:"GOAL",
                            val_bal:"val",
                            deb_cred:"cred",
                            notinc:[],
                            notinccat:[],
                            notinccattag:["Internal"],
                            inc:[],
                            inccat:[],
                            yrs:yrs ,
                            mo:["all"]                          
                        });
                        
    var so = _glbl.dbint.get_data({  acc:"SAVER",
                            val_bal:"val",
                            deb_cred:"deb",
                            notinc:[],
                            notinccat:[],
                            notinccattag:["Internal"],
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
    
    // Data has the format [{name:"Some String,value:123.23},.....] 
    //eg : var _data = [{"20-02",20},{"21-02",22},{"22-02",22}]  
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
    
    var margin = {top: 20, right: 30, bottom: 30, left: 80},
    width = 1200 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

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
    
    var d3bars = svg.selectAll(".b").data(_data);
    d3bars.enter().append("rect")
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
      
    d3bars.enter().append("text")
        .attr("class", "bartext")
      .attr("x", function(d){return x(d.name) +x.rangeBand()/2;})
      .attr("y", function(d){
          if(d.value >= 0){
                return y(d.value)+3;
            }
            else{
                return y(d.value)-3;
            }
        })
      .attr("dy", function(d) {
          if(d.value >= 0){
                return "0.75em";
            }
            else{
                return "-0.75em";
            }
        })
      .attr("dx",function(d){
            return "-"+(String(Math.round(d.value)).length/2) + "em";
        })
      .text(function(d) { return Math.round(d.value); });
      
    
      
      
};

_glbl.d3plot.createNewNetPosition = function(yrs)
{
    var _data   = [];

    var svrd    = [];
    var goald   = [];
    var netd    = [];

    var mn = ["01","02","03","04","05","06","07","08","09","10","11","12"];

    var svrd    = _glbl.dbint.get_net_position(yrs, "SAVER", mn);
    var netd    = _glbl.dbint.get_net_position(yrs, "NETBANK", mn);
    var goald   = _glbl.dbint.get_net_position(yrs, "GOAL", mn);

    // Determine which off the accounts has the most data.
    var srt = [[svrd,function(l,r){return parseFloat(l) + parseFloat(r);}], 
               [netd,function(l,r){return parseFloat(l) + parseFloat(r);}], 
               [goald,function(l,r){return parseFloat(l) + parseFloat(r);}]
                ];
    srt.sort(function(x,y){return x[0].length-y[0].length;});
    
    // Make the data vector of format [[yr-mo as string,float value],.....]    
    // We make the date vector big enough to fit the largest data length.
    for(var i in srt[srt.length-1][0])
    {
        _data.push({name:srt[srt.length-1][0][i][0],value:0.0,next:{},not_last:false});
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
    
    // Fill in the next element
    // The last element will have a not_last element being true;
    for(var i = 0; i < _data.length-1 ; i++)
    {
        _data[i]["next"] = _data[i+1];
    }
    _data[_data.length-1]["next"]["not_last"] = true;
    
    var margin = {top: 20, right: 30, bottom: 30, left: 80},
    width = 800 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

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
    var svg = d3.select("#dsb_d3netposition").append("svg")
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
          if(!d.next.not_last)
            { 
                return (x(d.next.name) + x.rangeBand()/2) ; 
            }else{
                return (x(d.name) + x.rangeBand()/2); 
            }
        })
      .attr("y1", function(d) {return y(d.value);})
      .attr("y2", function(d) {
          if(!d.next.not_last)
            { 
                return y(d.next.value); 
            }else{
                return y(d.value); 
            }
        });
               
      
    /*d3bars.enter().append("text")
        .attr("class", "bartext")
      .attr("x", function(d){return x(d.name) +x.rangeBand()/2;})
      .attr("y", function(d){
          if(d.value >= 0){
                return y(d.value)+3;
            }
            else{
                return y(d.value)-3;
            }
        })
      .attr("dy", function(d) {
          if(d.value >= 0){
                return "0.75em";
            }
            else{
                return "-0.75em";
            }
        })
      .attr("dx",function(d){
            return "-"+(String(Math.round(d.value)).length/2) + "em";
        })
      .text(function(d) { return Math.round(d.value); });*/
    
    
    
    
};
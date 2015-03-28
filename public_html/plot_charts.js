
/**
 * $(function(){}); is short hand for $(document).ready(function() { ... });
 * Enables executing the code when all DOM elements have been loaded.
 * @returns {undefined}
 */

_glbl.flotplot.getMonthName = function(newTimestamp) 
{
    var monthArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]; 
    var alphaMonth = monthArray[newTimestamp]; 
    return alphaMonth;
};

_glbl.flotplot.createNetCashFlow = function(yrs)
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
        _data.push([srt[srt.length-1][0][i][0],0.0]);
    }

    for(var i = 0 ; i < srt.length; i++)
    {
        var accvref = srt[i][0];
        for(var k = 0; k < accvref.length; k++)
        {
            //make sure we are looking at the same month
            if( accvref[k][0] === _data[k][0])
            {
                _data[k][1] = srt[i][1](_data[k][1],accvref[k][1]);
            }
        }
    }
        
    $(function () 
    {
        var data = [{
            color: '#336699',
            data: _data
        }];

        $.plot("#dsb_netcashflow_flot", data, {
            series: {
                bars: {
                    show: true,
                    barWidth: 0.6,
                    align: "center",
                    fillColor: {
                        colors: [{
                            opacity: 1
                        }, {
                            opacity: 0.85
                        }]
                    }
                }
            },
            xaxis: {
                mode: "categories",
                tickLength: 0
            },
            grid: {
                hoverable: true,
                clickable: true
            }
        });
        /*
        $("<div id='tooltip'></div>")
            .css({
                position: "absolute",
                display: "none",
                border: "1px solid #fdd",
                padding: "2px",
                color: "white",
                "background-color": "#666699",
                opacity: 0.90
            })
            .appendTo("body");
        */
        function show_tooltip(x, y, contents, z) {
            $('<div id="bar_tooltip">' + contents + '</div>')
                .css({
                    top: y - 45,
                    left: x - 28,
                    'border-color': z
                })
                .appendTo("body")
                .fadeIn();
        }
        
        /*
        $("#dsb_netcashflow_flot")
            .on("plothover", function (event, pos, item) {
                if (item) {
                    $("#bar_tooltip")
                        .remove();
                    var x = _glbl.flotplot.getMonthName(item.datapoint[0]);
                    y = item.datapoint[1], z = item.series.color;
                    show_tooltip(item.pageX, item.pageY, "<div style='text-align: center;'><b>" + "Net Cash Flow :" + "</b><br />" + x + ": " + y + "</div>", z);
                } else {
                    $("#bar_tooltip")
                        .remove();
                    previous_point = null;
                    previous_label = null;
                }
            });
            */
    });
};

_glbl.flotplot.createNewNetPosition = function(yrs)
{
    var _data   = [];

    var svrd    = [];
    var goald   = [];
    var netd    = [];

    var svrd    = _glbl.dbint.get_net_position(yrs,"SAVER");
    var netd    = _glbl.dbint.get_net_position(yrs,"NETBANK");
    var goald   = _glbl.dbint.get_net_position(yrs,"GOAL");

    // Determine which off the accounts has the most data.
    var srt = [[svrd,function(l,r){return parseFloat(l) + parseFloat(r);}], 
               [netd,function(l,r){return parseFloat(l) + parseFloat(r);}], 
               [goald,function(l,r){return parseFloat(l) + parseFloat(r);}]
                ];
    srt.sort(function(x,y){return x[0].length-y[0].length;});
    console.log(srt);
    // Make the data vector of format [[yr-mo as string,float value],.....]    
    for(var i in srt[srt.length-1][0])
    {
        _data.push([srt[srt.length-1][0][i][0],0.0]);
    }

    for(var i = 0 ; i < srt.length; i++)
    {
        var accvref = srt[i][0];
        for(var k = 0; k < accvref.length; k++)
        {
            //make sure we are looking at the same month
            if( accvref[k][0] === _data[k][0])
            {
                _data[k][1] = srt[i][1](_data[k][1],accvref[k][1]);
            }
        }
    }
    
    console.log(_data);
    
    $(function () 
    {
        var data = [{
            color: '#336699',
            data: _data
        }];

        $.plot("#dsb_netPosition_flot", data, {
            series: {
                lines: {
                    show: true
                },
                points: { 
                    show: true 
                }
            },
            xaxis: {
                mode: "categories",
                tickLength: 0
            },
            grid: {
                hoverable: true,
                clickable: true
            }
        });
        /*
        $("<div id='tooltip'></div>")
            .css({
                position: "absolute",
                display: "none",
                border: "1px solid #fdd",
                padding: "2px",
                color: "white",
                "background-color": "#666699",
                opacity: 0.90
            })
            .appendTo("body");
        */
        
        function show_tooltip(x, y, contents, z) {
            $('<div id="bar_tooltip">' + contents + '</div>')
                .css({
                    top: y - 45,
                    left: x - 28,
                    'border-color': z
                })
                .appendTo("body")
                .fadeIn();
        }
        /*
        $("#dsb_netPosition_flot")
            .on("plothover", function (event, pos, item) {
                if (item) {
                    $("#bar_tooltip")
                        .remove();
                    var x = _glbl.flotplot.getMonthName(item.datapoint[0]);
                    y = item.datapoint[1], z = item.series.color;
                    show_tooltip(item.pageX, item.pageY, "<div style='text-align: center;'><b>" + "Net Cash Flow :" + "</b><br />" + x + ": " + y + "</div>", z);
                } else {
                    $("#bar_tooltip")
                        .remove();
                    previous_point = null;
                    previous_label = null;
                }
            });
            */
    });
    
};
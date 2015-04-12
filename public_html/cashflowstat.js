_glbl.cfstat.createNewCashFlowStat = function(){
    
    // Determine the latest year
    // We will assume SAVER account has the most values
    var latestYear = []; 
    for ( var i in _glbl.db.d_map["SAVER"]){
        latestYear.push(parseInt(i));
    }
    latestYear = latestYear.sort();
    latestYear = latestYear[latestYear.length-1];
    
    // Determine the latest month in that year
    var latestMonth = [];
    for( var i in _glbl.db.d_map["SAVER"][latestYear.toString()]){
        
        latestMonth.push(parseInt(i));
    }
    latestMonth = latestMonth.sort();
    latestMonth = [latestMonth[latestMonth.length -1].toString()];
    // convert month to format "0x" if need be
    if( latestMonth[0].length === 1){
        latestMonth = ["0" + latestMonth[0]];
    }
    latestYear = [latestYear.toString()];
    
    // get the net position
    var netPosition = _glbl.dbint.get_net_position(latestYear,"SAVER",latestMonth)[0][1] +
                        _glbl.dbint.get_net_position(latestYear,"GOAL",latestMonth)[0][1] +
                        _glbl.dbint.get_net_position(latestYear,"NETBANK",latestMonth)[0][1];
    

    // Title for the cashflow statement table
    glel.cf_title = document.createElement("div");
    glel.cf_title.className = "cftitle";
    glel.cf_title.width = "500px";
    glel.cf_title.innerHTML = "Cashflow Statement";
    
    // The main table
    glel.cf_table = document.createElement("table");
        // the net position
        glel.cf_netposrow = document.createElement("tr");
        glel.cf_netposrow.innerHTML = "Net Position : " + netPosition.toString();
        
        
        glel.cf_table.appendChild(glel.cf_netposrow);
    
    
    
    
      
    glel.dsb_cfstatement.appendChild(glel.cf_title);
    glel.dsb_cfstatement.appendChild(glel.cf_table);
    
};
            
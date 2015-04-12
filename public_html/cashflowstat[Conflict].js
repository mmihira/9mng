_glbl.cfstat.createNewCashFlowStat = function(){
    
    // Determine the latest year
    // We will assume SAVER account has the most values
    var latestYear = []; 
    for ( var i in _glbl.dbs["SAVER"]){
        latestYear.push(parseInt(i));
    }
    latestYear = latestYear.sort()[0];
    
    // Determine the latest month in that year
    var latestMonth = [];
    for( var i in _glbl.dbs["SAVER"][String(latestYear)]){
        
        latestMonth.push(parseInt(i));
    }
    latestMonth = latestMonth.sort()[0];
    
    // get the net position
    var netpositon = _glbl.dbint.get_net_position([String(latestYear)],"SAVER",[String(latestMonth)]) +
                        _glbl.dbint.get_net_position([String(latestYear)],"GOAL",[String(latestMonth)]);
    

    // Title for the cashflow statement table
    glel.cf_title = document.createElement("div");
    glel.cf_title.className = "cftitle";
    glel.cf_totle.width = "500px";
    glel.cf_totle.innerHTML = "Cashflow Statement";
    
    // The main table
    glel.cf_table = document.createElement("table");
        // the net position
        glel.cf_netposrow = document.createElement("tr");
        glel.cf_netposrow.value = 
        
        
        glel.cf_table.appendChild(glel.cf_netposrow);
    
    
    
    
      
    glel.dsb_cfstatement.appendChild(glel.cf_title);
    
};
            
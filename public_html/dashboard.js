
_glbl.fns.goToDashboard = function()
{
    // Remove the previous contents 
    _glbl.main.contents().detach();    
    _glbl.main.append(glel.dsb_main);
    
    // Remove existing netcashflow svg
    $("#dsb_d3netcashflow").contents().detach();
    $("#dsb_d3netposition").contents().detach();
    // Remove the cashflow statement
    $("#dsb_cfstatement").contents().detach();
    
    
    // Create the charts
    _glbl.d3plot.createNetCashFlow(["2014","2015"]);
    _glbl.d3plot.createNewNetPosition(["2014","2015"]);
    
    // Create the cash flow statement
    _glbl.cfstat.createNewCashFlowStat();
    
    
};


_glbl.fns.createDashboard = function()
{
    glel.dsb_main = document.createElement("div");
    glel.dsb_main.className = "dsbparent";
    glel.dsb_main.style.width = "1200px";
        
        // Div to hold the options after the title
        glel.dsb_choice_main = document.createElement("div");
        glel.dsb_choice_main.className = "dsbchoicemain";
        
            // The save button
            glel.dsb_choice_btn_save = document.createElement("div");
            glel.dsb_choice_btn_save.className = "dsbchoicebtn";
            glel.dsb_choice_btn_save.innerHTML = "Save";
            $(glel.dsb_choice_btn_save).on("click",_glbl.fns.saveDBToFile);
            glel.dsb_choice_spacer1 = document.createElement("div");
            glel.dsb_choice_spacer1.className = "dsbbtnspacer";
            // The update database button
            glel.dsb_choice_btn_add = document.createElement("div");
            glel.dsb_choice_btn_add.className = "dsbchoicebtn";
            glel.dsb_choice_btn_add.innerHTML = "Update DB"; 
            $(glel.dsb_choice_btn_add).on("click",_glbl.fns.goToLoadFromNewPage);
            glel.dsb_choice_spacer2 = document.createElement("div");
            glel.dsb_choice_spacer2.className = "dsbbtnspacer";
            // The category config button.
            glel.dsb_choice_btn_catconfig = document.createElement("div");
            glel.dsb_choice_btn_catconfig.className = "dsbchoicebtn";
            glel.dsb_choice_btn_catconfig.innerHTML = "Category Config"; 
            glel.dsb_choice_btn_catconfig.style.width = "130px"; 
            $(glel.dsb_choice_btn_catconfig).on("click",_glbl.fns.goToCatConfig);
            
            glel.dsb_choice_main.appendChild(glel.dsb_choice_btn_save);
            glel.dsb_choice_main.appendChild(glel.dsb_choice_spacer1);
            glel.dsb_choice_main.appendChild(glel.dsb_choice_btn_add);
            glel.dsb_choice_main.appendChild(glel.dsb_choice_spacer2);
            glel.dsb_choice_main.appendChild(glel.dsb_choice_btn_catconfig);
        
        // Div to to hold the title name
        glel.dsb_netcashflow_title = document.createElement("div");
        glel.dsb_netcashflow_title.className = "netCashFlowTitle";
        glel.dsb_netcashflow_title.innerHTML = "<br>Net Cash Flow<br>";
    
        // Div to hold the d3 net cash flow chart
        glel.dsb_d3netcashflow = document.createElement("div");
        glel.dsb_d3netcashflow.id = "dsb_d3netcashflow";
        glel.dsb_d3netcashflow.className = "dsbd3netcashflow";
        glel.dsb_d3netcashflow.width = "1200px";
        //glel.dsb_d3netcashflow.height = "300px"; 
        
        // Div to to hold the title name
        glel.dsb_netposition_title = document.createElement("div");
        glel.dsb_netposition_title.className = "netPositionTitle";
        glel.dsb_netposition_title.innerHTML = "<br>Net Position<br>";        
        
        // Div to hold the d3 net position chart
        glel.dsb_d3netposition = document.createElement("div");
        glel.dsb_d3netposition.id = "dsb_d3netposition";
        glel.dsb_d3netposition.className = "dsbd3netposition";
        glel.dsb_d3netposition.width = "1200px";
        //glel.dsb_d3netcashflow.height = "300px";
        
        // Div to hold the finance table
        glel.dsb_cfstatement = document.createElement("div");
        glel.dsb_cfstatement.id  = "dsb_cfstatement";        
        glel.dsb_cfstatement.className = "dsbcfstatement";
        glel.dsb_cfstatement.width = "1200px";                         
            // The rest of the table is constructed using functions in cashflowstat.js
               
                
    
    glel.dsb_main.appendChild(glel.dsb_choice_main);
    glel.dsb_main.appendChild(glel.dsb_netcashflow_title);
    glel.dsb_main.appendChild(glel.dsb_d3netcashflow);
    glel.dsb_main.appendChild(glel.dsb_netposition_title);
    glel.dsb_main.appendChild(glel.dsb_d3netposition);
    glel.dsb_main.appendChild(glel.dsb_cfstatement);
    
    
};
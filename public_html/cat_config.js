_glbl.fns.goToCatConfig = function()
{
    // Remove the previous contents 
    _glbl.main.contents().detach();
    $(glel.cnf_parent).contents().detach();
    $(glel.cnf_cat_view_main).contents().detach();
    
    // Remove the only references to previously created panels.
    glel.panelvec = [];
    _glbl.catg.updateCatlist();
    var pRef = false;
    for(var i in _glbl.catlist)
    {
        glel.panelvec.push({});
        pRef = glel.panelvec[glel.panelvec.length -1];
        
        // The main panel div which holds the panel.
        pRef.main = document.createElement("div");
        pRef.main.className = "catpanelmain";
            // The div to hold the category title
            pRef.title_div = document.createElement("div");
            pRef.title_div.className = "catpaneltitle";
            pRef.title_div.innerHTML = i;
        // Append to the main panel div
        pRef.main.appendChild(pRef.title_div);
        
    }
    
    // Attach displays
    for( var i in glel.panelvec)
    {
        glel.cnf_cat_view_main.appendChild(glel.panelvec[i].main);
    }  
    
    // Create the category table view
    glel.cnf_parent.appendChild(glel.cnf_choice_main);
    glel.cnf_parent.appendChild(glel.cnf_cat_view_main);
    _glbl.main.append(glel.cnf_parent);
};

_glbl.fns.createCatConfigPage =  function()
{
    glel.cnf_parent = document.createElement("div");
    glel.cnf_parent.className = "cnfparent";
    glel.cnf_parent.style.width = "1200px";
    
        // Div to hold the options after the title
        glel.cnf_choice_main = document.createElement("div");
        glel.cnf_choice_main.className = "cnfchoicemain";
        
            // The back to dashboard button
            glel.cnf_choice_btn_dashboard = document.createElement("div");
            glel.cnf_choice_btn_dashboard.className = "cnfchoicebtn";
            glel.cnf_choice_btn_dashboard.innerHTML = "Dashboard";
            $(glel.cnf_choice_btn_dashboard).on("click",_glbl.fns.goToDashboard);
            glel.cnf_choice_spacer1 = document.createElement("div");
            glel.cnf_choice_spacer1.className = "cnfbtnspacer";
            // The save button
            glel.cnf_choice_btn_save= document.createElement("div");
            glel.cnf_choice_btn_save.className = "cnfchoicebtn";
            glel.cnf_choice_btn_save.innerHTML = "Save Categories";
            $(glel.cnf_choice_btn_save).on("click",function(){});
            // The add category button
            // The recat button
            
        // Append the buttons
        glel.cnf_choice_main.appendChild(glel.cnf_choice_btn_dashboard);
        glel.cnf_choice_main.appendChild(glel.cnf_choice_spacer1);
        glel.cnf_choice_main.appendChild(glel.cnf_choice_btn_save);
            
        // Div to hold the category editing panel
        glel.cnf_cat_view_main = document.createElement("div");
        glel.cnf_cat_view_main.className = "cnfcatviewmain";
        
        // Variable to hole the editing panels
        glel.panelvec = [];        
};
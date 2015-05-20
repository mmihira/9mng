_glbl.fns.goToCatConfig = function()
{
    // Remove the previous contents 
    _glbl.main.contents().detach();
    $(glel.cnf_parent).contents().detach();
    $(glel.cnf_cat_view_main).contents().detach();
    
    // Remove any temporary panels
    glel.tempPanel = [];
    
    /******************* Create Cat Display Panels *******************/
    _glbl.catg.clearAndRefreshCatPanels();
    
    /******************* Create Cat Display Table *******************/
    _glbl.catg.rfrsgCatTable(); 
    
    // Clear the temporary cat panels added using the add button
    glel.cnf_parent.appendChild(glel.cnf_choice_main);
    glel.cnf_parent.appendChild(glel.cnf_cateditpaneltitle);
    glel.cnf_parent.appendChild(glel.cnf_cat_view_parent);
    glel.cnf_parent.appendChild(glel.cnf_spacer1);
    glel.cnf_parent.appendChild(glel.cnf_cattabletitle);
    glel.cnf_parent.appendChild(glel.cnf_cat_table_main);
    _glbl.main.append(glel.cnf_parent);
    
};


/**
 * This function is called within goToCatConfig and addCatButtonListener
 * It refreshes the panels in cnf_vat_view_main
 * All elements contained within cnf_cat_view_main are deleted and then re-created
 * @param hook  Used by the add category listener to create an additonal blank category
 * @returns {undefined}
 */
_glbl.catg.clearAndRefreshCatPanels = function(){
    
    $(glel.cnf_cat_view_main).contents().detach();   
    /******************* Cat Editing Panel Creation *******************
     *
     * The structure of glel.panelvec is like :
     * [{   main : div element which holds the title and panel
     *      title_div : div element which holds the title_div_table_cell
     *      title_div_table_cell : div element for holding the element whith the title itself
     *      cat_terms : the textarea element which hols the category term. 
     *      },...]
     * each {} in the vector is an panel.
     */
    glel.panelvec = [];
    
    var pRef = false;
        
    // Allways update the Catlist to ensure
    // any changes are included.
    _glbl.catg.updateCatlist();
    // For each of the categories
     
    for(var i in _glbl.catlist)
    {
        glel.panelvec.push({});
        pRef = glel.panelvec[glel.panelvec.length -1];
        pRef.index = glel.panelvec.length -1;
        
        // Any changes here need to be replicated in the addCatButtonListener function 
        // The main panel div which holds the panel.
        pRef.main = document.createElement("div");
        pRef.main.className = "catpanelmain";
        
        
            // Div to hold the category title and delete button 
            pRef.title_main = document.createElement("div");
            pRef.title_main.className = "titlemain";
            
                // The div to hold the category title
                pRef.title_div_input = document.createElement("input");
                pRef.title_div_input.type = "text";
                pRef.title_div_input.className = "catpaneltitle";
                pRef.title_div_input.value = i;
                
                // The Div for the exit button.
                pRef.delete_button = document.createElement("div");
                pRef.delete_button.className = "catdeletebutton";
                pRef.delete_button.innerHTML = "x";
                $(pRef.delete_button).on("click", (function() { var nIndex = glel.panelvec.length -1;
                                                               return function(){
                                                                                    glel.panelvec.splice(nIndex,1);
                                                                                    _glbl.catg.RefreshCatPanels();
                                                                                };  
                                                                            })());        
                
            pRef.title_main.appendChild(pRef.title_div_input);    
            pRef.title_main.appendChild(pRef.delete_button);    
                
            
            // The div to hold the category tag
            pRef.tag_input = document.createElement("input");
            pRef.tag_input.className = "taginput";
            pRef.tag_input.type = "text";
            pRef.tag_input.value = _glbl.cat_db[i]["tag"];
            
            // The textarea
            pRef.cat_terms = document.createElement("textarea");
            pRef.cat_terms.className = "catterms";
            pRef.cat_terms.rows = 20;
            pRef.cat_terms.cols = 20;
            
            for(var j in _glbl.catlist[i])
            {
                pRef.cat_terms.innerHTML += _glbl.catlist[i][j] + "\n"; 
            }
   
        // Append to the main panel div
        pRef.main.appendChild(pRef.title_main);
        pRef.main.appendChild(pRef.tag_input);
        pRef.main.appendChild(pRef.cat_terms);
    }
    
    // Attach the category panels in glel.panelvec to cnf_cat_view_main
    _glbl.catg.AttachCatPanels();
    
};

/**
 * Attaches the displays in glel.tempPanel and glel.panelvec to cnf_cat_view_main
 * Called by _glbl.catg.clearAndRefreshCatPanels
 */
_glbl.catg.AttachCatPanels = function(){
    
    // Attach displays
    for( var i in glel.tempPanel)
    {
        glel.cnf_cat_view_main.appendChild(glel.tempPanel[i].main);
    }
    
    for( var i in glel.panelvec)
    {
        glel.cnf_cat_view_main.appendChild(glel.panelvec[i].main);
    }
    
};


/**
 * A simple detach and re-attachemnt of panels
 * This is used in the listener attached to the delete buttons in the display panels
 */
_glbl.catg.RefreshCatPanels = function(){
    
    $(glel.cnf_cat_view_main).contents().detach();
    _glbl.catg.AttachCatPanels();
    
};


/*
 * The refersh cat table function is called to referesh the category table.
 * Called during page start and also when data is recategorised.
 */
_glbl.catg.rfrsgCatTable = function()
{
    // Remove the references to any existing tables
    $(glel.cnf_cat_table).contents().detach();
    glel.ctvec = [];
    
    var cols_to_inc = [[_glbl.dbs.acc],[_glbl.dbs.desc],[_glbl.dbs.cat]];
    
    for(var i in _glbl.db.all_data)
    {
        glel.ctvec.push({});
        var tRef = glel.ctvec[glel.ctvec.length -1];
        
        tRef.row = document.createElement("div");
        tRef.row.className = "cattablerow";
        for(var j in cols_to_inc)
        {
            tRef.cellv = [];
            var k = document.createElement("div");
            k.className = "cattablecell";
            k.innerHTML = _glbl.db.all_data[i][cols_to_inc[j]];
            tRef.cellv.push({x : k});
            tRef.row.appendChild(k);
        }
        glel.cnf_cat_table.appendChild(tRef.row);
    }
};

_glbl.fns.createCatConfigPage =  function()
{
    glel.cnf_parent = document.createElement("div");
    glel.cnf_parent.className = "cnfparent";
    glel.cnf_parent.style.width = "1200px";
    
        // Category editing panel
        glel.cnf_cateditpaneltitle = document.createElement("div");
        glel.cnf_cateditpaneltitle.innerHTML = "Category Editing Panel";
        glel.cnf_cateditpaneltitle.className = "cnf_cateditpaneltitle";
    
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
            $(glel.cnf_choice_btn_save).on("click",_glbl.catg.savecat);
            glel.cnf_choice_spacer2 = document.createElement("div");
            glel.cnf_choice_spacer2.className = "cnfbtnspacer";
            
            // The recategorise button
            glel.cnf_choice_btn_recat = document.createElement("div");
            glel.cnf_choice_btn_recat.className = "cnfchoicebtn";
            glel.cnf_choice_btn_recat.innerHTML = "Recategorise Data";
            $(glel.cnf_choice_btn_recat).on("click",_glbl.catg.config_categorise);
            
            // The add category button
            // The recat button
            
        // Append the buttons
        glel.cnf_choice_main.appendChild(glel.cnf_choice_btn_dashboard);
        glel.cnf_choice_main.appendChild(glel.cnf_choice_spacer1);
        glel.cnf_choice_main.appendChild(glel.cnf_choice_btn_save);
        glel.cnf_choice_main.appendChild(glel.cnf_choice_spacer2);
        glel.cnf_choice_main.appendChild(glel.cnf_choice_btn_recat);
            
        // Div to hold the category editing panel and the add new category button
        glel.cnf_cat_view_parent = document.createElement("div");
        glel.cnf_cat_view_parent.className = "cnfcatviewparent";
        
            // The add new category button
            glel.cnf_addNewButton = document.createElement("div");
            glel.cnf_addNewButton.className = "addbutton";
                glel.cnf_inner_table = document.createElement("div");
                glel.cnf_inner_table.className = "titledivtable";
                    glel.cnf_inner_table_cell  = document.createElement("div");
                    glel.cnf_inner_table_cell.className = "titledivtablecell";
                    glel.cnf_inner_table_cell.innerHTML = "Add<br>New";
                    glel.cnf_inner_table.appendChild(glel.cnf_inner_table_cell);
            glel.cnf_addNewButton.appendChild(glel.cnf_inner_table);
            $(glel.cnf_addNewButton).on("click",_glbl.fns.addCatButtonListener);
        
        // Where all the panels are held
        glel.cnf_cat_view_main = document.createElement("div");
        glel.cnf_cat_view_main.className = "cnfcatviewmain";


        glel.cnf_cat_view_parent.appendChild(glel.cnf_addNewButton);
        glel.cnf_cat_view_parent.appendChild(glel.cnf_cat_view_main);

        // Spacer
        glel.cnf_spacer1 = document.createElement("div");
        glel.cnf_spacer1.className = "cnf_spacer1";

        // Category view title
        glel.cnf_cattabletitle = document.createElement("div");
        glel.cnf_cattabletitle.innerHTML = "Data Table";
        glel.cnf_cattabletitle.className = "cnf_cattabletitle";
        
        // Category display filter
        // Only show categorised
        // Year drop down
        // Year
        // anything else ?
        // Apply filter button
        

        // Div to hold the table of data showing category
        glel.cnf_cat_table_main = document.createElement("div");
        glel.cnf_cat_table_main.className = "cnfcattablemain";
            
                // The category table itself
                glel.cnf_cat_table = document.createElement("div");
                glel.cnf_cat_table.className = "cnfcattable";
            
        glel.cnf_cat_table_main.appendChild(glel.cnf_cat_table);  
                
};

_glbl.fns.addCatButtonListener = function(){
    
    glel.tempPanel.push({});
    var pRef = glel.tempPanel[glel.tempPanel.length -1];

    // The main panel div which holds the panel.
    pRef.main = document.createElement("div");
    pRef.main.className = "catpanelmain";
    
        // Div to hold the category title and delete button 
        pRef.title_main = document.createElement("div");
        pRef.title_main.className = "titlemain";

            // The div to hold the category title
            pRef.title_div_input = document.createElement("input");
            pRef.title_div_input.type = "text";
            pRef.title_div_input.className = "catpaneltitle";
            pRef.title_div_input.value = "NewCat";
            
            // The Div for the exit button.
            pRef.delete_button = document.createElement("div");
            pRef.delete_button.className = "catdeletebutton";
            pRef.delete_button.innerHTML = "x";
            $(pRef.delete_button).on("click", (function() { var nIndex = glel.tempPanel.length -1;
                                                               return function(){
                                                                                    glel.tempPanel.splice(nIndex,1);
                                                                                    _glbl.catg.RefreshCatPanels();
                                                                                };  
                                                                            })()); 
        
        pRef.title_main.appendChild(pRef.title_div_input);    
        pRef.title_main.appendChild(pRef.delete_button);


        // The div to hold the category tag
        pRef.tag_input = document.createElement("input");
        pRef.tag_input.className = "taginput";
        pRef.tag_input.type = "text";
        pRef.tag_input.value = "Default";

        // The textarea
        pRef.cat_terms = document.createElement("textarea");
        pRef.cat_terms.className = "catterms";
        pRef.cat_terms.rows = 20;
        pRef.cat_terms.cols = 20;


    // Append to the main panel div
    pRef.main.appendChild(pRef.title_main);
    pRef.main.appendChild(pRef.tag_input);
    pRef.main.appendChild(pRef.cat_terms);

    
    _glbl.catg.clearAndRefreshCatPanels();
    
    
    
};
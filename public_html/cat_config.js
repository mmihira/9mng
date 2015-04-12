_glbl.fns.goToCatConfig = function()
{
    // Remove the previous contents 
    _glbl.main.contents().detach();
    $(glel.cnf_parent).contents().detach();
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
                pRef.title_div_table = document.createElement("div");
                pRef.title_div_table.className = "titledivtable";
                    pRef.title_div_table_cell  = document.createElement("div");
                    pRef.title_div_table_cell.className = "titledivtablecell";
                    pRef.title_div_table_cell.innerHTML = i;
            
                pRef.title_div_table.appendChild(pRef.title_div_table_cell);

            pRef.title_div.appendChild(pRef.title_div_table);
            
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
        pRef.main.appendChild(pRef.title_div);
        pRef.main.appendChild(pRef.tag_input);
        pRef.main.appendChild(pRef.cat_terms);
    }
    
    // Attach displays
    for( var i in glel.panelvec)
    {
        glel.cnf_cat_view_main.appendChild(glel.panelvec[i].main);
    }  
    
    /******************* Cat Display Table *******************/
    _glbl.catg.rfrsgCatTable();
    
    
    
    
    glel.cnf_parent.appendChild(glel.cnf_choice_main);
    glel.cnf_parent.appendChild(glel.cnf_cat_view_main);
    glel.cnf_parent.appendChild(glel.cnf_cat_table_main);
    _glbl.main.append(glel.cnf_parent);
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
            
        // Div to hold the category editing panel
        glel.cnf_cat_view_main = document.createElement("div");
        glel.cnf_cat_view_main.className = "cnfcatviewmain";
            // Div to hold the Expenditure type categories
        
        // Div to hold the table of data showing category
        glel.cnf_cat_table_main = document.createElement("div");
        glel.cnf_cat_table_main.className = "cnfcattablemain";
            glel.cnf_cat_table = document.createElement("div");
            glel.cnf_cat_table.className = "cnfcattable";
        glel.cnf_cat_table_main.appendChild(glel.cnf_cat_table);  
                
};
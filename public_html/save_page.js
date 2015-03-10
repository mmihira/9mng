_glbl.fns.goToSavePage = function()
{
    // Remove the 
    _glbl.main.contents().detach();
    _glbl.main.append(glel.save_db_main);
    _glbl.main.append(glel.save_consolemain);
    //_glbl.dbint.net_cashflow();
   
};

_glbl.fns.saveDBToFile = function()
{
   
    // create the text;
    var o = "";
    var x = _glbl.db.all_data;
    var s = _glbl.dba;
    for( var i in _glbl.db.all_data)
    {
        o += x[i][s.acc] 
                + "," + x[i][s.uid] 
                + "," + x[i][s.day]  
                + "," + x[i][s.month]
                + "," + x[i][s.year]
                + "," + "\""+x[i][s.desc]+"\""
                + "," + x[i][s.val].toPlainString()
                + "," + x[i][s.bal].toPlainString()
                + "," + "\""+x[i][s.cid]+"\""
                +"\n";
    }
    
    var content = o;
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd='0'+dd;
    } 

    if(mm<10) {
        mm='0'+mm;
    } 

    today = yyyy+'_'+mm+'_'+dd;
    var filename = today+"_"+"finance_db.txt";
    var contentType = "text/plain";
    var a = document.createElement('a');
    var blob = new Blob([content], {'type':contentType});
    a.href = window.URL.createObjectURL(blob);
    a.download = filename;
    a.click();
            
};

function createSavePage()
{
    var _h = 200;                
    // The main div which holds the explanation, file selection, option lookup, and upload button
    glel.save_db_main = document.createElement("div");
    glel.save_db_main.className = "save_dbmain";
    glel.save_db_main.style.height = _h + "px";
    glel.save_db_main.style.width = "1200px";
        // Explanation div
        glel.save_db_exp_txt = document.createElement("div");
        glel.save_db_exp_txt.className = "save_db_exptxt";
        glel.save_db_exp_txt.style.width = "600px";
        glel.save_db_exp_txt.style.height = _h + "px";               
        glel.save_db_exp_txt.innerHTML  = "<p>Select a text file to save the database.<p>";
        glel.save_db_exp_txt.innerHTML += "<p> File extension must be .txt or .csv <p>";

        // Sub div for the file selction, option lookup and upload button.
        glel.save_db_file_main = document.createElement("div");
        glel.save_db_file_main.className = "save_db_file_main";
        glel.save_db_file_main.style.width = "600px";
        glel.save_db_file_main.style.height = _h + "px"; 
            // A div to contain the upload file 
            glel.save_db_filediv = document.createElement("div");
            glel.save_db_filediv.className = "save_db_filediv";
            glel.save_db_filediv.display = "block";
            glel.save_db_filediv.style.height = _h/2 + "px";
            glel.save_db_filediv.style.width = "600px";
                // Upload file selection                
                glel.save_db_file = document.createElement("input");
                glel.save_db_file.id = "savefileToParse";
                glel.save_db_file.type = "file";
                glel.save_db_file.style.display = "inline";
                glel.save_db_filediv.appendChild(glel.save_db_file);
            //spacer between selection and upload file btn
            glel.save_db_file_spacer = document.createElement("div");
            glel.save_db_file_spacer.style.display = "block";
            glel.save_db_file_spacer.style.height = "10px";

            // Dashboard button. 
            glel.save_goto_dashboard_div = document.createElement("div");
            glel.save_goto_dashboard_div.className = "saveGotoDashboardDiv";
            glel.save_goto_dashboard_div.style.width = "600px";
            glel.save_goto_dashboard_div.style.height = "10px";
                glel.save_goto_dashboard_btn = document.createElement("button");
                //glel.save_goto_dashboard_btn.className = "toDashboard";
                glel.save_goto_dashboard_btn.style.width = "150px";
                glel.save_goto_dashboard_btn.style.height = "35px"; 
                glel.save_goto_dashboard_btn.innerHTML = "Go to dashboard";
                glel.save_goto_dashboard_btn.addEventListener("click",_glbl.fns.goToDashboard);
            glel.save_goto_dashboard_div.appendChild(glel.save_goto_dashboard_btn);

            // Upload file button
            glel.save_db_file_btn_div = document.createElement("div");
            glel.save_db_file_btn_div.className = "save_db_file_btn_div" ;
            glel.save_db_file_btn_div.style.width = "600px";
            glel.save_db_file_btn_div.style.height = "50px";

            glel.save_db_file_btn = document.createElement("button");
            glel.save_db_file_btn.innerHTML = "Save to file";
            glel.save_db_file_btn_div.appendChild(glel.save_db_file_btn);
            glel.save_db_file_btn_div.addEventListener("click", _glbl.fns.saveDBToFile);
            
    // The console div
    glel.save_consolemain = document.createElement("div");
    glel.save_consolemain.className = "save_consolemain";
    glel.save_consolemain.style.width = "1200px";
    glel.save_consolemain.style.height = "600px";

    glel.save_db_file_main.appendChild(glel.save_db_filediv);
    glel.save_db_file_main.appendChild(glel.save_db_file_spacer);
    glel.save_db_file_main.appendChild(glel.save_db_file_btn_div);
    glel.save_db_file_main.appendChild(glel.save_goto_dashboard_div);  

    glel.save_db_main.appendChild(glel.save_db_file_main);
    glel.save_db_main.appendChild(glel.save_db_exp_txt);
    
};
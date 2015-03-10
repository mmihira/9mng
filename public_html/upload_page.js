/**
 * Creates the upload page. Add all created elements to the global glel
 * @returns {undefined}
 */

_glbl.fns.goToLoadFromNewPage = function ()
{
    $(glel.cn_upload_file_btn).off();
    $(glel.cn_upload_file_btn).on("click", _glbl.fns.uploadFile);
    
    glel.cn_exp_txt.innerHTML = "<p>Select a file to upload to the new database and then click upload.<p>";
    glel.cn_exp_txt.innerHTML += "<p> Make sure the type of account is selected properly below.<p>";
    glel.cn_exp_txt.innerHTML += "<p> Any new data to put into database must occur after most recent data allready existing in database<p>";
    glel.cn_exp_txt.innerHTML += "<p> File extension must be .txt or .csv <p>";
    
    // add the selection menu if not there.
    if( $(glel.cn_upload_file_main).has(glel.cn_acc_selection_div).length === 0 )
    {
        // add the dasboard buttion
        var ins_af = $(glel.cn_upload_file_spacer).after(glel.cn_acc_selection_div);
    }
    
    _glbl.main.contents().detach();
    _glbl.main.append(glel.cn_upload_main);
    _glbl.main.append(glel.cn_consolemain);
};


_glbl.fns.createConfig = function(complete_fn)
{
    return {
    //delimiter: $('#delimiter').val(),
    //header: $('#header').prop('checked'),
    //dynamicTyping: $('#dynamicTyping').prop('checked'),
    //fastMode: $('#fastMode').prop('checked'),
    //preview: parseInt($('#preview').val() || 0),
    //step: $('#stream').prop('checked') ? stepFn : undefined,
    //encoding: $('#encoding').val(),
    //worker: $('#worker').prop('checked'),
    //comments: $('#comments').val(),
    complete: complete_fn
    //error: errorFn,
    //download: inputType == "remote"
    };
};
            
            
_glbl.fns.cnPapaComplete = function(results)
{
    _glbl.dbint.addNewToDatabase(results);
    glel.cn_upload_file_btn.disabled = false;
    glel.cn_upload_file.disabled = false;
    $('#fileToParse').val(""); 

};

_glbl.fns.uploadFile = function()
{
    // Make sure a file is selection
    if (!$('#fileToParse')[0].files.length)
    {
        alert("Please choose at least one file to parse.");
        return false;
    }

    // Make sure that an option is selected
    if (glel.cn_acc_selection_drop_down.value === "DEFAULT")
    {
        alert("Please select an account option");
        return false;
    }

    if (!glel.cn_upload_file_btn.disabled)
    {
        // Prevent multiple clicks of the button from doing anything.
        // Also disable chaing the input file selection
        glel.cn_upload_file_btn.disabled = true;
        glel.cn_upload_file.disabled = true;

        //create the config file
        var config_ = _glbl.fns.createConfig(_glbl.fns.cnPapaComplete);
        var optns_ = {
            config: config_

        };

        // parse the file.
        glel.cn_consolemain.innerHTML += "<br>-----------------------------------------------------------------------------------<br>";
        glel.cn_consolemain.innerHTML += "Starting parsing of " +glel.cn_upload_file.value.replace("C:\\fakepath\\", "") + "...<br>";
        $("#fileToParse").parse(optns_);
    }

};


function createUploadpage()
{
    var _h = 200;                
    // The main div which holds the explanation, file selection, option lookup, and upload button
    glel.cn_upload_main = document.createElement("div");
    glel.cn_upload_main.className = "cn_uploadmain";
    glel.cn_upload_main.style.height = _h + "px";
    glel.cn_upload_main.style.width = "1200px";
        // Explanation div
        glel.cn_exp_txt = document.createElement("div");
        glel.cn_exp_txt.className = "cn_exptxt";
        glel.cn_exp_txt.style.width = "600px";
        glel.cn_exp_txt.style.height = _h + "px";               
        

        // Sub div for the file selction, option lookup and upload button.
        glel.cn_upload_file_main = document.createElement("div");
        glel.cn_upload_file_main.className = "cn_upload_file_main";
        glel.cn_upload_file_main.style.width = "600px";
        glel.cn_upload_file_main.style.height = _h + "px"; 
            // A div to contain the upload file 
            glel.cn_upload_filediv = document.createElement("div");
            glel.cn_upload_filediv.className = "cn_upload_filediv";
            glel.cn_upload_filediv.display = "block";
            glel.cn_upload_filediv.style.height = _h/2 + "px";
            glel.cn_upload_filediv.style.width = "600px";
                // Upload file selection                
                glel.cn_upload_file = document.createElement("input");
                glel.cn_upload_file.id = "fileToParse";
                glel.cn_upload_file.type = "file";
                glel.cn_upload_file.style.display = "inline";
            //spacer between selection and upload file btn
            glel.cn_upload_file_spacer = document.createElement("div");
            glel.cn_upload_file_spacer.style.display = "block";
            glel.cn_upload_file_spacer.style.height = "10px";

            // The selection options
            glel.cn_acc_selection_div = document.createElement("div");
            glel.cn_acc_selection_div.className = "cn_upload_selection";
            glel.cn_acc_selection_div.style.width = "600px";
            glel.cn_acc_selection_div.style.height = "50px";
                glel.cn_acc_selection_drop_down = document.createElement("select");
                glel.cn_acc_selection_drop_down.className = "cn_dropdown";                            
                    glel.cn_acc_selection_options = [];
                    // Setup the default option
                    glel.cn_acc_selection_options.push(document.createElement("option"));
                    glel.cn_acc_selection_options[glel.cn_acc_selection_options.length -1].value = "DEFAULT";
                    glel.cn_acc_selection_options[glel.cn_acc_selection_options.length -1].innerHTML = "";
                    glel.cn_acc_selection_drop_down.appendChild(glel.cn_acc_selection_options[glel.cn_acc_selection_options.length -1]);
                    // Add the options according the _glbl.accTypes
                    for (var i in _glbl.accTypes )
                    {
                        glel.cn_acc_selection_options.push(document.createElement("option"));
                        var back = glel.cn_acc_selection_options[glel.cn_acc_selection_options.length -1];
                        back.value = _glbl.accTypes[i];
                        back.innerHTML = _glbl.accTypes[i];
                        glel.cn_acc_selection_drop_down.appendChild(back);
                    }
            glel.cn_acc_selection_div.appendChild(glel.cn_acc_selection_drop_down);

            // Dashboard button. Only added after a processing completes successfully.
            glel.cn_dashboard_div = document.createElement("div");
            glel.cn_dashboard_div.className = "toDashboardMain";
            glel.cn_dashboard_div.style.width = "600px";
            glel.cn_dashboard_div.style.height = "10px";
                glel.cn_dashboard_btn = document.createElement("button");
                //glel.cn_dashboard_btn.className = "toDashboard";
                glel.cn_dashboard_btn.style.width = "150px";
                glel.cn_dashboard_btn.style.height = "35px"; 
                glel.cn_dashboard_btn.innerHTML = "Go to dashboard";
                glel.cn_dashboard_btn.addEventListener("click",_glbl.fns.goToDashboard);
            glel.cn_dashboard_div.appendChild(glel.cn_dashboard_btn);

            // Upload file button
            glel.cn_upload_file_btn_div = document.createElement("div");
            glel.cn_upload_file_btn_div.className = "cn_upload_file_btn_div" ;
            glel.cn_upload_file_btn_div.style.width = "600px";
            glel.cn_upload_file_btn_div.style.height = "50px";

            glel.cn_upload_file_btn = document.createElement("button");
            glel.cn_upload_file_btn.innerHTML = "Load selected file";
            glel.cn_upload_file_btn_div.appendChild(glel.cn_upload_file_btn);
            


    glel.cn_upload_file_main.appendChild(glel.cn_upload_filediv);
    glel.cn_upload_file_main.appendChild(glel.cn_upload_file_spacer);
    //glel.cn_upload_file_main.appendChild(glel.cn_acc_selection_div);
    glel.cn_upload_file_main.appendChild(glel.cn_upload_file_btn_div);
    glel.cn_upload_filediv.appendChild(glel.cn_upload_file);



    // The console div
    glel.cn_consolemain = document.createElement("div");
    glel.cn_consolemain.className = "cn_consolemain";
    glel.cn_consolemain.style.width = "1200px";
    glel.cn_consolemain.style.height = "600px";

    glel.cn_upload_main.appendChild(glel.cn_upload_file_main);
    glel.cn_upload_main.appendChild(glel.cn_exp_txt);
                
                
};
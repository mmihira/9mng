_glbl.fns.goToExtDatabasePage = function()
{
    // show the dasboard button if required
    if( $(glel.cn_upload_file_main).has(glel.cn_dashboard_div).length === 0 )
    {
        // add the dasboard buttion
        var ins_af = $(glel.cn_upload_file_btn_div).after(glel.cn_dashboard_div);
    }
    
    // remove the drop down if present
    if( $(glel.cn_upload_file_main).has(glel.cn_upload_file_spacer).length)
    {
        // add the dasboard buttion
        $(glel.cn_acc_selection_div).detach();
    }
    
    glel.cn_exp_txt.innerHTML = "<p>Select the text file save previously.<p>";
    glel.cn_exp_txt.innerHTML += "<p> File extension must be .txt or .csv <p>";
    
    // update the upload button event
    $(glel.cn_upload_file_btn).off();
    $(glel.cn_upload_file_btn).on("click",_glbl.fns.uploadExFile);
    
    //update the page.
    _glbl.main.contents().detach();
    _glbl.main.append(glel.cn_upload_main);
    _glbl.main.append(glel.cn_consolemain);
    
};
            
_glbl.fns.exPapaComplete = function(results)
{
    _glbl.dbint.addExtToDatabase(results);
    glel.cn_upload_file_btn.disabled = false;
    glel.cn_upload_file.disabled = false;
    $('#fileToParse').val("");

};

_glbl.fns.uploadExFile = function()
{
    // Make sure a file is selected
    if (!$('#fileToParse')[0].files.length)
    {
        alert("Please choose at least one file to parse.");
        return false;
    }


    if (!glel.cn_upload_file_btn.disabled)
    {
        // Prevent multiple clicks of the button from doing anything.
        // Also disable chaing the input file selection
        glel.cn_upload_file_btn.disabled = true;
        glel.cn_upload_file.disabled = true;

        //create the config file
        var config_ = _glbl.fns.createConfig(_glbl.fns.exPapaComplete);
        var optns_ = {
            config: config_

        };

        // parse the file.
        glel.cn_consolemain.innerHTML += "<br>-----------------------------------------------------------------------------------<br>";
        glel.cn_consolemain.innerHTML += "Starting parsing of " +glel.cn_upload_file.value.replace("C:\\fakepath\\", "") + "...<br>";
        $("#fileToParse").parse(optns_);
    }

};


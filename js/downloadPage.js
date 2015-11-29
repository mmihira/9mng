
_glbl.downloadDatabaseCallBack = function(){

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


}

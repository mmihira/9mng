/**
 *
 * Note: modules are only loaded once even if multiple modules require it.
 * Functions in this service
 * 
 * parseData : Called by the downloadForm controller in its callback function
 *             for when the user clicks the download button
 * papaComplete: The callback function executed by papaparse on behalf of
 *               the parseData function.
 */
angular.module('service.downloadFormService',['service.database']).factory('downloadFormService',['dB',function(dB){

    var dlForm = {};

    dlForm.fileName = "None";
    dlForm.accountSelected = "None";

    // Used by papaParse 
    dlForm.elementReference = null;

    dlForm.changeFileName = function(newFileName){
        dlForm.fileName = newFileName;
    }

    /**
     * This function is called by th downloadForm controller when
     * the submit button is clicked
     */
    dlForm.parseData = function(){

        // Note this function call doesn't not block.
        // The parsing is done asynchronously and
        // the complettion handler specfied completed
        // when execution has finished.

        $(dlForm.elementReference).parse({
            config: {
                        complete: dlForm.papaComplete
                    }
            });

    };

    /**
     * Called after papaParse has completed parsing the data from
     * the form
     */ 
    dlForm.papaComplete = function(results){

        dB.addToDataBaseFromFile(results,'acc');

    };

    return dlForm;

}]);

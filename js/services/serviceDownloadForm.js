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
angular.module('service.downloadFormService',['service.databaseInterface','service.mainAppLinker']).service('downloadFormService',
        ['dBInt','mainAppLinker',function(dBInt,mAppLn){

    var dlForm = {};
    
    // The name of the file which has been selected
    dlForm.fileName = "None";
    // The account which has been selected
    dlForm.accountSelected = {value:""};
    // The messages in the  log
    dlForm.log = [];
    // Used by papaParse 
    dlForm.elementReference = null;
    // Used to decide the functionality of the submit button on the form
    dlForm.formBehaviour = {
        downloadFromExistingFile:false,
        updateDatabase:false
    };


    /**
     * Set the form behaviour to that specified by
     * the behaviour argument. The behaviour arugment
     * must be a key in dlForm.behaviour.
     */
    dlForm.setFormBehaviour = function(behaviour){

        for(var i in dlForm.formBehaviour){
            dlForm.formBehaviour[i] = false;
        }

        dlForm.formBehaviour[behaviour] = true;
    };


    dlForm.changeFileName = function(newFileName){
        dlForm.fileName = newFileName;
    };

    /**
     * This function is called by th downloadForm controller when
     * the submit button is clicked
     */
    dlForm.parseData = function(scope){

        // Note this function call doesn't not block.
        // The parsing is done asynchronously and
        // the complettion handler specfied completed
        // when execution has finished.

        $(dlForm.elementReference).parse({
            config: {
                        complete: dlForm.papaComplete(scope)
                    }
            });

    };

    /**
     * Called after papaParse has completed parsing the data from
     * the form also note that this funtion is not called in the
     * angular context therefore we have to manually call it inside.
     */ 
    dlForm.papaComplete = function(_scope){
        var scope = _scope;
        var _accSelected = dlForm.accountSelected;
        
        return function(results){

            if(dlForm.formBehaviour.downloadFromExistingFile){
                mAppLn.inSetup.value = false;
                scope.$apply(dBInt.addToDataBaseFromfileExisting(   
                            results,
                            (function(){
                            var log = dlForm.log;
                            return function(msg){
                                log.push(msg);
                                };

                            }())
                ));


            }else if(dlForm.formBehaviour.updateDatabase){
                if( _accSelected.value === "" ){

                    alert("Select a valid account");

                }else{

                    mAppLn.inSetup.value = false;
                    scope.$apply(dBInt.addToDataBaseFromFileNew(   
                            results,
                            _accSelected.value,
                            (function(){
                            var log = dlForm.log;
                            return function(msg){
                                log.push(msg);
                                };

                            }())
                    ));

                }


            }
        };
    };

    return dlForm;

}]);

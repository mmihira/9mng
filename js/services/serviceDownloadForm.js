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
    
    dlForm.fileName = "None";
    dlForm.accountSelected = "None";
    dlForm.log = [];

    // Used by papaParse 
    dlForm.elementReference = null;

    dlForm.changeFileName = function(newFileName){
        dlForm.fileName = newFileName;
    }

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
        var appLn = mAppLn;
        
        return function(results){

            if(appLn.downLoadFromFile){

                scope.$apply(dBInt.addToDataBaseFromfileExisting(   
                            results,
                            (function(){
                            var log = dlForm.log;
                            return function(msg){
                                log.push(msg);
                                console.log(log);
                                };

                            }())
                ));

            }else{

                scope.$apply(dBInt.addToDataBaseFromFileNew(   
                            results,
                            'acc',
                            (function(){
                            var log = dlForm.log;
                            return function(msg){
                                log.push(msg);
                                console.log(log);
                                };

                            }())
                ));
            }
        };
    };

    return dlForm;

}]);

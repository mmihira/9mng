/*
 * 
 */
angular.module('controller.downloadForm',['service.mainAppLinker','service.downloadFormService']).controller(
        'downloadFormController',['mainAppLinker','downloadFormService','$scope', function(mAppLn,dlFormServ,$scope){

                var self = this;

                // log is a string of objects which are printed
                // in the given log
                self.log = dlFormServ.log;

                self.hideDownLoadForm =  mAppLn.hideDownLoadForm;
                self.hideDownLoadFormAcc = mAppLn.hideDownLoadFormAcc;


                self.onSubmitCallBack = function(){
                    console.log($scope);

                    // Make sure a file is selected
                    if ( dlFormServ.fileName == "None" )
                    {
                        alert("Please choose at least one file to parse.");
                        return false;
                    }

                    // Make sure that an option is selected
                    dlFormServ.parseData($scope);

                }



        
}]);

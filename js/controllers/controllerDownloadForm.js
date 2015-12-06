/*
 * 
 */
angular.module('controller.downloadForm',['service.mainAppLinker','service.downloadFormService']).controller(
        'downloadFormController',['mainAppLinker','downloadFormService','$scope','$rootScope', 
        function(mAppLn,dlFormServ,$scope,$rootScope){

                var self = this;

                // log is a string of objects which are printed
                // in the given log
                self.log = dlFormServ.log;

                self.hideDownLoadForm =  mAppLn.hideDownLoadForm;
                self.hideDownLoadFormAcc = mAppLn.hideDownLoadFormAcc;


                self.onSubmitCallBack = function(){

                    // Make sure a file is selected
                    if ( dlFormServ.fileName == "None" )
                    {
                        alert("Please choose at least one file to parse.");
                        return false;
                    }

                    // Make sure that an option is selected
                    dlFormServ.parseData($scope);

                }

                // Let's other controllers clear the log when necessary
                $rootScope.$on('clearLog',function(){ self.log.length = 0;});



        
}]);

/*
 * 
 */
angular.module('controller.downloadForm',['service.Config','service.mainAppLinker','service.downloadFormService']).controller(
        'downloadFormController',['config','mainAppLinker','downloadFormService','$scope','$rootScope', 
        function(config,mAppLn,dlFormServ,$scope,$rootScope){

                var self = this;

                // log is a string of objects which are printed
                // in the given log
                self.log = dlFormServ.log;

                self.hideDownLoadForm =  mAppLn.hideDownLoadForm;
                self.hideDownLoadFormAcc = mAppLn.hideDownLoadFormAcc;
                self.accountNames = config.accountNames;
                self.selectedAccountName = dlFormServ.accountSelected;


                self.onSubmitCallBack = function(){

                    // Make sure a file is selected
                    if ( dlFormServ.fileName == "None" )
                    {
                        alert("Please choose at least one file to parse.");
                        return false;
                    }

                    self.log.length = 0;

                    self.log.push("Downloading from : " + dlFormServ.fileName );

                    // Make sure that an option is selected
                    dlFormServ.parseData($scope);

                };

                // Let's other controllers clear the log when necessary
                $rootScope.$on('clearLog',function(){ self.log.length = 0;});



        
}]);

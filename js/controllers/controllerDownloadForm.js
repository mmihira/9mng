/*
 * 
 */
angular.module('controller.downloadForm',['service.downloadFormService']).controller(
        'downloadFormController',['downloadFormService','$scope', function(dlFormServ,$scope){

                var self = this;

                // log is a string of objects which are printed
                // in the given log
                self.log = dlFormServ.log;

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

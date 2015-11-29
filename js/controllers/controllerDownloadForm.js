/*
 * 
 */
angular.module('controller.downloadForm',['service.downloadFormService']).controller(
        'downloadFormController',['downloadFormService', function(dlFormServ){

                var self = this;

                // log is a string of objects which are printed
                // in the given log
                self.log = [];

                self.onSubmitCallBack = function(){

                    // Make sure a file is selected
                    if ( dlFormServ.fileName == "None" )
                    {
                        alert("Please choose at least one file to parse.");
                        return false;
                    }

                    // Make sure that an option is selected
                    //
                    dlFormServ.parseData();

                }

        
}]);

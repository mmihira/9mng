/**
 * This directive creates a custome input of type=file. We rely on a custom css class called btn-file.
 * On linking this directive will create a variable called filename in the isolated scope which is the
 * file currently selected by the user in the input. We attache an event handler so that when the
 * user changes the file the fileName is updates and is visible to the user.
 * 
 * We also employ the downloadForm service which holds the necessary state variables and application
 * logic for downloading the data and creating a database.
 *
 */
angular.module("directive.input.label",['service.downloadFormService']).directive("updateLabel", [ 'downloadFormService', function(dlFormServ){
    return {

        restrict: "E",

        scope : {},

        template: "<label id=\"downloadId\"  for=\"exstFileDownload\">Download : </label><span class=\"btn btn-default btn-file\" id=\"exstFileDownload\" ><input type=\"file\">ChooseFile : {{ fileName }}</input></span>",

        link: function(scope,element,attr){
            // Expose a new variable to the parent scope
            scope.fileName = "None";
            dlFormServ.elementReference = element.find('input');
            
            // When the user selects a new file update the fileName in the variable 
            // and also in the service.
            element.on('change',
                function(){
                    // Create a closure to avoid confusion with name variables
                    var _scope = scope;
                    var _element = element.find('input');
                    var _downloadService = dlFormServ;
                    // This is the function that is called when the user changes the
                    // file selected in the input.
                    return function(){
                        _scope.$apply(function(){
                            // Change the file name in the scope
                            _scope.fileName = _element[0].files[0].name;
                            // Change the file name in the shared service
                            _downloadService.changeFileName(_element[0].files[0].name);
                        });
                    };
            }());
        }
    };
}]);

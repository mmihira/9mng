angular.module('controller.dashBoard',['service.mainAppLinker','service.databaseInterface']).controller(
'dashBoardController',['mainAppLinker','dBInt',
function(mAppLn,dBInt){

    var self = this;

    self.hideDashboard = mAppLn.hideDashboard;


    self.testFilter = function(){

        var ret = dBInt.filterData(['all'],['all'],'SAVER',{nIncCat:['Food','Fuel','Salary']});
        console.log(ret);

    };


}]);

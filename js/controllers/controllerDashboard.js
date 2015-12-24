angular.module('controller.dashBoard',['service.netPosition','service.mainAppLinker','service.databaseInterface']).controller(
'dashBoardController',['netPosChart','mainAppLinker','dBInt',
function(netPos,mAppLn,dBInt){

    var self = this;

    self.hideDashboard = mAppLn.hideDashboard;
    self.dimensions = {height: 350};
    self.data = netPos.data;

    // Toggle this value to update the chart
    self.updateChart = netPos.updateChart; 


    self.testFilter = function(){

        var ret = dBInt.filterData(['all'],['all'],'SAVER',{nIncCat:['Food','Fuel','Salary']});
        console.log(ret);

    };


}]);

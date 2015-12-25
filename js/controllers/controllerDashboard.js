angular.module('controller.dashBoard',['service.netPosition','service.mainAppLinker',
        'service.databaseInterface','service.netCashFlow']).controller(
'dashBoardController',['netPosChart','mainAppLinker','dBInt','netCashFlow',
function(netPos,mAppLn,dBInt,netCashFlow){

    var self = this;

    self.hideDashboard = mAppLn.hideDashboard;
    self.dimensions = {height: 350};
    self.netPosData = netPos.data;
    self.netCashFlowData = netCashFlow.data;

    // Toggle this value to update the chart
    self.updateNP = netPos.updateChart; 
    self.updateNCF = netCashFlow.updateChart;


    self.testFilter = function(){

        var ret = dBInt.filterData(['all'],['all'],'SAVER',{nIncCat:['Food','Fuel','Salary']});
        console.log(ret);

    };


}]);

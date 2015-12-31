angular.module('controller.dashBoard',['service.netPosition','service.mainAppLinker',
        'service.databaseInterface','service.netCashFlow','service.balanceSheet']).controller(
'dashBoardController',['netPosChart','mainAppLinker','dBInt','netCashFlow','balanceSheet',
function(netPos,mAppLn,dBInt,netCashFlow,balanceSheet){

    var self = this;

    self.hideDashboard = mAppLn.hideDashboard;
    self.dimensions = {height: 350};
    self.netPosData = netPos.data;
    self.netCashFlowData = netCashFlow.data;
    self.balanceData = balanceSheet.data;

    // Toggle this value to update the chart
    self.updateNP = netPos.updateChart; 
    self.updateNCF = netCashFlow.updateChart;
    self.updateBS = balanceSheet.updateTable;
    
    


    self.testFilter = function(){

        var ret = dBInt.filterData(['all'],['all'],'SAVER',{nIncCat:['Food','Fuel','Salary']});
        console.log(ret);

    };


}]);

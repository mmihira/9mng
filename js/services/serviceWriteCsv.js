
angular.module('service.writeCsv',[]).service('writeCsv',function(){
    var ret = {}

    ret.dataFormat ={
        acc=0;
        id=1;
        day=2;
        month=3;
        year=4;
        desc=5;
        value=6;
        balance=7;
        category=9;
    };

    return ret;

});

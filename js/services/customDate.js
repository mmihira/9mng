/**
 * A custome date service because we do not know the format that
 * the dates input will be in. The javascript Date.parse function
 * assumes that dates will be formated ISO 8601 however other
 * formats may have to be dealt with.
 */
angular.module('service.customDateParser',[]).service('customDateParser',function(){

    var dPsr={};

    /**
     * @parm    dateString    Assume the input date is in the DD/MM/YYYY format.
     * @return                A Date object
     */
    dPsr.parseCom = function(dateString){

        var day = dateString.slice(0,2);
        var month = dateString.slice(3,5);
        var year = dateString.slice(6,10);

        var ret = new Date(year,month,day,0,0,0);

        return ret;
    };

    return dPsr;

});

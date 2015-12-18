
angular.module('service.CSVWriter',['service.CSVFormat','service.database','service.categoryDatabase']).service('CSVWriter',
        ['CSVFormat','dB','catDB',function(csvF,dB,catDB){

    var csvW = {};

    csvW.save = function(){


        // create the text;
        var o = "";
        var x = dB.allData;
        
        o += "%catstart\n";
        
        for( i in _glbl.cat_db){
            o += _glbl.cat_db[i]["name"] +"," + _glbl.cat_db[i]["tag"] + "\n";
        }
        
        o += "%catend\n" ;
        o += "%catvalstart\n";

        for(i in _glbl.cat){
            o += i +"," + _glbl.cat[i]["name"] + "\n";
        }
        
        o += "%catvalend\n";
        for( var i in _glbl.db.all_data)
        {
            o += x[i][s.acc] 
                    + "," + x[i][s.uid] 
                    + "," + x[i][s.day]  
                    + "," + x[i][s.month]
                    + "," + x[i][s.year]
                    + "," + "\""+x[i][s.desc]+"\""
                    + "," + x[i][s.val].toPlainString()
                    + "," + x[i][s.bal].toPlainString()
                    + "," + "\""+x[i][s.cid]+"\""
                    + "," + "\""+x[i][s.cat]+"\""
                    +"\n";
        }
        
        var content = o;
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();

        if(dd<10) {
            dd='0'+dd;
        } 

        if(mm<10) {
            mm='0'+mm;
        } 

        today = yyyy+'_'+mm+'_'+dd;
        var filename = today+"_"+"finance_db.txt";
        var contentType = "text/plain";
        var a = document.createElement('a');
        var blob = new Blob([content], {'type':contentType});
        a.href = window.URL.createObjectURL(blob);
        a.download = filename;
        a.click();

    };




    return csvW;


}]);


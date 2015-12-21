/**
 * CVSVWriter service is used to write data to files.
 */
angular.module('service.CSVWriter',['service.CSVFormat','service.database','service.categoryDatabase']).service('CSVWriter',
        ['CSVFormat','dB','catDB',function(csvF,dB,catDB){

    var csvW = {};

    csvW.save = function(){


        // create the text;
        var o = "";
        var allData = dB.allData;
        
        o += "%catstart\n";
        
        for( i in catDB.dB){
            o += catDB.dB[i]["name"] +"," + catDB.dB[i]["tag"] + "\n";
        }
        
        o += "%catend\n" ;
        o += "%catvalstart\n";

        for(i in catDB.dBIdentifiers){
            o += i +"," + catDB.dBIdentifiers[i]["name"] + "\n";
        }
        
        o += "%catvalend\n";


        // variable to hold the catString
        var catString = "";


        for( var i in allData)
        {

            // The category may not be defined so
            // determine that initially
            if( allData[i]['category'] == null){
                catString = "";
            }else{
                catString = allData[i]['category'].name;
            }
            
            o += allData[i]['acc'] 
                    + "," + allData[i]['date'].getDate()  
                    // Note we add 1 to month
                    + "," + (allData[i]['date'].getMonth()+1)
                    + "," + allData[i]['date'].getFullYear()
                    + "," + "\""+allData[i]['description']+"\""
                    + "," + allData[i]['value'].toPlainString()
                    + "," + allData[i]['balance'].toPlainString()
                    + "," + "\""+catString+"\""
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

        var clickEvent = new MouseEvent("click", {
            "view": window,
            "bubbles": true,
            "cancelable": false
        });

        today = yyyy+'_'+mm+'_'+dd;
        var filename = today+"_"+"finance_db.txt";
        var contentType = "text/plain";
        var a = document.createElement('a');
        var blob = new Blob([content], {'type':contentType});
        a.href = window.URL.createObjectURL(blob);
        a.download = filename;
        a.dispatchEvent(clickEvent);

    };




    return csvW;


}]);


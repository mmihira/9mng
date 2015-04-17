_glbl.cfstat.createNewCashFlowStat = function () {

    // Determine the latest year
    // We will assume SAVER account has the most values
    var latestYear = [];
    for (var i in _glbl.db.d_map["SAVER"]) {
        latestYear.push(parseInt(i));
    }
    latestYear = latestYear.sort();
    latestYear = latestYear[latestYear.length - 1];
    var latestYearInt = latestYear;

    // Determine the latest month in that year
    var latestMonth = [];
    for (var i in _glbl.db.d_map["SAVER"][latestYear.toString()]) {

        latestMonth.push(parseInt(i));
    }
    latestMonth = latestMonth.sort();
    var latestMonthInt = latestMonth[latestMonth.length - 1];
    // convert month to format "0x" if need be
    var convertToMMStringFormat = function (month) {
        if (month < 10) {
            return "0" + month;
        }
        else
        {
            return month.toString();
        }

    };

    latestMonth = [convertToMMStringFormat(latestMonthInt)];

    latestYear = [latestYear.toString()];

    // find month before
    var monthBefore;
    var yearBefore;
    if (latestMonthInt === 1) {
        var monthBefore = 12;
        var yearBefore = latestYearInt - 1;
    }
    else
    {
        var monthBefore = latestMonthInt - 1;
        var yearBefore = latestYearInt;
    }

    // find month before that
    var monthBefore2;
    var yearBefore2;
    if (monthBefore === 1) {
        var monthBefore2 = 12;
        var yearBefore2 = yearBefore - 1;
    }
    else
    {
        var monthBefore2 = monthBefore - 1;
        var yearBefore2 = yearBefore;
    }

    var IncomeTagsVec = _glbl.cfstat.findIncomeTags();



    // get the net position
    var netPosition = _glbl.dbint.get_net_position(latestYear, "SAVER", latestMonth)[0][1] +
            _glbl.dbint.get_net_position(latestYear, "GOAL", latestMonth)[0][1] +
            _glbl.dbint.get_net_position(latestYear, "NETBANK", latestMonth)[0][1];

    var monthDict = {
        _01: "January",
        _02: "February",
        _03: "March",
        _04: "April",
        _05: "May",
        _06: "June",
        _07: "July",
        _08: "August",
        _09: "September",
        _10: "October",
        _11: "Novemeber",
        _12: "December"
    };

    // Title for the cashflow statement table
    glel.cf_title = document.createElement("div");
    glel.cf_title.className = "cftitle";
    glel.cf_title.width = "500px";
    glel.cf_title.innerHTML = "Cashflow Statement";

    var tableColTotal = 5;

    // The main table
    glel.cf_table = document.createElement("table");
    glel.cf_table.className = "cftable";
    glel.cf_table.border = 1;

    // first row
    glel.cfTableRow1 = document.createElement("tr");
    // the net position
    glel.cf_netposrow = document.createElement("td");
    glel.cf_netposrow.colSpan = tableColTotal;

    glel.cf_netposrow.innerHTML = "Net Position : " + netPosition.toString();

    glel.cfTableRow1.appendChild(glel.cf_netposrow);
    // second row
    glel.cfTableRow2 = document.createElement("tr");
    // emtpy cell of size 2
    glel.row2col1to2 = document.createElement("td");
    glel.row2col1to2.colSpan = 2;

    glel.row2col3 = document.createElement("td");
    glel.row2col3.innerHTML = monthDict["_" + convertToMMStringFormat(latestMonthInt)];

    glel.row2col4 = document.createElement("td");
    glel.row2col4.innerHTML = monthDict["_" + convertToMMStringFormat(monthBefore)];

    glel.row2col5 = document.createElement("td");
    glel.row2col5.innerHTML = monthDict["_" + convertToMMStringFormat(monthBefore2)];

    glel.cfTableRow2.appendChild(glel.row2col1to2);
    glel.cfTableRow2.appendChild(glel.row2col3);
    glel.cfTableRow2.appendChild(glel.row2col4);
    glel.cfTableRow2.appendChild(glel.row2col5);

    // third row
    glel.cfTableRow3 = document.createElement("tr");
    glel.cfTableRow3.innerHTML = "Income";
    
    // rows for tags
    // structure of IncomeTagRowVec is 
    // [ { tbrow: <document.Element>, tbcells: [document.Element,... ] }....]
    glel.IncomeTagRowVec = [];
    for (var i in IncomeTagsVec ){
        
        var temp = { tbrow:document.createElement("tr"),tbcells:[]};
        // make the table cells
        for( var j = 0 ; j < tableColTotal; j++)
        {
            temp.tbcells.push(document.createElement("td"));
        }
        // the second of the cells contains the category name
        temp.tbcells[1].innerHTML = IncomeTagsVec[i];
        
        // append the table cells
        for( var k = 0 ;  k < temp.tbcells.length ; k++){
            
            temp.tbrow.appendChild(temp.tbcells[k]);
            
        }
        
        glel.IncomeTagRowVec.push (temp);
    }
    
    var elValFns = _glbl.retElValVector();
    
    // fill in the values for the 
    
    for( var i in glel.IncomeTagRowVec ){
        
        glel.IncomeTagRowVec[i].tbcells[2].innerHTML = elValFns[0].call(glel.IncomeTagRowVec[i].tbcells[1].innerHTML,
                                                                    latestYear[0],
                                                                    convertToMMStringFormat(latestMonthInt));
        
    }
    


    // Append all the rows
    glel.cf_table.appendChild(glel.cfTableRow1);
    glel.cf_table.appendChild(glel.cfTableRow2);
    glel.cf_table.appendChild(glel.cfTableRow3);
    // append the Income rows
    for(var i in glel.IncomeTagRowVec){
        glel.cf_table.appendChild( glel.IncomeTagRowVec[i].tbrow);
    }

    // Append the title and table
    glel.dsb_cfstatement.appendChild(glel.cf_title);
    glel.dsb_cfstatement.appendChild(glel.cf_table);

};


/**
 *  Returns a vector of category names from cat_db which have the category tag "Income"
 * @returns {[String,..]}
 */

_glbl.cfstat.findIncomeTags = function () {
    
    var ret = [];

    for (var i in _glbl.cat_db) {

        if (_glbl.cat_db[i].tag === "Expenditure") {
            ret.push( _glbl.cat_db[i].name); 
        }
    }
    
    return ret;


};

/**
 * Return the object used to determine what function is called
 * when calculating the value that goes into cells 3 onwards
 * for each of the categories
 * @return Vector [ Object,....]
 *          the object contained has a function varaible call which takes
 *          an argument category.
 *          the first element of the vector correspons to the first column after the labels
 */
_glbl.retElValVector = function() {
    
    
    var ret = [
                {
                    // yrs must be a string
                    // mo must be a string
                    // cat must be a string
                    call:function(cat,yrs,mo){
                        
                        var accVec = [];
                        for(var i in _glbl.accTypesForcfstats)
                        {
                            accVec.push( _glbl.dbint.get_data({  acc:_glbl.accTypesForcfstats[i],
                                                            val_bal:"val",
                                                            deb_cred:"any",
                                                            notinc:[],
                                                            notinccat:[],
                                                            inc:[],
                                                            inccat:[cat],
                                                            yrs:[yrs],
                                                            mo:[mo]                          
                                                            })
                                        );
                        }
                        
                        // Add the values from each diffirent category type
                        // structure of accVec is [[["text",BigDecimal,Floatvalue]]]
                        // since an implicit assumption is only one month of one year will be calculated
                        var retFloat = 0.0;
                        
                        for (var i in accVec){
                            retFloat = retFloat + accVec[i][0][2];
                           
                        }
                        
                        return retFloat;                        
                    }
                        
                }
    ];
    
    return ret;
    
};
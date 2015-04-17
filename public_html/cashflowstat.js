_glbl.cfstat.createNewCashFlowStat = function () {


    var latestDates = _glbl.cfstat.retLatest();
    console.log(latestDates);
    
    // get the net position
    var netPosition = _glbl.dbint.get_net_position([latestDates.latestYear], "SAVER", [latestDates.latestMonth])[0][1] +
            _glbl.dbint.get_net_position([latestDates.latestYear], "GOAL", [latestDates.latestMonth])[0][1] +
            _glbl.dbint.get_net_position([latestDates.latestYear], "NETBANK", [latestDates.latestMonth])[0][1];

    // Title for the cashflow statement table
    glel.cf_title = document.createElement("div");
    glel.cf_title.className = "cftitle";
    glel.cf_title.width = "500px";
    glel.cf_title.innerHTML = "Cashflow Statement";

    // --- Object containing the column information ---
    var elValFns = _glbl.cfstat.retElValVector();
    var tableColTotal = 5;

    // The main table
    glel.cf_table = document.createElement("table");
    glel.cf_table.className = "cftable";
    glel.cf_table.border = 1;

    /* --------------------------------------------  FIRST ROW -------------------------------------------- */
    glel.cfTableRow1 = document.createElement("tr");
    // the net position
    glel.cf_netposrow = document.createElement("td");
    glel.cf_netposrow.colSpan = tableColTotal;

    glel.cf_netposrow.innerHTML = "Net Position : " + netPosition.toString();

    glel.cfTableRow1.appendChild(glel.cf_netposrow);
    
    
    /* --------------------------------------------  SECOND ROW -------------------------------------------- */
    glel.cfTableRow2 = document.createElement("tr");
    // emtpy cell of size 2
    glel.row2col1to2 = document.createElement("td");
    glel.row2col1to2.colSpan = 2;
    
    glel.cfColumnHeaderLabel = [];
    for( var i in elValFns){
        var eltemp = document.createElement("td");
        eltemp.innerHTML = elValFns[i].colLabel;
        glel.cfColumnHeaderLabel.push(eltemp);
    }
    
    glel.cfTableRow2.appendChild(glel.row2col1to2);
    
    // Append the column labels
    for(var i in glel.cfColumnHeaderLabel){
        
        glel.cfTableRow2.appendChild(glel.cfColumnHeaderLabel[i]);
        
    }

    /* -------------------------------------------- INCOME TAG START -------------------------------------------- */ 
    
    glel.cfTableRow3 = document.createElement("tr");
    glel.cfTableRow3.innerHTML = "Income";
    
    
    // The tags to include
    var IncomeTagsVec = _glbl.cfstat.findTags("Income");
    
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
    
    
    
    // fill in the values for cells in all the income rows
    
    for( var i in glel.IncomeTagRowVec ){
        
        for( var j = 2; j <tableColTotal; j ++ ){
            glel.IncomeTagRowVec[i].tbcells[j].innerHTML = elValFns[j-2].call(glel.IncomeTagRowVec[i].tbcells[1].innerHTML);
        }
        
    }
    
    /* -------------------------------------------- EXPENDIURE TAG START -------------------------------------------- */
    
    // The Expenditure Tags
    var ExpendutreTagsVec = _glbl.cfstat.findTags("Expenditure");
    
    glel.cfTableRow4 = document.createElement("tr");
    glel.cfTableRow4.innerHTML = "Expenditure";
    
    // rows for tags
    // structure of ExpenditureTagRowVec is 
    // [ { tbrow: <document.Element>, tbcells: [document.Element,... ] }....]
    glel.ExpenditureRowVec = [];
    for (var i in ExpendutreTagsVec ){
        
        var temp = { tbrow:document.createElement("tr"),tbcells:[]};
        // make the table cells
        for( var j = 0 ; j < tableColTotal; j++)
        {
            temp.tbcells.push(document.createElement("td"));
        }
        // the second of the cells contains the category name
        temp.tbcells[1].innerHTML = ExpendutreTagsVec[i];
        
        // append the table cells
        for( var k = 0 ;  k < temp.tbcells.length ; k++){
            
            temp.tbrow.appendChild(temp.tbcells[k]);
            
        }
        
        glel.ExpenditureRowVec.push (temp);
    }
        
    // fill in the values for cells in all the income rows
 
    for( var i in glel.ExpenditureRowVec ){
        
        for( var j = 2; j <tableColTotal; j ++ ){
            glel.ExpenditureRowVec[i].tbcells[j].innerHTML = elValFns[j-2].call(glel.ExpenditureRowVec[i].tbcells[1].innerHTML);
        }
        
    }
    
    
    /* -------------------------------------------- TABLE END -------------------------------------------- */

    // Append all the rows
    
    glel.cf_table.appendChild(glel.cfTableRow1);
    glel.cf_table.appendChild(glel.cfTableRow2);
    
    glel.cf_table.appendChild(glel.cfTableRow3);
    // append the Income rows
    for(var i in glel.IncomeTagRowVec){
        glel.cf_table.appendChild( glel.IncomeTagRowVec[i].tbrow);
    }
    
    glel.cf_table.appendChild(glel.cfTableRow4);
    // append the Expenditure rows
    for(var i in glel.ExpenditureRowVec){
        glel.cf_table.appendChild( glel.ExpenditureRowVec[i].tbrow);
    }
    

    // Append the title and table
    glel.dsb_cfstatement.appendChild(glel.cf_title);
    glel.dsb_cfstatement.appendChild(glel.cf_table);

};


/**
 *  Returns a vector of category names from cat_db which have the category tag "Income"
 *  @param  {String}    the category tag to search for
 *  @returns {[String,..]}
 */
_glbl.cfstat.findTags = function (tag) {
    
    var ret = [];

    for (var i in _glbl.cat_db) {

        if (_glbl.cat_db[i].tag === tag) {
            ret.push( _glbl.cat_db[i].name); 
        }
    }
    
    return ret;

};





// convert month to format "0x" if need be
_glbl.cfstat.convertToMMStringFormat = function (month) {
        if (month < 10) {
            return "0" + month;
        }
        else
        {
            return month.toString();
        }

};

/**
 * Returns the latest month, and two months before
 * the years and months before respect the calender and will roll back to 12 if the latestMonth is 1 for example.
 * @returns Object {
 *                  latestMonthInt      {int}
 *                  latestMonth         {String}        as format "0x" or "11","12","10" etc
 *                  latestYear          {String}        as format "2013" etc
 *                  monthBefore         {String}        month before latestMonth as format "0x" or "11","12","10" etc
 *                  yearBefore          {String}        year before latestYear as format "2013" etc
 *                  monthBefore2        {String}        month before monthBefore as format "0x" or "11","12","10" etc
 *                  yearBefore2         {String}        year before yearBefore as format "2013" etc
 */
_glbl.cfstat.retLatest = function() {
    
    var ret = {};
    
    // Determine the latest year
    // We will assume SAVER account has the most values
    var latestYear = [];
    for (var i in _glbl.db.d_map["SAVER"]) {
        latestYear.push(parseInt(i));
    }

    latestYear = latestYear.sort();
    // get the latest year as a int
    latestYear = latestYear[latestYear.length - 1];
    // copy for later use
    var latestYearInt = latestYear;

    // Determine the latest month in that year
    var latestMonth = [];
    for (var i in _glbl.db.d_map["SAVER"][latestYear.toString()]) {

        latestMonth.push(parseInt(i));
    }
    latestMonth = latestMonth.sort();
    ret.latestMonthInt = latestMonth[latestMonth.length - 1];
    
    

    ret.latestMonth = _glbl.cfstat.convertToMMStringFormat(ret.latestMonthInt);

    ret.latestYear = latestYear.toString();

    // find month before
    if (ret.latestMonthInt === 1) {
        ret.monthBefore = 12;
        ret.yearBefore = latestYearInt - 1;
    }
    else
    {
        ret.monthBefore = ret.latestMonthInt - 1;
        ret.yearBefore = latestYearInt;
    }

    // find month before that
    if (ret.monthBefore === 1) {
        ret.monthBefore2 = 12;
        ret.yearBefore2 = ret.yearBefore - 1;
    }
    else
    {
        ret.monthBefore2 = ret.monthBefore - 1;
        ret.yearBefore2 = ret.yearBefore;
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
_glbl.cfstat.retElValVector = function() {
        
    var latestDates = _glbl.cfstat.retLatest();

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
    
    var ret = [
                // the third column ( first after the row label columns )
                {
                    colLabel : monthDict["_" + _glbl.cfstat.convertToMMStringFormat(latestDates.latestMonthInt)],
                    colLabelAsInt : latestDates.latestMonthInt,
                    yearAsString : latestDates.latestYear,
                    montAsString : _glbl.cfstat.convertToMMStringFormat(latestDates.latestMonthInt),
                    monthAsInt : latestDates.latestMonthInt,
                    
                    /**
                     * called by _glbl.cfstat.createNewCashFlowStat when determining the values for the table cells
                     * here we dfine the function that is called.
                     * @param {String} cat  The category for which this is calculated
                     */ 
                    call:function(cat){
                        
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
                                                            yrs:[latestDates.latestYear],
                                                            mo:[_glbl.cfstat.convertToMMStringFormat(latestDates.latestMonthInt)]                          
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
                        
                },
                
                // the fourth column
                {
                    colLabel : monthDict["_" + _glbl.cfstat.convertToMMStringFormat(latestDates.monthBefore)],
                    colLabelAsInt : latestDates.monthBefore,
                    yearAsString : latestDates.yearBefore,
                    montAsString : _glbl.cfstat.convertToMMStringFormat(latestDates.monthBefore),
                    monthAsInt : latestDates.monthBefore,
                    
                    /**
                     * called by _glbl.cfstat.createNewCashFlowStat when determining the values for the table cells
                     * here we dfine the function that is called.
                     * @param {String} cat  The category for which this is calculated
                     */ 
                    call:function(cat){
                        
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
                                                            yrs:[latestDates.yearBefore],
                                                            mo:[_glbl.cfstat.convertToMMStringFormat(latestDates.monthBefore)]                          
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
                        
                },
                
                // fifth column
                {
                    colLabel : monthDict["_" + _glbl.cfstat.convertToMMStringFormat(latestDates.monthBefore2)],
                    colLabelAsInt : latestDates.monthBefore2,
                    yearAsString : latestDates.yearBefore2,
                    montAsString : _glbl.cfstat.convertToMMStringFormat(latestDates.monthBefore2),
                    monthAsInt : latestDates.monthBefore2,
                    
                    /**
                     * called by _glbl.cfstat.createNewCashFlowStat when determining the values for the table cells
                     * here we dfine the function that is called.
                     * @param {String} cat  The category for which this is calculated
                     */ 
                    call:function(cat){
                        
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
                                                            yrs:[latestDates.yearBefore2],
                                                            mo:[_glbl.cfstat.convertToMMStringFormat(latestDates.monthBefore2)]                          
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
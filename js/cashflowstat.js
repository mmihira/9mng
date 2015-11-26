_glbl.cfstat.createNewCashFlowStat = function () {


    var latestDates = _glbl.cfstat.retLatest();
    console.log(latestDates);
    
    // get the net position
    var netPosition = 0;    
    // For later customisation
    var accs = ["SAVER", "GOAL", "NETBANK"];
    
    
    var nettemp = [];
    for( i in accs){
        
        nettemp = _glbl.dbint.get_net_position([latestDates.latestYear], "SAVER", [latestDates.latestMonth]);
        // Deal with when when one accounts has data from a month the others dont
        if(nettemp.length > 0){
            netPosition += nettemp[0][1];
        }       
    }

    // Title for the cashflow statement table
    glel.cf_title = document.createElement("div");
    glel.cf_title.className = "cftitle";
    glel.cf_title.width = "500px";
    //glel.cf_title.innerHTML = "Cashflow Statement";

    // --- Object containing the column information ---
    var elValFns = _glbl.cfstat.retElValVector();
    _glbl.cfstat.tableColTotal = 5;

    // The main table
    glel.cf_table = document.createElement("table");
    glel.cf_table.className = "cftable";
    glel.cf_table.border = 0;

    /* --------------------------------------------  FIRST ROW -------------------------------------------- */
    glel.cfTableRow1 = document.createElement("tr");
    // the net position
    glel.cf_netposrow = document.createElement("td");
    glel.cf_netposrow.colSpan = _glbl.cfstat.tableColTotal;

    glel.cf_netposrow.innerHTML = "Net Position : " + netPosition.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");;

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
    glel.cfTableRow3cell = document.createElement("td");
    glel.cfTableRow3cell.colSpan = _glbl.cfstat.tableColTotal;
    glel.cfTableRow3cell.innerHTML = "Income";    
    glel.cfTableRow3cell.className = "cfTableRow3cell";    
    glel.cfTableRow3.appendChild(glel.cfTableRow3cell);
    
    
    
    // The tags to include
    var IncomeTagsVec = _glbl.cfstat.findTags("Income");
    
    // rows for tags
    // structure of IncomeTagRowVec is 
    // [ { tbrow: <document.Element>, tbcells: [document.Element,... ] }....]
    glel.IncomeTagRowVec = [];
    for (var i in IncomeTagsVec ){
        
        var temp = { tbrow:document.createElement("tr"),tbcells:[]};
        // make the table cells
        for( var j = 0 ; j < _glbl.cfstat.tableColTotal; j++)
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
       
    
    
    /* -------------------------------------------- EXPENDIURE TAG START -------------------------------------------- */
    
    // The Expenditure Tags
    var ExpendutreTagsVec = _glbl.cfstat.findTags("Expenditure");
    
    // Expenditure row header
    
    glel.cfTableRow4 = document.createElement("tr");
    glel.cfTableRow4cell = document.createElement("td");
    glel.cfTableRow4cell.colSpan = _glbl.cfstat.tableColTotal;
    glel.cfTableRow4cell.innerHTML = "Expenditure";    
    glel.cfTableRow4cell.className = "cfTableRow3cell";    
    glel.cfTableRow4.appendChild(glel.cfTableRow4cell);
    
    
    
    // rows for tags
    // structure of ExpenditureTagRowVec is 
    // [ { tbrow: <document.Element>, tbcells: [document.Element,... ] }....]
    glel.ExpenditureRowVec = [];
    for (var i in ExpendutreTagsVec ){
        
        var temp = { tbrow:document.createElement("tr"),tbcells:[]};
        // make the table cells
        for( var j = 0 ; j < _glbl.cfstat.tableColTotal; j++)
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
        
    
    
    
    /******** The miscellanious Expenditure row ********/
    
    glel.ExpeditureMisc = { tbrow:document.createElement("tr"),tbcells:[]};
    var temp = glel.ExpeditureMisc;
    // make the table cells
    for( var j = 0 ; j < _glbl.cfstat.tableColTotal; j++)
    {
        temp.tbcells.push(document.createElement("td"));
    }
    // the second of the cells contains the category name
    temp.tbcells[1].innerHTML = "Misc Expenditure";
    
    // append the table cells
        for( var k = 0 ;  k < temp.tbcells.length ; k++){
            
            temp.tbrow.appendChild(temp.tbcells[k]);
            
        }
    
    glel.ExpenditureRowVec.push (temp);
    
    
    
    /* -------------------------------------------- FILL IN TABLE -------------------------------------------- */
    
    // fill in the values for cells in all the Expenditure Rows
    for( var i in glel.ExpenditureRowVec ){
        
        for( var j = 2; j <_glbl.cfstat.tableColTotal; j ++ ){
            var value = elValFns[j-2].call(glel.ExpenditureRowVec[i].tbcells[1].innerHTML) * -1;
            glel.ExpenditureRowVec[i].tbcells[j].innerHTML = value.toFixed(2) ;
        }
        
    }
    
    // fill in the values for cells in all the income rows
    for( var i in glel.IncomeTagRowVec ){
        
        for( var j = 2; j <_glbl.cfstat.tableColTotal; j ++ ){
            var value =  elValFns[j-2].call(glel.IncomeTagRowVec[i].tbcells[1].innerHTML);
            glel.IncomeTagRowVec[i].tbcells[j].innerHTML = value.toFixed(2);
        }
        
    }
    
    /* -------------------------------------------- Apply styling -------------------------------------------- */
    
    _glbl.cfstat.applyTableStyle();
    
    
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
 * Styles the table
 */
_glbl.cfstat.applyTableStyle = function(){

    // the top row
    glel.cf_netposrow.className = "netPositionStyle";
    
    //style the column headers
    for(var i in glel.cfColumnHeaderLabel){
        glel.cfColumnHeaderLabel[i].className = "cfTableColHeader";
        
        
    }
    
    // Apply styles to the Expediture value cells
    for( var i in glel.ExpenditureRowVec ){
        // The first two columns are dealt with differently
        for( var j = 2; j <_glbl.cfstat.tableColTotal; j ++ ){
            glel.ExpenditureRowVec[i].tbcells[j].className = "cftablevalel";
            
            //if the value is 0 then font color is white
            if (glel.ExpenditureRowVec[i].tbcells[j].innerHTML === "0.00"){
                
                glel.ExpenditureRowVec[i].tbcells[j].style.color = "#A8A3A3";
                
            }
            
        }
        
        // formate left spacer cell
        glel.ExpenditureRowVec[i].tbcells[0].className = "cftableleftspacecol";
        
    }
    
    // Apply styles to the Income value cells
    for( var i in glel.IncomeTagRowVec ){
        // The first two columns are dealt with differently
        for( var j = 2; j <_glbl.cfstat.tableColTotal; j ++ ){
            glel.IncomeTagRowVec[i].tbcells[j].className = "cftablevalel";
            
            //if the value is 0 then font color is white
            if (glel.IncomeTagRowVec[i].tbcells[j].innerHTML === "0.00"){
                
                glel.IncomeTagRowVec[i].tbcells[j].style.color = "#A8A3A3";
            }
                
            
            
        }
        
        // formate left spacer cell
        glel.IncomeTagRowVec[i].tbcells[0].className = "cftableleftspacecol";
        
    }
    
    
    
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
                        
                        return _glbl.cfstat.ElValVectorInnerFunction(latestDates.latestYear,
                                                                        latestDates.latestMonthInt,
                                                                        cat);                       
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
                        
                        return _glbl.cfstat.ElValVectorInnerFunction(latestDates.yearBefore,
                                                                        latestDates.monthBefore,
                                                                        cat);                      
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
                        
                        return _glbl.cfstat.ElValVectorInnerFunction(latestDates.yearBefore2,
                                                                        latestDates.monthBefore2,
                                                                        cat);
                                               
                    }
                        
                }
                
                
    ];
    
    return ret;
    
};

/**
 * This function is only called by _glbl.cfstat.retElValVector
 * For a specified category it calculates data that falls into that category
 * Only the specified month and year is calculated.
 * The accounts considered is stored in _glbl.accTypesForcfstats
 * @param   year    The only year considerd, as a string, example "2012"
 * @param   month   The only month considerd, as an integer value
 * @param   cat     The only category considered, as a String
 * @return          A Double value of the calculated data.
 *                  It will be 0.0 if year,month,cat or acc doesn't exist in database 
 */
_glbl.cfstat.ElValVectorInnerFunction = function(year,month,cat){
    
    var accVec = [];
    
    // Special case for the miscelanious expediture category which is not an actual category
    if(cat === glel.ExpeditureMisc.tbcells[1].innerHTML)
    {
        // For any other valid category
        for(var i in _glbl.accTypesForcfstats)
        {
            accVec.push( _glbl.dbint.get_data({  acc:_glbl.accTypesForcfstats[i],
                                            val_bal:"val",
                                            deb_cred:"deb",
                                            notinc:[],
                                            notinccat:[],
                                            notinccattag:[],
                                            inc:[],
                                            inccat:["NA"],
                                            yrs:[year],
                                            mo:[_glbl.cfstat.convertToMMStringFormat(month)]                          
                                            })
                        );
        }

        // Add the values from each diffirent category type
        // structure of accVec is [[["text",BigDecimal,Floatvalue]]]
        // since an implicit assumption is only one month of one year will be calculated
        var retFloat = 0.0;

        for (var i in accVec){
            // If the data exists for this particular account
            if( accVec[i].length > 0){
            retFloat = retFloat + accVec[i][0][2];
            }

        }

        return retFloat;
        
    }else{
        
        
        // For any other valid category
        for(var i in _glbl.accTypesForcfstats)
        {
            accVec.push( _glbl.dbint.get_data({  acc:_glbl.accTypesForcfstats[i],
                                            val_bal:"val",
                                            deb_cred:"any",
                                            notinc:[],
                                            notinccat:[],
                                            notinccattag:[],
                                            inc:[],
                                            inccat:[cat],
                                            yrs:[year],
                                            mo:[_glbl.cfstat.convertToMMStringFormat(month)]                          
                                            })
                        );
        }

        // Add the values from each diffirent category type
        // structure of accVec is [[["text",BigDecimal,Floatvalue]]]
        // since an implicit assumption is only one month of one year will be calculated
        var retFloat = 0.0;

        for (var i in accVec){
            // If the data exists for this particular account
            if( accVec[i].length > 0){
            retFloat = retFloat + accVec[i][0][2];
            }

        }

        return retFloat;
    }
};
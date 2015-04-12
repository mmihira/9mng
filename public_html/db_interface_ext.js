// function for handling a txt file with existing database
_glbl.dbint.addExtToDatabase = function (data)
{
    // Log program progress
    glel.cn_consolemain.innerHTML += "Parsing complete.";
    glel.cn_consolemain.innerHTML += "Rows of data to process : " + data.data.length + "<br>";
    
    // Make a reference to the results from papa parse.
    var x = data.data;
    
    // The first part of the data will be category and configuration data
    // format is like this key,value;.......;key=%catend;value=0; .. database rows begin.
    
    var z = 0;                                                  // Variable keeps track of index in x
    glel.cn_consolemain.innerHTML += "Adding category data.<br>";
    
    
    
    //Ignore the %catstart
    z++;
    
    var catendreached = false;
    var catcounter = 0;
    
    while(catendreached === false){
        if (x[z][0] === "%catend")
        {
            catendreached = true;
        }
        else
        {
            _glbl.cat_db[x[z][0]] = _glbl.catg.createNewCat(x[z][0],x[z][1]);
            catcounter++;
            
        }
        z++;
    }
        
    glel.cn_consolemain.innerHTML += catcounter + " entries was added to category type database.<br>";    
        
    var catvalcounter = 0;                                         // Variable for counting the number of user categories added.
    var catvalendreached = false;                               // Variable to signal when "%catvalend" is read.
    
    //Ignore the %catvalstart 
    z++;
    
    // While not reached the end of category data, add any user categories.
    while(catvalendreached === false)
    {
        // Remove when debugging not required.
        console.log(x[z]);
        
        // Data validation to ignore empty rows ( they occur in downloaded netbank text files )
        if (x[z].length === 0)
        {
            glel.cn_consolemain.innerHTML += "<span style=\"color:red\">A row with " + x[z].length + " entries were found. Expected at least 1. Data was : </span><br>";
            for (var j in x[z])
            {
                glel.cn_consolemain.innerHTML += "<span style=\"color:slategrey\">" + x[z][j] + "</span><br>";
            }
            glel.cn_consolemain.innerHTML += "<span style=\"color:red\">The row was ignored.</span><br>";
            z++;
        }
        // Reached the end of the user category data.
        else if (x[z][0] === "%catvalend")
        {
            z++;
            catvalendreached = true;
        }
        else
        // Add to the user category to the database.
        {
            _glbl.cat[x[z][0]] = _glbl.cat_db[x[z][1]];
            catvalcounter++;
            z++;
        }
        // Remove when debugging not required.
        console.log(z + " " + catvalcounter);
    }
    
    glel.cn_consolemain.innerHTML += catvalcounter + " entries was added to category file.<br>";
    
    var added_cnt = 0;
    for( var i = z ; i < x.length ; i ++)
    {
        var dataok =1;
        if( x[i].length <= 1)
        {
            glel.cn_consolemain.innerHTML += "Empty row ignored<br>";
            dataok = 0;
        }

        if(dataok)
        {
            // insert
            // No need to check against duplicate entries
            
            var w = _glbl.retref("dbs",x[i]);
            var z = _glbl.retindex("dbs");
            
            
            if (_glbl.db.d_map.hasOwnProperty(w.acc) === false)
            {
                _glbl.db.d_map[w.acc] = {};
                glel.cn_consolemain.innerHTML += "Created account : "+ w.acc + " in database.<br>";
            }

            if (_glbl.db.d_map[w.acc].hasOwnProperty(w.year) === false)
            {
                // Add the year
                _glbl.db.d_map[w.acc][w.year] = {};            
            }

            if (_glbl.db.d_map[w.acc][w.year].hasOwnProperty(w.month) === false)
            {
                // add the month
                _glbl.db.d_map[w.acc][w.year][w.month] = {currindex:"0",data:[]};            
            }
            
            
            _glbl.db.d_map[w.acc][w.year][w.month].data.push([]);
            var curr_len = _glbl.db.d_map[w.acc][w.year][w.month].data.length;
            var curr_id = _glbl.db.d_map[w.acc][w.year][w.month].currindex; 
            var tmp_rf = _glbl.db.d_map[w.acc][w.year][w.month].data[curr_len-1];
            for(var xx in _glbl.dbs)
            {
                tmp_rf.push([]);
            }

            // Add data to the the associative database.
            tmp_rf[z.acc] = w.acc;
            tmp_rf[z.day] = w.day;                  // Day
            tmp_rf[z.month] = w.month;              // Month
            tmp_rf[z.year] = w.year;                // Year
            tmp_rf[z.desc] = w.desc;                // Descript
            tmp_rf[z.val] = new BigDecimal(w.val);  // Value -  We reference it  but all other existing should be deleted after the function returns 
            tmp_rf[z.bal] = new BigDecimal(w.bal);  // Balance - We reference it  but all other existing should be deleted after the function returns
            tmp_rf[z.uid] = w.uid;
            tmp_rf[z.cid] = w.cid;
            tmp_rf[z.cat] = w.cat;
            _glbl.db.d_map[w.acc][w.year][w.month].currindex = (parseInt(_glbl.db.d_map[w.acc][w.year][w.month].currindex)+1).toString();
            
            // All data simply stores a reference to the data is db_map
            _glbl.db.all_data.push(tmp_rf);
                   
            added_cnt++;
            
        }
    }
    glel.cn_consolemain.innerHTML += added_cnt + " entries added successfully.<br>";

    
};


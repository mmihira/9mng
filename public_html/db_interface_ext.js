// function for handling a txt file with existing database
_glbl.dbint.addExtToDatabase = function (data)
{
    glel.cn_consolemain.innerHTML += "Parsing complete.";
    glel.cn_consolemain.innerHTML += "Rows of data to process : " + data.data.length + "<br>";
    
    var x = data.data;
    
    // The first part of the data will be category and configuration data
    // format is like this key,value;.......;key=%catend;value=0; .. database rows begin.
    var z = 0;
    glel.cn_consolemain.innerHTML += "Adding category data.<br>";
    var catcounter = 0;
    var catendreached = false;
    while(catendreached === false)
    {
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
        else if (x[z][0] === "%catend")
        {
            // Reached the end of the categoryend
            z++;
            catendreached = true;
             
        }
        else
        {
            // add to the category
            _glbl.cat[x[z][0]] = x[z][1];
            catcounter++;
            z++;
        }
        console.log(z + " " + catcounter);
    }
    glel.cn_consolemain.innerHTML += catcounter + " entries was added to category file.<br>";
    
    var added_cnt = 0;
    for( var i = z ; i < x.length ; i ++)
    {
        var dataok =1;
        if( x[i].length <= 1)
        {
            glel.cn_consolemain.innerHTML += "Empty row ignored<br>";
            dataok = 0;
        }
        else if ( x[i].length > _glbl.dba.length || x[i].length < _glbl.dba.length  )
        {
            glel.cn_consolemain.innerHTML += "Row ignored because length was " + x[i]/length;
            glel.cn_consolemain.innerHTML += " and was expecting "+ _glbl.dba.length +".<br>";
            dataok =0;
            
        }

        if(dataok)
        {
            // insert
            // No need to check against duplicate entries
            
            var w = _glbl.retref("dba",x[i]);
            var z = _glbl.retindex("dbs");
            var y = _glbl.retindex("dba");
            
            
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
            for(var xx in _glbl.dba)
            {
                tmp_rf.push([]);
            }

            // Add data to the the associative database.
            tmp_rf[z.day] = w.day; // Day
            tmp_rf[z.month] = w.month; // Month
            tmp_rf[z.year] = w.year; // Year
            tmp_rf[z.desc] = w.desc; // Descript
            tmp_rf[z.val] = new BigDecimal(w.val); // Value -  We reference it  but all other existing should be deleted after the function returns 
            tmp_rf[z.bal] = new BigDecimal(w.bal); // Balance - We reference it  but all other existing should be deleted after the function returns
            tmp_rf[z.uid] = w.uid;
            _glbl.db.d_map[w.acc][w.year][w.month].currindex = (parseInt(_glbl.db.d_map[w.acc][w.year][w.month].currindex)+1).toString();
            
            
            
            // Also add to all data;
            _glbl.db.all_data.push([]);
            var all_data_len = _glbl.db.all_data.length;
            for(var xx in _glbl.dba)
            {
                _glbl.db.all_data[all_data_len-1].push([]);
            }
            
            _glbl.db.all_data[all_data_len-1][y.acc] = w.acc;
            _glbl.db.all_data[all_data_len-1][y.uid] = w.uid;
            _glbl.db.all_data[all_data_len-1][y.day] = w.day;
            _glbl.db.all_data[all_data_len-1][y.month] = w.month;
            _glbl.db.all_data[all_data_len-1][y.year] = w.year;
            _glbl.db.all_data[all_data_len-1][y.desc] = w.desc;
            _glbl.db.all_data[all_data_len-1][y.val] = tmp_rf[z.val]; // reference the same object
            _glbl.db.all_data[all_data_len-1][y.bal] = tmp_rf[z.bal]; // reference the same object
            _glbl.db.all_data[all_data_len-1][y.cid] = w.cid;
            
            added_cnt++;
            
        }
    }
    glel.cn_consolemain.innerHTML += added_cnt + " entries added successfully.<br>";

    
};


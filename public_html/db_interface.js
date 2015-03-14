/* A collection of functions which work interfaces with the database object */

/**
* Given an entry in all_data return the matching entry in 
* 
* @param {[vector] v, int ndx} the string to categorise is accessed like this v[ndx]
* @return {string} the category if found or "NA" if not found. 
* 
*/

_glbl.dbint.addNewToDatabase = function (results)
    {
        var acc = glel.cn_acc_selection_drop_down.value;

        glel.cn_consolemain.innerHTML += "Parsing complete. Processing data and saving as " + acc + ".<br>";
        glel.cn_consolemain.innerHTML += "Rows of data to process : " + results.data.length + "<br>";

        
        // if the account is a master than the balance column is missing
        if(acc === "MASTER")
        {
            var db_tmp = _glbl.dbint.compPapaData(results, acc, true);
        }
        else
        {
            var db_tmp = _glbl.dbint.compPapaData(results, acc, false);
        }

        // If processing the data failed
        if (!db_tmp[0])
        {
            glel.cn_consolemain.innerHTML += "<span style=\"color:red\">Processing data failed</span>";
        }
        else
        {
            // add to the actual data base if it did not fail
            glel.cn_consolemain.innerHTML += "Processing complete. Now attempting to add to database.<br>";
            if(acc === "MASTER")
            {
               _glbl.dbint.addMasterToAllData(db_tmp[1]);
                
            }
            else
            {
                _glbl.dbint.addToAllData(db_tmp[1]);
            }
            
            glel.cn_consolemain.innerHTML += "Database addition complete.<br>";
            // Since we are succesfull show the goto dashboard button
            if( $(glel.cn_upload_file_main).has(glel.cn_dashboard_div).length === 0 )
            {
                // add the dasboard buttion
                var ins_af = $(glel.cn_upload_file_btn_div).after(glel.cn_dashboard_div);
            }
            
            
        }
        
        
    };
    /**
     * Returns a date array
     * 
     * @param _s is a string which is in the formate YYYYMMDD or YYYYMMD or YYYYMDD or YYYYMD
     * @return a vector, where the first value is 0 if the function failed or
     * 1 if the function succeeded. The second value is a vector with 
     * with 3 elements : Day, Month, Year in string format.
     * the month and day will contain a 0 in front if it is a single digit date. 
     */
    _glbl.dbint.ret_date = function (_s)
    {
        var bs_pos = [""];
        var bs_idx = 0;
        for (var p = 0 ; p < _s.length; p++)
        {
            if (_s[p] === '/')
            {
                bs_pos.push([""]);
                bs_idx++;
            }
            else
            {
                bs_pos[bs_idx] += _s[p];
            }
        }

        if (bs_pos.length === 3)
        {
            if (bs_pos[0].length === 1)
            {
                bs_pos[0] = "0" + bs_pos[0];
            }

            if (bs_pos[1].length === 1)
            {
                bs_pos[1] = "0" + bs_pos[1];
            }
            
            return [1, bs_pos];
        }
        else
        {
            return [0, bs_pos];
        }

    };

    /**
     * Called after a raw file (from a bank) is parsed using PapaParse
     * 
     * @param {papaparse data} data is the results object which PapaParse will create form an object
     * @returns {[bool,[[],[],...]} the bool indicates wether the function completed successfully.
     * 
     */
    _glbl.dbint.compPapaData = function (data, acc,mcheck)
    {
        var x = data.data;
        // Create a temporary data base
        var db_tmp = [];
 
                
        for (var i = 0; i < x.length; i++)
        {
            // Data validation
            if (x[i].length !== 4)
            {
                glel.cn_consolemain.innerHTML += "<span style=\"color:red\">A row with " + x[i].length + " entries were found. Expected 4. Data was : </span><br>";
                for (var j in x[i])
                {
                    glel.cn_consolemain.innerHTML += "<span style=\"color:slategrey\">" + x[i][j] + "</span><br>";
                }
                glel.cn_consolemain.innerHTML += "<span style=\"color:red\">The row was ignored.</span><br>";
            }
            else
            {
                // No data issues so process.
                db_tmp.push([]);
                var _l = db_tmp.length;
                for(var xx in _glbl.tdb)
                {
                    db_tmp[_l-1].push([]);
                }

                // Format the date
                var temp_date = _glbl.dbint.ret_date(x[i][0]);
                // Add formatted date to database
                db_tmp[_l - 1][_glbl.tdb.day] = temp_date[1][0]; // Day
                db_tmp[_l - 1][_glbl.tdb.month] = temp_date[1][1]; // Month 
                db_tmp[_l - 1][_glbl.tdb.year] = temp_date[1][2]; // Year

                // Cleanup the description text
                while (x[i][2].search("\s") !== -1 && x[i][2].search("\t") !== -1)
                {
                    x[i][2].replace("\s\s", " ");
                    x[i][2].replace("\s", " ");
                }
                // add the text to database
                db_tmp[_l - 1][_glbl.tdb.desc] = x[i][2];

                // Add the balances and values. Converting all strings to floats. 
                db_tmp[_l - 1][_glbl.tdb.val] = new BigDecimal(x[i][1]);
                if(mcheck)
                {
                    db_tmp[_l - 1][_glbl.tdb.bal] = new BigDecimal("0");
                }
                else
                {                
                    db_tmp[_l - 1][_glbl.tdb.bal] = new BigDecimal(x[i][3]);
                }

                // Construct the preliminary ID
                var mo = db_tmp[_l - 1][2];
                var day = db_tmp[_l - 1][1];
                db_tmp[_l - 1][_glbl.tdb.preid] = db_tmp[_l - 1][3] + mo + day;

                // This entry is for comparing purposes.
                if(mcheck)
                {
                    db_tmp[_l - 1][_glbl.tdb.cid] = x[i][0] + x[i][1] + x[i][2];
                }
                else
                {                
                    db_tmp[_l - 1][_glbl.tdb.cid] = x[i][0] + x[i][1] + x[i][2] + x[i][3];
                }
                

                // Add the account
                db_tmp[_l - 1][_glbl.tdb.acc] = acc;

            }
        }
        
        // Check for internal data repeats
        var repeats = {};
        for (var i in db_tmp)
        {
            if (repeats.hasOwnProperty(db_tmp[i][7]) === false)
            {
                for (var j in db_tmp)
                {
                    if (i !== j)
                    {
                        if (db_tmp[i][7] === db_tmp[j][7])
                        {
                            if (repeats.hasOwnProperty(db_tmp[i][7]) === false)
                            {
                                repeats[db_tmp[i][7]] = 1;
                            }
                            else
                            {
                                repeats[db_tmp[i][7]] += 1;
                            }

                        }
                    }
                }
            }
        }

        var repeat_no = 0;
        for (var i in repeats)
        {
            repeat_no += repeats[i];
        }

        // Log any repeats.
        if (repeat_no)
        {
            glel.cn_consolemain.innerHTML += "<span style=\"color:red\">Found " + repeat_no + " repeats.</span><br>";
            glel.cn_consolemain.innerHTML += "<span style=\"color:red\">They were :</span><br>";
            for (var i in repeats)
            {
                glel.cn_consolemain.innerHTML += "<span style=\"color:slategrey\">" + i + " : " + repeats[i] + "</span><br>";
            }
        }
        
        
        
        // ONLY CHECK ORDER FOR NON MASTER ACCOUNTS 
        if(mcheck)
        {
           // The account is a master
           // The check will be done by the addEntrytodatabase function
            if (repeat_no)
            {
                glel.cn_consolemain.innerHTML += "<span style=\"color:slategrey\">There were " + repeat_no  + " repeats.:</span><br>";
            }

            // The data is in correct format and can be added to the database.
            return [1, db_tmp];
        }
        else
        {
            // Check the order of the input
            var order_count = 0;
            for (var j = db_tmp.length - 1; j > 0; j--)
            {
                if (db_tmp[j - 1][6].compareTo(db_tmp[j][6].subtract(db_tmp[j][5])))
                {
                    order_count += 1;
                }
            }

            // There is no order or the list is in reverse
            if (order_count !== 0)
            {
                // Try reversing the list
                order_count = 0;
                db_tmp.reverse();
                for (var j = db_tmp.length - 1; j > 0; j--)
                {
                    if (db_tmp[j - 1][6].compareTo(db_tmp[j][6].subtract(db_tmp[j][5])))
                    {
                        order_count += 1;
                    }
                }
            }
            // if order_count is still !== 0 then the list is not in order.
            // Find where data is not in order to inform user
            var not_in_order = [];
            if ( order_count )
            {
                for (var j = db_tmp.length - 1; j > 0; j--)
                {
                    if (db_tmp[j - 1][6].compareTo(db_tmp[j][6].subtract(db_tmp[j][5])))
                    {
                        not_in_order.push([]);
                        for ( var z in db_tmp[j])
                        {
                            not_in_order[not_in_order.length -1].push(db_tmp[j][z]);
                        }
                    }
                }            
            }

            // Log wether the order is correct
            if (order_count)
            {
                glel.cn_consolemain.innerHTML += "<span style=\"color:red\">The input data was not in order :</span><br>";
                var tmp_str = "<div style=\"overflow:scroll;height:100px\">";
                for (var i in not_in_order)
                {
                    tmp_str += "<span style=\"color:slategrey\">" + not_in_order[i][0] + " " + not_in_order[i][4] + "</span><br>";
                }
                tmp_str += "</div>";
                glel.cn_consolemain.innerHTML +=tmp_str;

                // Attempt to order the data            
                if(true)
                {
                    glel.cn_consolemain.innerHTML +="Attempting to find order<br>";
                    var attempt_order = 1;
                    var order_db = [];
                    var db_tmp_indexes = {};
                    var found_rep = 0;
                    for( var y = 1; y < db_tmp.length; y ++)
                    {
                        db_tmp_indexes[y] = 1;   
                    }
                    // place the first data point in.
                    order_db.push(db_tmp[0]);
                    for( var y = 1; y < db_tmp.length; y ++)
                    {
                        // if in order to previous then asdd to the new data base
                        if ( attempt_order)
                        {
                            if ( db_tmp_indexes[y] && order_db[y - 1][6].compareTo(db_tmp[y][6].subtract(db_tmp[y][5])) === 0)
                            {
                                order_db.push(db_tmp[y]);
                                db_tmp_indexes[y] = 0;
                            }
                            else
                            {
                                found_rep = 0;
                                for(var m in db_tmp_indexes )
                                {
                                    if( db_tmp_indexes[m] && found_rep === 0)
                                    {
                                        if( order_db[y - 1][6].compareTo(db_tmp[m][6].subtract(db_tmp[m][5])) === 0  )
                                        {
                                            // the entry must be after 1 day, month, and year
                                            var ref_date = new Date(order_db[y - 1][3]+"-"+order_db[y - 1][2]+"-"+order_db[y - 1][1]);
                                            var to_compare_date = new Date(db_tmp[m][3]+"-"+db_tmp[m][2]+"-"+db_tmp[m][1]);

                                            var date_same = (to_compare_date.valueOf() === ref_date.valueOf());
                                            var date_plus_one = (to_compare_date > ref_date );
                                            if (date_same || date_plus_one)
                                            {

                                                found_rep = 1;
                                                order_db.push(db_tmp[m]);
                                                db_tmp_indexes[m] = 0;

                                            }
                                        }
                                    }
                                }
                                if(found_rep === 0)
                                {
                                    attempt_order = 0;
                                }
                            }
                        }
                    }

                    var new_attempt_order = 0;
                    if(attempt_order)
                    {
                        //check that they are in order.
                        for (var j = order_db.length - 1; j > 0; j--)
                        {
                            if (order_db[j - 1][6].compareTo(order_db[j][6].subtract(order_db[j][5])))
                            {
                                new_attempt_order++;
                            }
                        } 
                    }
                    
                    if(new_attempt_order === 0)
                    {
                        glel.cn_consolemain.innerHTML +="New order found ! <br>";
                        glel.cn_consolemain.innerHTML +="Original length was : " +db_tmp.length + ". New length is : " + order_db.length + "<br>";
                        if( db_tmp.length !== order_db.length)
                        {
                            glel.cn_consolemain.innerHTML += "The following are not in new order :<br>";
                            var newordertxt = "<div style=\"overflow:scroll;height:100px\">";
                            
                            for (var g in db_tmp_indexes )
                            {
                                if( db_tmp_indexes[g] )
                                {
                                    newordertxt += db_tmp[g][_glbl.tdb.preid] + " " + db_tmp[g][_glbl.tdb.desc] + "<br>";  
                                }
                            }
                            
                            newordertxt += "</div><br>";
                            glel.cn_consolemain.innerHTML += newordertxt;
                        }
                        db_tmp = order_db;
                        order_count = 0;
                    }
                    else
                    {
                        glel.cn_consolemain.innerHTML +="Find order failed.<br>";                    
                    }
                }       
            }
            else 
            {
                glel.cn_consolemain.innerHTML += "The input data was in order<br>";
            }
            
            // If the order is incorrect or if more than 1/4 of the entries are repeats then exit.       
            if (order_count || repeat_no >= (db_tmp.length / 4))
            {
                glel.cn_consolemain.innerHTML += "<span style=\"color:red\">Data not processed because :</span>";
                if (order_count)
                {
                    glel.cn_consolemain.innerHTML += "<span style=\"color:slategrey\">The input data was not in order.</span>";
                }
                if (repeat_no >= db_tmp.length / 4)
                {
                    glel.cn_consolemain.innerHTML += "<span style=\"color:slategrey\">There were greater than length/4(" + db_tmp.length / 4 + ") repeats.:</span>";
                }
                glel.cn_consolemain.innerHTML += "</span><br>";
                return [0, {}];

            }
            else    
            {
                // The data is in correct format and can be added to the database.
                return [1, db_tmp];
            }  
        }

        
    };
    
    /**
     * Adds an entry to both databases.
     * This function will create acc/month/year if none exists
     * @param 
     * @returns {Boolean}
     */
    _glbl.dbint.addEntryToDb = function (acc,year,month,x)
    {
        // No need to check against duplicate entries
        
        if (_glbl.db.d_map.hasOwnProperty(acc) === false)
        {
            _glbl.db.d_map[acc] = {};
            glel.cn_consolemain.innerHTML += "Created account : "+ acc + " in database.<br>";
        }
        
        if (_glbl.db.d_map[acc].hasOwnProperty(year) === false)
        {
            // Add the year
            _glbl.db.d_map[acc][year] = {};            
        }
        
        if (_glbl.db.d_map[acc][year].hasOwnProperty(month) === false)
        {
            // add the month
            _glbl.db.d_map[acc][year][month] = {currindex:"0",data:[]};            
        }
        
        _glbl.db.d_map[acc][year][month].data.push([]);
        var curr_len = _glbl.db.d_map[acc][year][month].data.length;
        var curr_id = _glbl.db.d_map[acc][year][month].currindex; 
        var tmp_rf = _glbl.db.d_map[acc][year][month].data[curr_len-1];
        for(var xx in _glbl.dbs)
        {
            tmp_rf.push([]);
        } 
        
        tmp_rf[_glbl.dbs.acc] = acc;
        tmp_rf[_glbl.dbs.day] = x[_glbl.tdb.day]; // Day
        tmp_rf[_glbl.dbs.month] = month; // Month
        tmp_rf[_glbl.dbs.year] = year; // Year
        tmp_rf[_glbl.dbs.desc] = x[_glbl.tdb.desc]; // Descript
        tmp_rf[_glbl.dbs.val] = x[_glbl.tdb.val]; // Value -  We reference it  but all other existing should be deleted after the function returns 
        tmp_rf[_glbl.dbs.bal] = x[_glbl.tdb.bal]; // Balance - We reference it  but all other existing should be deleted after the function returns
        tmp_rf[_glbl.dbs.cid] = x[_glbl.tdb.cid];
        tmp_rf[_glbl.dbs.cat] = _glbl.catg.categorise(x,_glbl.tdb.desc);
        
        // Create the unique Id
        var tmp_id = "";
        for ( var k = 0 ; k < _glbl.dbs.uidmaxlen - curr_id.length; k++)
        {
            tmp_id += "0";
        }
        tmp_id += curr_id;
        tmp_rf[_glbl.dbs.uid] = x[_glbl.tdb.preid] + tmp_id; // Day
        _glbl.db.d_map[acc][year][month].currindex = (parseInt(_glbl.db.d_map[acc][year][month].currindex)+1).toString();
        
        // Also add to all data;
        _glbl.db.all_data.push(tmp_rf);
        
    };
    
    _glbl.dbint.addMasterToAllData = function(pX)
    {
        var addedcounter = 0;
        for (var j = 0; j < pX.length; j++ )
        {

            var i = pX[j];

            // If there is no account index in d_map
            if (_glbl.db.d_map.hasOwnProperty(i[_glbl.tdb.acc]) === false)
            {
                _glbl.dbint.addEntryToDb(i[_glbl.tdb.acc],i[_glbl.tdb.year],i[_glbl.tdb.month], i);
                addedcounter ++;
            }
            else if(_glbl.db.d_map[i[_glbl.tdb.acc]].hasOwnProperty(i[_glbl.tdb.year]) === false)
            {
                // add to the database
                _glbl.dbint.addEntryToDb(i[_glbl.tdb.acc],i[_glbl.tdb.year],i[_glbl.tdb.month], i);
                addedcounter ++;
            }
            else if(_glbl.db.d_map[i[_glbl.tdb.acc]][i[_glbl.tdb.year]].hasOwnProperty(i[_glbl.tdb.month]) === false) 
            {
                // add to the database
                _glbl.dbint.addEntryToDb(i[_glbl.tdb.acc],i[_glbl.tdb.year],i[_glbl.tdb.month], i);
                addedcounter ++;
            }    
            else
            {
                // Try and find a repeat.
                var repeat_found = 0;
                for( var z = 0 ; z < _glbl.db.all_data.length;z++)
                {
                   if( _glbl.db.all_data[z][_glbl.dbs.acc] === i[_glbl.tdb.acc] && _glbl.db.all_data[z][_glbl.dbs.cid] === i[_glbl.tdb.cid]  )
                   {
                        // repeat found if we find another repeat in the next entry
                        // then don't insert value
                        // inform the user than two conseuctive repeats were found.
                        glel.cn_consolemain.innerHTML += "Repeats were found when trying to add MASTER data.<br>";
                        glel.cn_consolemain.innerHTML += _glbl.db.all_data[z][_glbl.dbs.cid]+"<br>";
                        glel.cn_consolemain.innerHTML += i[_glbl.tdb.cid]+"<br>";
                        glel.cn_consolemain.innerHTML += "The data was not inserted.<br>";
                        repeat_found = 1;
                   }
                }

                if(repeat_found)
                {
                    // don't insert 
                }
                else
                {
                    // insert
                    _glbl.dbint.addEntryToDb(i[_glbl.tdb.acc],i[_glbl.tdb.year],i[_glbl.tdb.month], i);
                    addedcounter ++;
                }
            }     
            
        }
        glel.cn_consolemain.innerHTML +="Added " + addedcounter + " entries to database.<br>";
    };
    
    /**
     * 
     * @param {tdb type database} pX
     * @returns {Boolean}
     */
    _glbl.dbint.addToAllData = function (pX)
    {
       var addedcounter = 0;
       for (var j = 0; j < pX.length; j++ )
       {
            
            var i = pX[j];
           
            // If there is no account index in d_map
            if (_glbl.db.d_map.hasOwnProperty(i[_glbl.tdb.acc]) === false)
            {
                // now add the data
                _glbl.dbint.addEntryToDb(i[_glbl.tdb.acc],i[_glbl.tdb.year],i[_glbl.tdb.month], i);
                addedcounter ++;
            }
            else
            {
                // Get the last data input in the account
                var l_y = "0000";
                var map_ref = _glbl.db.d_map[i[_glbl.tdb.acc]];
                for (var m in map_ref)
                {
                    if( parseInt(l_y) < parseInt(m))
                    {
                        l_y = m; 
                    }
                }
                var l_m = "00";
                for (var mj in map_ref[l_y])
                {
                    if( parseInt(l_m) < parseInt(mj))
                    {
                        l_m = mj; 
                    }
                }
                var l_x = map_ref[l_y][l_m].data[map_ref[l_y][l_m].data.length -1];
                // Add to the database if the order is kept
                // Otherwise throw an error and stop adding data. 
                var order_test = i[_glbl.tdb.bal].compareTo(l_x[_glbl.tdb.bal].add(i[_glbl.tdb.val]));
                // If it compare equal add the entry
                if( order_test === 0)
                {
                    // Now add the data.
                    _glbl.dbint.addEntryToDb(i[_glbl.tdb.acc],i[_glbl.tdb.year],i[_glbl.tdb.month], i);
                    addedcounter ++;
                }
                else
                {
                    // Log what was not added.
                    glel.cn_consolemain.innerHTML += "<span style=\"color:red\">" + "Out of order in database. Not added : " + i[_glbl.tdb.preid] + " " + i[_glbl.tdb.desc] + "</span><br>";
                    
                }
            }
       }
       glel.cn_consolemain.innerHTML +="Added " + addedcounter + " entries to database.<br>";
    };



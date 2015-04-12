

/**
 * 
 * @param {type} param is a struct with structure
 * {
 *  acc: the type of account
 *  val_bal: sum the "val" or the "bal"
 *  deb_cred: sum for debits("deb") or credits("cred")
 *  notinc: an array of string with words not to be included in descrip. If emptry ignored.
 *  notinccat: an array of category strings which cannot match the category of the data.
 *  inc: an array of string with words that must be in the descript. If empty ignored.
 *  incat : an array of category strings, any one of which must match the category.
 *  yrs: An array of yrs to lookup
 *  mo: An array of months to lookup.
 *  @return {array}
 *  format is [[str type yr-mnt,BigDecimal,float value],...,]
 *  Only the existing data is returned.
 *  
 */
_glbl.dbint.get_data = function(param)
{
    var yrs = param.yrs;
    var mn = param.mo;
    var acc = param.acc;
    var inc = param.inc;
    var inccat = param.inccat;
    var ninc = param.notinc;
    var ninccat = param.notinccat;
    var tdb = 0;
    var data = [];
    var bigz = new BigDecimal("0.0");
    
    if(mn.length> 0)
    {
        if(mn[0] === "all")
        {
            mn = ["01","02","03","04","05","06","07","08","09","10","11","12"];
        }
    }
    
    if(param.deb_cred === "deb")
    {
        // In the big decimal library a value -1 is returned in compareTo if val is less than object 
        var bigdcomp = -1;
    }
    else if(param.deb_cred === "cred")
    {
        var bigdcomp = 1;
    }
    
    // which index in array to look up.
    var ndx = _glbl.dbs[param.val_bal];
    
    if (_glbl.db.d_map.hasOwnProperty(acc))
    {
        tdb = _glbl.db.d_map[acc]; 
    }
    else
    {
        tdb = 0;
    }
    
    if(tdb)
    {
        for (var i in yrs)
        {
            if (tdb.hasOwnProperty(yrs[i]))
            {
                for( var m in mn)
                {
                    // include the month only if the month is present in the data.
                    if( tdb[yrs[i]].hasOwnProperty(mn[m]))
                    {
                        // data format is [[str type yr-mnt,BigDecimal],...,]
                        data.push([]);
                        data[data.length-1].push(yrs[i]+"-"+mn[m]); 
                        data[data.length-1].push(new BigDecimal("0.0"));
                        
                        for( var x in tdb[yrs[i]][mn[m]].data)
                        {
                            // look for must includes
                            var inc_cnt = 0;
                            for (var a in inc)
                            {
                                if(tdb[yrs[i]][mn[m]].data[x][_glbl.dbs.desc].indexOf(inc[a]) !== -1 )
                                {
                                    inc_cnt ++;
                                }
                            }
                            
                            // look not includes
                            var ninc_cnt = 0;
                            for (var a in ninc)
                            {
                                if(tdb[yrs[i]][mn[m]].data[x][_glbl.dbs.desc].indexOf(ninc[a]) !== -1 )
                                {
                                    ninc_cnt ++;
                                }
                            }
                            
                            // look for must include categories only one has to match
                            if(inccat.length > 0)
                            {
                                var inccat_cnt = 0;
                                for(var a in inccat)
                                {
                                    if(tdb[yrs[i]][mn[m]].data[x][_glbl.dbs.cat] === inccat[a])
                                    {
                                        inccat_cnt ++;
                                        break;
                                    }

                                }
                            }
                            else
                            {
                                var inccat_cnt = 1;
                            }
                            
                            // look for must not include cats
                            var ninccat_cnt = 0;
                            for (var a in ninccat)
                            {
                                if(tdb[yrs[i]][mn[m]].data[x][_glbl.dbs.cat] === ninccat[a])
                                {
                                    ninccat_cnt ++;
                                }
                                
                            }
                            
                            // Ensure the must inlucdes are present
                            if (inc_cnt === inc.length && inccat_cnt >0)
                            {
                                // None of the not includes are accepted
                                if(ninc_cnt === 0 && ninccat_cnt === 0)
                                {
                                    // check to see if debit or credit
                                    if(tdb[yrs[i]][mn[m]].data[x][ndx].compareTo(bigz) === bigdcomp )
                                    {
                                       data[data.length-1][1] = data[data.length-1][1].add(tdb[yrs[i]][mn[m]].data[x][ndx]); 
                                    }
                                }  
                                
                            }                          
                        }
                    }
                }
            }
        }
    }
    
    for( var d in data)
    {
        data[d].push(data[d][1].floatValue());
    }
    
    return data;
    
};

/**
 * Returns a vector whith net positions for the years,months, and accounts specified
 * @param  {String Vector} yrs   the years to calculate the net position
 * @param  {String Vector} mn    the months to calculate the new position for
 * @param  {String} acc          the account to calculate 
 * @return {Vector}              Return is an vector of vectors. with structure [ [String,float],... ] the
 *                               string has format like "yyyy-mm"
 *  format is [float,float,...] size is yrs * months of data available in that year
 *  
 */
_glbl.dbint.get_net_position = function(yrs,acc,mn){
     
    // get the balance of the last entry in every month which exists
    // for year which exists in acc that exists
   
    var ret = [];
    
    if (_glbl.db.d_map.hasOwnProperty(acc))
    {
        for( var ii in yrs)
        {
            if( _glbl.db.d_map[acc].hasOwnProperty(yrs[ii]))
            {
                // for every month that exists return the balance of the last entry in that month.
                for( var i in mn )
                {
                    if( _glbl.db.d_map[acc][yrs[ii]].hasOwnProperty(mn[i]))
                    {
                        var dbref = _glbl.db.d_map[acc][yrs[ii]][mn[i]];
                        ret.push([yrs[ii]+"-"+mn[i],dbref.data[ dbref.data.length-1][_glbl.dbs.bal].floatValue()]);
                    }
                    else
                    {
                        // If the month doesn't exist don't do anything
                    }
                }
            }
        }
    }
    
    return ret;
};
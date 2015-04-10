// Build the initial categorise database with defaults
// These were taken from my first iteration of the program.
_glbl.cat = {};

// A vector used to hold a list of the categories in _glbl.cat
_glbl.catlist = {};


/*
 * Called by the reccategorise button in the category config
 * page to recategorise the data. Also the category table is refreshed.
 * 
 */
_glbl.catg.config_categorise = function()
{
    var x = _glbl.db.all_data;            // Temporary reference to the all_data database. 
    // Loop through all the data in all_data and categorise as necesary.
    for( var i in x)
    {
        x[i][_glbl.dbs.cat] = _glbl.catg.categorise(x[i],_glbl.dbs.desc); 
    }
    
    // Refresh the category table.
    _glbl.catg.rfrsgCatTable();
    
};

/**
 * Called by the save category button to save the category setups in the pannel
 */
_glbl.catg.savecat = function()
{
    var r = window.confirm(" Are your sure you want to save the category data ?\nNote : Cat data will not be saved on your hard disk.\nClick update DB on the dasboard to do so after saving cat data.");
    if(r === true)
    {
        _glbl.cat = {};
        for( var i in glel.panelvec)
        {
            // create a vector of the cat terms
            var catrmsv = glel.panelvec[i].cat_terms.value.split("\n");
            for(var k in catrmsv)
            {
                // Ignore empty values;
                if(catrmsv[k].length > 0)
                {
                    _glbl.catg.addCat(catrmsv[k],glel.panelvec[i].title_div_table_cell.innerHTML);

                }
            }
        }
    }   
};

/**
* Called by cnPapaComplete and reCat to Categorise the data
* 
* @param {[vector] v, int ndx} the string to categorise is accessed like this v[ndx]
* @return {string} the category if found or "NA" if not found. 
* 
*/
_glbl.catg.categorise = function (vstring, ndx)
{
    var foundmatch = false;
    for ( var k in _glbl.cat)
    {
        if( vstring[ndx].toLowerCase().search(k) !== -1)
        {
            // found a match
            return _glbl.cat[k];
            foundmatch = true;
            break;
        }
    }
    
    if(!foundmatch)
    {
        return "NA";
    }    
    
};


/**
* A function created to convert the database from pre category version to category versions.
* Not used in final version of the program.
*/
_glbl.catg.convcat = function()
{
    var x = _glbl.db.all_data;            // Temporary reference to the all_data database. 
    // Loop through all the data in all_data and categorise as necesary.
    for( var i in x)
    {
        x[i][_glbl.dbs.cat] = _glbl.catg.categorise(x[i],_glbl.dbs.desc); 
    }
    
};

// Add a user category to the category database
_glbl.catg.addCat = function (catkey,catvalue)
{
    // first check if the key allready exists or not
    
    if( _glbl.cat.hasOwnProperty(catkey) === true )
    {
        // allready exists don't add.
    }
    else
    {
        // doesn't exit so add to the database
        _glbl.cat[catkey] = [catvalue];
        // add to the userdatabase for keeping track off
        _glbl.useraddcat[catkey] = [catvalue];
        
    }    
};


/*
 * Updates the catg.catlist with the current categories
 */
_glbl.catg.updateCatlist = function()
{
    _glbl.catlist = {};
    for( var i in _glbl.cat)
    {
        if(_glbl.catlist.hasOwnProperty(_glbl.cat[i]) === false)
        {
            _glbl.catlist[_glbl.cat[i]] = [i];
        }
        else
        {
            _glbl.catlist[_glbl.cat[i]].push(i);
        }
    }
};
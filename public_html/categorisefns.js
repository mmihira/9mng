
/*
 * Called by the reccategorise button in the category config
 * page to recategorise the data. Also the category table is refreshed.
 * 
 */

/*
 * This function is used to create a new category type in the category database
 * @param name      the name of the category
 * @param tag       the category tag
 * @returns         an object of type category_db
 */
_glbl.catg.createNewCat = function(name,tag){
    
    return {"name":name,"tag":tag};
};

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
* @param vstring    is a vector. The string to categorise is accessed like this v[ndx]
* @param ndx        the index of of v to acces
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
            return _glbl.cat[k]["name"];
            foundmatch = true;
            break;
        }
    }
    
    if(!foundmatch)
    {
        return "NA";
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
        // TODO : add functionality for the tad
        _glbl.cat[catkey] = _glbl.catg.createNewCat(catvalue,"");      
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
        if(_glbl.catlist.hasOwnProperty(_glbl.cat[i]["name"]) === false)
        {
            _glbl.catlist[_glbl.cat[i]["name"]] = [i];
        }
        else
        {
            _glbl.catlist[_glbl.cat[i]["name"]].push(i);
        }
    }
};
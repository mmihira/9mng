
/*
 * This function is used to create a new category type in the category database
 * designed to act similar to the constructor of a class.. consider making a class
 * for the category insted ?
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
        // Delete both the cat and cat_db database
        // addCat will fill both as necessary
        _glbl.cat = {};
        _glbl.cat_db = {};
        for( var i in glel.panelvec)
        {
            // create a vector of the cat terms
            var catrmsv = glel.panelvec[i].cat_terms.value.split("\n");
            for(var k in catrmsv)
            {
                // Ignore empty values;
                if(catrmsv[k].length > 0)
                {
                    _glbl.catg.addCat(catrmsv[k],glel.panelvec[i].title_div_table_cell.innerHTML,glel.panelvec[i].tag_input.value);

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


/**
 * Called when the user clicks the "save category" button on the cat_config page
 * @param   {string}catvalue    is the category identifier i.e what should go in the name field of a category object
 * @param   {string}catkey      is the key used in _glbl.cat, or the term used when seraching the data desc   
 * @param   {string}tag         is the tag field 
 * @returns {undefined}
 */
_glbl.catg.addCat = function (catkey,catvalue,tag)
{
    // first check if the category exist in the cat_db database
    // and add if it doesn't
    if( _glbl.cat_db.hasOwnProperty(catvalue) === false ){
        
         _glbl.cat_db[catvalue] = _glbl.catg.createNewCat(catvalue,tag); 
    }

    // if there is not key in cat
    // then add it into cat
    if( _glbl.cat.hasOwnProperty(catkey) === false )
    {
        // doesn't exit so add to the database
        _glbl.cat[catkey] = _glbl.cat_db[catvalue];   
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
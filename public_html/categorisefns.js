// Build the initial categorise database with defaults
// These were taken from my first iteration of the program.
_glbl.cat = {
            "woolworths":"Food","weipa heritage":"Food","montezuma's":"Food","bistro0001":"Food",
            "carpentaria golf":"Food","safeway":"Food","coles":"Food","hungry jacks":"Food","albatross hotel":"Food",
            "grilld":"Food","weipa bowls":"Food","mcdonalds":"Food","heritage resort 2":"Food","pie face":"Food",
            "cafe":"Food","wok on air":"Food","carpentaria golf club":"Food","curryville":"Food","intersection cafe":"Food",
            "weipa gourmet meats":"Food","novotel brisbane":"Food","7-eleven":"Food","noodles":"Food","healthy habits":"Food",
            "bavarian bier cafe":"Food","the marlin bar":"Food","subway":"Food","rocksalt bar":"Food","ribs and rumps":"Food",
            "kmart":"Clothing","casual guy":"Clothing","mossimo northland":"Clothing","target":"Clothing","pig n whistle":"Clothing",
            "birch carroll&coyle":"Clothing","t-bar":"Clothing","fila":"Clothing","guzman y gomez":"Clothing","jeanswest dfo":"Clothing",
            "roger david 36":"Clothing","myer":"Clothing",
            "pharmacy":"Health","dental":"Health","dr b p finn":"Health",
            "mr william sheldon":"Health","knox private hospita":"Health",
            "abwdl uni melb c":"CASHOUT","non cba atm":"CASHOUT","wdl atm":"CASHOUT",
            "servicentre":"Fuel",
            "interest":"Interest",
            "salary":"Salary","northern melb in 16417":"Salary",
            "transfer from xx8600 netbank":"FROMNETBANK",
            "transfer to xx8600 netbank":"TONETBANK",
            "telstra":"PHONE","transfer out netbank tlstra443558011786":"PHONE",
            "cba telstra recharge":"PHONE",
            "bwtaxi":"TAXI","silvertop vic":"TAXI",
            "transfer to xx1716 netbank":"MASTERCARD","transfer to xx4239 netbank":"TOGOALSAVER",
            "direct credit":"DIRECT CREDIT"    
            
};

// A vector used to hold a list of the categories in _glbl.cat
_glbl.catlist = {};

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
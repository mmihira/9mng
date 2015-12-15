/**
 * Functions included :
 * categorise
 * getCategoryReference
 * addNewCategory
 * addNewCategoryIdentifier
 */
angular.module('service.categoryInterface',['service.categoryClass','service.categoryDatabase']).service('catInt',
        ['categoryClass','catDB',function(catClass,catDB){

    var catInt = {};

    /**
     * correctly categorise a service databaseElement
     * @param   toCat   The element to categorise
     */
    catInt.categorise = function(toCat){
        var foundmatch = false;
        for ( var k in catDB.dBIdentifiers)
        {
            if( toCat.description.toLowerCase().search(k.toLowerCase()) !== -1)
            {
                // found a match
                toCat.category = catDB.dBIdentifiers[k];
                return true;
                break;
            }
        }
        
        if(!foundmatch)
        {
            toCat.category = null;
            return false;
        }

    };

    /*
     * Returns a referencec to an associated category by name.
     * @param   catName     The name of the category
     * @returns             A reference to the category object
     */
    catInt.getCategoryReference = function(catName){

            return catDB.dB[catName];

            };

    /**
     * Returns all the category names currently in the database
     * @return      An Array of string containing the names of the
     *              categories currently in the database.
     */
    catInt.getExistingCategoryNames = function(){

    }

    /**
     * Adds a new category object into the database
     * @param   catName     The name of the new category
     * @param   catTag      The associated tag
     * @param   catIdents   Any associates identifiers
     * @return              A reference to the newly created
     *                      category
     */
    catInt.addNewCategory = function(catName,catTag,catIdents=[]){

        if( ! catDB.dB.hasOwnProperty(catName)){
            
            // Create the new category object
            var catRef = new catClass.createNewCategory(
                                        catName,
                                        catTag,
                                        catIdents);
            // Add the new category object into the database
            catDB.dB[catName] = catRef;

            // Also add the indentifiers into the database
            for(var i of catIdents){
                catInt.addNewCategoryIdentifier(catname,i);
            }

        }else{
            return null;
        }


    }

    /**
     * Adds a new category identifier
     * @param   catName     The name of the category which
     *                      should be associated with the new
     *                      category identfier
     * @param   catIdent    The new identifier which is to be
     *                      added to the database
     */
    catInt.addNewCategoryIdentifier = function(catName,catIdent){

        if( ! catDB.dBIdentifiers.hasOwnProperty(catIdent) ){
            catDB.dBIdentifiers[catIdent] = catDB.dB[catName];

            catDB.dB[catName].identifiers.push(catIdent); 

        }else{
            console.log("Error: Tried to add an allready existing category Identifier : " + catIdent);
        }

    };

    return catInt;


}]);

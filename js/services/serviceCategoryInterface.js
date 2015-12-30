/**
 * This service includes all functions which interface directly with the 
 * categoryDatabase service. The categoryDatabase service should not be
 * injected into any other places except here. 
 *
 * Functions included :
 * categorise
 * getCategoryReference
 * getExistingCategoryNames
 * getCategoryIdentifiers
 * addNewCategory
 * addNewCategoryIdentifier
 * removeIdentifier
 */
angular.module('service.categoryInterface',['service.categoryClass','service.categoryDatabase']).service('catInt',
        ['categoryClass','catDB',function(catClass,catDB){

    var catInt = {};

    /**
     * correctly categorise a service databaseElement
     * @param   toCat   The element to categorise
     * @return          true if category found, false otherwise
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

    /**
     * Returns a *new* array containing category identifiers
     * as strings.
     * @param       catName     the name of the category to 
     *              retrieve the identifiers for.
     * @return      An array of string containing the identifiers
     *              for the category specified.
     */
    catInt.getCategoryIdentifiers = function(catName){

        return catDB.dB[catName].identifiers.map(function(e){return e;});

    };

    /*
     * Returns a referencec to an associated category by name.
     * @param   catName     The name of the category
     * @returns             A reference to the category object
     */
    catInt.getCategoryReference = function(catName){

            if( catDB.dB.hasOwnProperty(catName) ){

                return catDB.dB[catName];

            }else{

                return null;
            }
    };


    /**
     * Returns all the category names currently in the database
     * @return      An Array of string containing the names of the
     *              categories currently in the database.
     */
    catInt.getExistingCategoryNames = function(){

        return Object.keys(catDB.dB);

    }

    /**
     * Adds a new category object into the database
     * @param   catName     The name of the new category
     * @param   catTag      The associated tag
     * @param   catIdents   Any associates identifiers
     * @return              A reference to the newly created
     *                      category
     */
    catInt.addNewCategory = function(catName,catTag,catIdents){

        if (typeof catIdents == 'undefined') {
                catIdents = [];
        }

        // Make sure the category doesn't exist.
        if( ! catDB.dB.hasOwnProperty(catName)){

            // Make sure the tag is correct and known
            if( catDB.tags.indexOf(catTag) != -1 ){
            
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

                return catRef;

            }else{
                return null;
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

            if( ! catDB.dB.hasOwnProperty(catName)){

                console.log("Error: " + catName + " doesn't exist");

            }
            else{

                catDB.dBIdentifiers[catIdent] = catDB.dB[catName];
                catDB.dB[catName].identifiers.push(catIdent); 

            }

        }else{
            console.log("Error: Tried to add an allready existing category Identifier : " + catIdent);
        }

    };


    /**
     * Removes an identifier from the database
     * @param the identifier to remove
     */
    catInt.removeIdentifier = function(identifier){

        if( catDB.dBIdentifiers.hasOwnProperty(identifier) ){

            // Remove the identifier from the catDB.categorname.identifiers
            var catName = catDB.dBIdentifiers[identifier];
            var index = catName.identifiers.indexOf(identifier);
            catName.identifiers.splice(index,1);

            // Delete it from catDB.dBIdentifiers
            delete catDB.dBIdentifiers[identifier];
        }else{
            console.log(identifier + " not found in database");
        }

    };

    
    

    return catInt;


}]);

/**
 * The serviceDatabaseElement service is responsible
 * for creation of databasee Elements. It is the only
 * thing it does. All functions modifying the rows
 * are contained in serviceDataase.js
 *
 */
angular.module('service.databaseElement',[]).service('dBElement',function(){

    var dbEl = {};

    /**
     * createDatabaseElement is the constructor function to create
     * objects of type DataBaseElement.
     *
     * @param   i       i is a object which contains key value pairs 
     *                  that will be copied into the new database
     *                  element. i should have the following
     *                  structure
     *                  { date: A string type date in the format of
     *                    dd/mm/yy
     *                    value: A BigDecimal objection which is the
     *                    value of the transaction.
     *                    description: A string containing a
     *                    description of the transaction.
     *                    balance: A BigDecimal object representing
     *                    the balance following the transaction.
     *
     *                    -- The following values are only copied if
     *                    the fullInstatiation arugment is true.
     *
     *                   }
     
     * @param fullInstatiation
     *                  If true then this means that the class member
     *                  variables are fully known before hand and
     *                  simply need to be copied. Otherwise only the
     *                  first four as indicated above are copied. The
     *                  rest can be calculated using ...                   
     */
    /*                  Argument template :
                       Here is a template :
                         {
                            date: ,
                            value: ,
                            description: ,
                            balance: ,
                         }
     */
    dbEl.createDatabaseElement = function DataBaseElement(
                                                    i, 
                                                    fullInstatiation){
        if( fullInstatiation ){

            // The database rows have allready been created so just copy 
            // them accross
            

        }else{ 

            this.rawDate = i.date;
            this.rawValue = i.value;
            this.rawDescription = i.description;
            this.rawBalance = i.balance;

        }

    };

    return dbEl;

});


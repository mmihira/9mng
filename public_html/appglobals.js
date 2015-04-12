// All global variables
_glbl = {
            db : {      
                        /*
                         * All data has structure like {[dba structure],[],[]}
                         */
                        all_data: [], 
                        d_map : {}
            },
            
            /*
             * cat has structure {"category":reference Object,....}
             * where the reference is to a object held in cat_db
             */
            cat : {},
            // A object used to hold a list of the categories in _glbl.cat
            catlist : {},
            
            /* cat_db is the data base holding the categories as their associated data.
             * it is constructed from an existing database file>. It is modified when the 
             * user adds or removes a category type
             * cat_db has structure [{},{},{}....]
             * where the element of cat_sb is an object with structure
             * { name:String categoryname,
             *   tag:Wether this category denotes an income or expenditure
             * }
             */
            cat_db: {},
            
            accTypes : ["SAVER", "MASTER", "NETBANK", "GOAL"],
            dbint:{},
            catg:{},
            fns:{},
            flotplot:{},
            d3plot:{},
            
            // An object which holds and defines the cash flow statement
            cfstat:{},
            
            // structure database
            dbs: {
                        uidmaxlen:4,
                        acc:0,
                        uid:1,
                        day:2,
                        month:3,
                        year:4,
                        desc:5,
                        val:6,  // BigDecimal object
                        bal:7,  // BigDecimal object
                        cid:8,  // for comparing
                        cat:9   // Category
            },
            // The temporary data base used when first processing data from raw bank csv.
            tdb:{
                        preid:0,
                        day:1,
                        month:2,
                        year:3,
                        desc:4,
                        val:5,
                        bal:6,
                        cid:7, //for comparing 
                        acc:8
            },
            
            // Please comment on what this does....
            retindex : function(type)
            {
                var ret = {};
                for (var i in _glbl[type])
                {
                    ret[i] = _glbl[type][i]; 
                }
                return ret;
            },
            retref : function(type, x)
            {
                var ret = {};
                for (var i in _glbl[type])
                {
                    ret[i] = x[_glbl[type][i]]; 
                }
                return ret;
            }
            
            
        };

// All javascript created elements are stored here
glel = {};
        

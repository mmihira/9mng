// All global variables
_glbl = {
            db : {      
                        /*
                         * All data has structure like {[dba structure],[],[]}
                         */
                        all_data: [], 
                        d_map : {}
            },
            
            // the default categories
            cat : {},
            // categories added by user these are saved in the users database text
            useraddcat : {},
            
            accTypes : ["SAVER", "MASTER", "NETBANK", "GOAL"],
            dbint:{},
            catg:{},
            fns:{},
            flotplot:{},
            
            // structure database
            dbs: {
                        uidmaxlen:4,
                        uid:0,
                        day:1,
                        month:2,
                        year:3,
                        desc:4,
                        val:5,
                        bal:6,
                        cat:7
            },
            // all database
            dba: {
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
        

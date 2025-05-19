const pool = require("../database/")
//import the database connection file
//since index is default, it will find that.

/* ************
* Get all classification data
* ************** */
async function getClassifications(){
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

module.exports = {getClassifications}


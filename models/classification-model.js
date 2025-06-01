const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function createClassification(classification_name){
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}


/* **********************
 *   Check for existing classification name
 * ********************* */
async function checkExistingClassificationName(classification_name){
  try {
    const sql = "SELECT * FROM classification WHERE classification_name = $1"
    const email = await pool.query(sql, [classification_name])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}


module.exports = { createClassification,checkExistingClassificationName }
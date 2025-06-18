const pool = require("../database/")
//import the database connection file
//since index is default, it will find that.

/* ************
* Get all classification data
* ************** */
async function getClassifications(){
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ************
* Get all make data
* ************** */
async function getMake(){
    return await pool.query("select distinct inv_make from inventory order by inv_make")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* **********************
 *   Check for existing vehicle names
 * ********************* */
async function checkExistingInventory(inv_year, inv_make, inv_model){
  try {
    const sql = `SELECT * FROM inventory WHERE inv_year = $1
    AND inv_make = $2 AND inv_model = $3`
    const email = await pool.query(sql, [inv_year, inv_make, inv_model])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}


/* *****************************
*   Create Inventory
* *************************** */
async function addToInventory(
  inv_make,
  inv_model,
  inv_year,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_miles,
  inv_color,
  classification_id
){
  try {
    const sql = `INSERT INTO inventory (
    inv_make, 
    inv_model, 
    inv_year, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_miles, 
    inv_color, 
    classification_id) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`
    return await pool.query(sql, [
      inv_make, 
    inv_model, 
    inv_year, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_miles, 
    inv_color, 
    classification_id
    ])
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Get Inventory by Id
* *************************** */
async function getInventoryById(inv_id){
  try {
    const sql = `SELECT inv_id,
    inv_make,
    inv_model, 
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color, 
    classification_id
    FROM inventory a 
where inv_id = $1`;

    var result = await pool.query(sql,     
      [inv_id]
    )
    return result.rows[0]
  } catch (error) {
    return error.message
  }
}




/* *****************************
*   Delete Inventory by Id
* *************************** */
async function removeInventoryById(inv_id){
  try {
    const sql = `DELETE FROM inventory WHERE inv_id = $1`;

    return await pool.query(sql,     
      [inv_id]

    )
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}




/* ***************************
 *  Update Inventory Data
 * ************************** */
async function searchInventory(
  inv_make,//[1,2]
  min_price,
  max_price,
  min_year,
  max_year,
  search_text
  // inv_model,
  // inv_description,
  // inv_image,
  // inv_thumbnail,
  // inv_price,
  // inv_year,
  // inv_miles,
  // inv_color,
  // classification_id
) {
  try {

    let sql =
      "SELECT * FROM public.Inventory WHERE inv_price >= $1 and inv_price <= $2 and inv_year >= $3 and inv_year <= $4"
    let values = [min_price, max_price, min_year, max_year]
    let variableCnt = 4
    if (inv_make != null && inv_make.length > 0)
    {
       const makeValues = inv_make.map((_,i) => `$${i+variableCnt+1}`).join(', ')
       sql += ` AND inv_make IN (${makeValues})`
       values.push(...inv_make);
       variableCnt += inv_make.length
    }
    if (search_text !== "")
    {
      const searchText = search_text.toUpperCase()
      sql += ` AND (UPPER(inv_description) like '%${searchText}%' 
      OR UPPER(inv_make) like '%${searchText}%' 
      OR UPPER(inv_model) like '%${searchText}%'
      OR UPPER(inv_color) like '%${searchText}%')`
    }
    const data = await pool.query(sql, values)
    return data.rows
  } catch (error) {
    console.error("model error: " + error)
  }
}


module.exports = {getClassifications, 
  getMake,
  getInventoryByClassificationId,
  checkExistingInventory,
  addToInventory,
  removeInventoryById,
  getInventoryById,
  updateInventory,
  searchInventory
}

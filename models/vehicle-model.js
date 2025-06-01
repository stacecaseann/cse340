const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function createVehicle(vehicle_name){
  try {
    const sql = "INSERT INTO vehicle (vehicle_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [vehicle_name])
  } catch (error) {
    return error.message
  }
}


/* **********************
 *   Check for existing vehicle name
 * ********************* */
async function checkExistingVehicleName(vehicle_name){
  try {
    const sql = "SELECT * FROM vehicle WHERE vehicle_name = $1"
    const email = await pool.query(sql, [vehicle_name])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}


module.exports = { createVehicle,checkExistingVehicleName }
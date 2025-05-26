const pool = require("../database/")

/* ***************
* Get all inventory details 
* ************ */

async function getInventoryDetailByInvId(inv_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory
            WHERE inv_id = $1`,
            [inv_id]
        )
        return data.rows
    } catch (error) {
        console.error("getInventoryByInvId error " + error)
    }
}

module.exports = {getInventoryDetailByInvId}
const invDetailModel = require("../models/inv-detail-model")
const utilities = require("../utilities")

const invDetailCont = {}

/* *************
* Build inventory detail by inv detail view
* ************** */
invDetailCont.buildByInvId = async function (req, res, next) {
    const inv_id = req.params.invId
    const data = await invDetailModel.getInventoryDetailByInvId(inv_id)
    const grid = await utilities.buildInvDetailGrid(data)
    const invTitle = data[0].inv_make;//Add inv_model
    res.render("./inventory/classificationDetails", {
        title: invTitle,
        grid,
        errors: null,
    })
}

module.exports = invDetailCont
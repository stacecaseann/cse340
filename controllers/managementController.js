const utilities = require("../utilities/")

/* ****************************************
*  Deliver management view
* *************************************** */
async function buildManagement(req, res, next) {
  const classificationSelect = await utilities.buildClassificationList()
  res.render("inventory/management", {
    title: "Vehicle Management",
    errors: null,
    classificationSelect,
  })
}

module.exports = { buildManagement }
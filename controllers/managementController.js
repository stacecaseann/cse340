const utilities = require("../utilities/")

/* ****************************************
*  Deliver management view
* *************************************** */
async function buildManagement(req, res, next) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
    classificationSelect
  })
}

module.exports = { buildManagement }
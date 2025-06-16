const accountModel = require("../models/account-model")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildSearch(req, res, next) {
  res.render("search/search-inventory", {
    title: "Search",
    errors: null,
  })
}

module.exports = { buildSearch }
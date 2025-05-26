const express = require("express")
const router = new express.Router()
const invDetailController = require("../controllers/invDetailController")
const utilities = require("../utilities/")

// Route to build inventory detail view
router.get("/detail/:invId", utilities.handleErrors(invDetailController.buildByInvId));

module.exports = router;
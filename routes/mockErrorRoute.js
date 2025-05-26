const express = require("express")
const router = new express.Router()
const errorController = require("../controllers/mockErrorController")
const utilities = require("../utilities/")

//Route to mock an error
router.get("/error", utilities.handleErrors(errorController.createMockError));

module.exports = router;
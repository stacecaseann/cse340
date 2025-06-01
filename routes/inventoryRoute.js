const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/classification-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

//Route to manage the inventory and classification
router.get("")

//Route to get a new classification
router.get("/classification-entry", utilities.handleErrors(invController.buildClassificationCreationForm))
//Route to create a new classification
router.post(
  "/classification-entry",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(invController.createClassificationEntry))
module.exports = router;

//Route to get a new vehicle
router.get("/vehicle-entry", utilities.handleErrors(invController.buildVehicleCreationForm))
//Route to create a new vehicle
router.post(
  "/vehicle-entry",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(invController.createVehicleEntry))
module.exports = router;
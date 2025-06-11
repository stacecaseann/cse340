const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/classification-validation')
const vehicleValidate = require('../utilities/vehicle-validation')

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
    vehicleValidate.registrationRules(),
    vehicleValidate.checkUpdateData,
    utilities.handleErrors(invController.createInventoryEntry))

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

//TODO add login
//route to edit inventory
router.get("/edit/:inv_id", utilities.handleErrors(invController.buildEditInventory))
router.post("/update/", utilities.handleErrors(invController.updateInventory))

router.get("/delete-inventory/:inv_id", utilities.checkLogin, utilities.handleErrors(invController.deleteInventoryConfirmation))

router.post("/delete-inventory/", utilities.checkLogin, utilities.handleErrors(invController.deleteInventory))


module.exports = router;


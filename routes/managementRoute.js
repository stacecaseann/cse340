const express=require("express")
const router = express.Router()
const managementController = require("../controllers/managementController")
const utilities = require("../utilities/")

router.get("/", utilities.handleErrors(managementController.buildManagement))
module.exports = router;
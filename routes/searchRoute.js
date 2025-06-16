const express=require("express")
const router = express.Router()
const searchController = require("../controllers/searchController")
const utilities = require("../utilities/")


router.get("/", utilities.handleErrors(searchController.buildSearch))

module.exports = router;
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const classificationModel = require("../models/classification-model")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */

invCont.buildByClassificationId = async function (req, res, next) { //next is Express function
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()

    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
        errors: null,
    })
}
/* ***************************
 *  Build Classification View
 * ************************** */
invCont.createClassificationEntry = async function(req, res, next){
    let nav = await utilities.getNav()
    const { classification_name } = req.body

    const classificationResult = await classificationModel.createClassification(
    classification_name
  )

 if (classificationResult) {
    req.flash(
      "notice",
      `Classification ${classification_name} was created successfully.`
    )
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors:null
    })
  } else {
    req.flash("notice", "Sorry, the classification was not created.")
    res.status(501).render("inventory/classification-entry", {
      title: "Add New Classification",
      nav,
      classification_name,
      errors:null

    })
  }

}

invCont.buildClassificationCreationForm = async function (req, res, next){
    let nav = await utilities.getNav()

    res.render("inventory/classification-entry", {
        title: "Add new classification",
        nav, 
        errors: null,
    })
}

/* ***************************
 *  Build Vehicle View
 * ************************** */
invCont.createVehicleEntry = async function(req, res, next){
    let nav = await utilities.getNav()
    const { vehicle_name } = req.body

    const vehicleResult = await vehicleModel.createVehicle(
    vehicle_name
  )

 if (vehicleResult) {
    req.flash(
      "notice",
      `Vehicle ${vehicle_name} was created successfully.`
    )
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors:null
    })
  } else {
    req.flash("notice", "Sorry, the vehicle was not created.")
    res.status(501).render("inventory/vehicle-entry", {
      title: "Add new vehicle",
      nav,
      vehicle_name,
      errors:null

    })
  }

}

invCont.buildVehicleCreationForm = async function (req, res, next){
    let nav = await utilities.getNav()

    res.render("inventory/vehicle-entry", {
        title: "Add new vehicle",
        nav, 
        errors: null,
    })
}
module.exports = invCont;
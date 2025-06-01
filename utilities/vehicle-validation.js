const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const vehicleModel = require("../models/vehicle-model")

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
  validate.registrationRules = () => {
    return [
      // valid email is required and cannot already exist in the DB
      body("vehicle_name")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Vehicle name is required.")
      .isAlpha()
      .withMessage("Vehicle name is not valid.")
      .custom(async (vehicle_name) => {
        const nameExists = await vehicleModel.checkExistingVehicleName(vehicle_name)
        if (nameExists){
          throw new Error("Name exists already.")
        }
      }),
    ]
  }


  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
const { vehicle_name } = req.body
    //js destructuring method
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/vehicle-entry", {
      errors,
      title: "Add New Vehicle",
      nav,
      vehicle_name
    })
    return
  }
  next()
}

module.exports = validate
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const vehicleModel = require("../models/inventory-model")

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
  validate.registrationRules = () => {
    return [
      // valid email is required and cannot already exist in the DB
      body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Vehicle make is required.")
      .isAlpha()
      .withMessage("Vehicle make is not valid.")
.custom(async (value, { req }) => {
  const { inv_year, inv_make, inv_model } = req.body
  const nameExists = await vehicleModel.checkExistingInventory(inv_year, inv_make, inv_model)
        if (nameExists){
          throw new Error("Vehicle exists already.")
        }
      }),
      body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Vehicle Model is required.")
      .isAlpha()
      .withMessage("Vehicle Model is not valid."),
      body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Vehicle Year is required.")
      .isInt({ min: 1900, max: 2100 })
      .withMessage("Vehicle Year is not valid."),
      body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Vehicle Description is required.")
      .withMessage("Vehicle Description is not valid."),
      body("inv_image")
      .trim()
      //.escape()
      .notEmpty()
      .withMessage("Vehicle Image is required.")
      //.isAlpha()
      .withMessage("Vehicle Image is not valid."),
      body("inv_thumbnail")
      .trim()
      //.escape()
      .notEmpty()
      .withMessage("Vehicle Thumbnail is required.")
      // .isAlpha()
      .withMessage("Vehicle Thumbnail is not valid."),
      body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Vehicle Price is required.")
      .isFloat({ min: 0 })
      .withMessage("Vehicle Price is not valid."),
      body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Vehicle Miles field is required.")
      .isInt({min: 0})
      .withMessage("Vehicle Miles field is not valid."),
      body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Vehicle Color is required.")
      .isAlpha()
      .withMessage("Vehicle Color is not valid."),
      body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Vehicle Classification is required.")
      .isInt()
      .withMessage("Vehicle Classification is not valid."),
    ]
  }


  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
const {inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
      inv_id } = req.body
    //js destructuring method
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    const classificationList = await utilities.buildClassificationList(classification_id)
    res.render("inventory/vehicle-entry", {
      errors,
      title: "Edit Vehicle",
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
      classificationList,
    })
    return
  }
  next()
}

module.exports = validate
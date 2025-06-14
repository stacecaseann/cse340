const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const accountModel = require("../models/classification-model")

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
  validate.registrationRules = () => {
    return [
      // valid email is required and cannot already exist in the DB
      body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Classification name is required.")
      .isAlpha()
      .withMessage("Classification name is not valid.")
      .custom(async (classification_name) => {
        const nameExists = await accountModel.checkExistingClassificationName(classification_name)
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
const { classification_name } = req.body
    //js destructuring method
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.render("inventory/classification-entry", {
      errors,
      title: "Add New Classification",
      classification_name,
    })
    return
  }
  next()
}

module.exports = validate
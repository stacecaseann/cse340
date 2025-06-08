const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
  validate.registrationRules = () => {
    return [
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required."),
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty(),
    ]
  }


  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkAccountData = async (req, res, next) => {

    //js destructuring method
  const { account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    })
    return
  }
  next()
}

module.exports = validate
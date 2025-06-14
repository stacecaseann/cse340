
const { body, validationResult } = require("express-validator")
const validate = {}
const accountModel = require("../models/account-model")


/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
  validate.registrationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email, {req}) => {
        const account_id = req.body.account_id
        const emailExists = await accountModel.checkExistingEmailExceptCurrent(account_email, account_id)
        if (emailExists){
          throw new Error("Email exists. Please log in or use different email")
        }
      }),      
    ]
  }


  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {

    //js destructuring method
  const { account_id, account_firstname, account_lastname, account_email } = req.body

  let errors = []
  errors = validationResult(req)
  if (errors.isEmpty())
  {
        res.locals.account_firstname = account_firstname
    res.locals.account_lastname = account_lastname
    res.locals.email = account_email
  }
  else {
    res.render("account/update/" + {account_id}, {
      errors,
      title: "Update Account",
        errors: null,
    })
    return
  }
  next()
}

module.exports = validate
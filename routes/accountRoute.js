const express=require("express")
const router = express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')
const updateValidate = require('../utilities/account-update-validation')
const updatePassword = require('../utilities/account-password-validation')
const loginValidate = require('../utilities/loginRules')

router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get("/register", utilities.handleErrors(accountController.buildRegister))
router.post('/register',
    regValidate.registrationRules(),
    regValidate.checkRegData,//no () because we're passing the whole function
     utilities.handleErrors(accountController.registerAccount))
// Process the login attempt

router.post(
  "/login",
    loginValidate.registrationRules(),
    loginValidate.checkAccountData,
    utilities.handleErrors(accountController.accountLogin)
)

router.get(
  "/",
  //utilities.checkLogin, 
  utilities.handleErrors(accountController.buildAccountManagement))

//Route to update the account information
router.get(
  "/update/:accountId", 
  //utilities.checkLogin, 
  utilities.handleErrors(accountController.buildAccountUpdate));

//handle the actual update
router.post(
  "/update",
  updateValidate.registrationRules(), 
  updateValidate.checkRegData,
  utilities.handleErrors(accountController.updateAccount));

router.get(
  "/logout",
  utilities.handleErrors(accountController.accountLogout));

  router.get(
  "/reset-password",
  utilities.handleErrors(accountController.buildResetPassword));

    router.post(
  "/reset-password",
  utilities.handleErrors(accountController.resetPassword));

      router.post(
  "/update-password",
  utilities.handleErrors(accountController.updatePassword));

module.exports = router;
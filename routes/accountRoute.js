const express=require("express")
const router = express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')
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
  utilities.checkLogin, 
  utilities.handleErrors(accountController.buildAccountManagement))

  
module.exports = router;
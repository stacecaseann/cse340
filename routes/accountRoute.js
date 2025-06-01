const express=require("express")
const router = express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')
const loginValidate = require('../utilities/login-validation')

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
    loginValidate.checkRegData,
  (req, res) => {
    res.status(200).send('login process')
  }
)
module.exports = router;
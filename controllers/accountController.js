const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")

const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  res.render("account/login", {
    title: "Login",
    errors: null,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  res.render("account/register", {
    title: "Register",
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  //stores the parameters from html, same as table column names !!
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",   
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",   
    })
  }
}




/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      /*
       If the passwords match, then the JavaScript delete function is used to remove the hashed password from the accountData array.
       */

      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
 *  Process logout request
 * ************************************ */
async function accountLogout(req, res) {
       req.flash("notice","Please log in")
  res.clearCookie("jwt")
  res.redirect("/account/login")
}



/* ****************************************
 *  Account Management
 * ************************************ */
async function buildAccountManagement(req, res) {
  res.render("account/account-management", {
    title: "Account Management",
    errors: null,
  })
}

/* ****************************************
 *  Account update view
 * ************************************ */
async function buildAccountUpdate(req, res) {
  const account_id = req.params.accountId
  const account = await accountModel.getAccountById(account_id)
  res.locals.account_firstname = account.account_firstname
  res.locals.account_lastname = account.account_lastname
  res.locals.account_email = account.account_email

  res.render("account/account-update", {
    title: "Account Update",
    errors: null,
  })
}
/* ****************************************
 *  Account update action
 * ************************************ */
async function updateAccount(req, res) {
  const {
    account_id,
    account_firstname,
    account_lastname,
    account_email
  } = req.body
  const updateResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  )
  if(updateResult)
  {
    const name = updateResult.account_firstname + " " + updateResult.account_lastname
    res.locals.account_firstname = updateResult.account_firstname
    res.locals.account_lastname = updateResult.account_lastname
    res.locals.email = updateResult.account_email
    req.flash("notice",`The account for ${name} was successfully updated.`)
    res.redirect("/account/")
  }
  else
  {
    const name = account_firstname + " " + account_lastname
    req.flash("notice","Sorry, the insert failed.")
    req.status(501).render("account/account-update/",
      {
        title: "Account Update for" + name,
        errors: null,
      }
    )
  }

}

/* ****************************************
 *  password update action
 * ************************************ */
async function updatePassword(req, res) {
  const {
    account_id,
    account_password
  } = req.body

  let hashedPassword
  try{
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  }
  catch (error) {
    req.flash("notice", 'Sorry, there was an error hashing the password.')
    res.status(500).render("account/account-update/", {
      title: "Registration",
      errors: null,
    })
  }

  const updateResult = await accountModel.updatePassword(
    account_id,
    hashedPassword
  )
  if(updateResult)
  {
    const name = updateResult.account_firstname + " " + updateResult.account_lastname
    req.flash("notice",`The password for ${name} was successfully updated.`)
    res.redirect("/account/")
  }
  else
  {
    req.flash("notice","The password could not be updated.")
    res.redirect("/account/update/" + account_id)
  }

}


/* ****************************************
 *  password update view
 * ************************************ */
async function buildResetPassword(req, res) {
  res.render("account/reset-password", {
    title: "Reset Password",
    errors: null,
  })
}

/* ****************************************
 *  password update view
 * ************************************ */
async function resetPassword(req, res) {
    const {
    account_email,
    account_password
  } = req.body
let hashedPassword
  try{
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  }
  catch (error) {
    req.flash("notice", 'Sorry, there was an error hashing the password.')
    res.status(500).render("account/reset-password/", {
      title: "Reset Password",
      errors: null,
    })
  }


const updateResult = await accountModel.resetPasswordByEmail(
    account_email,
    hashedPassword
  )
  if(updateResult)
  {
    const name = updateResult.account_firstname + " " + updateResult.account_lastname
    req.flash("notice",`The password for ${name} was successfully updated.`)
    res.redirect("/account/login/")
  }
  else
  {
    req.flash("notice","The password could not be updated.")
    res.status(501).render("account/reset-password",
      {
        title: "Account Update",
        errors: null,
      }
    )
  }
}

module.exports = { buildLogin, 
  buildRegister, 
  registerAccount, 
  accountLogin, 
  buildAccountManagement,  
  buildAccountUpdate,
  updateAccount,
  updatePassword,
accountLogout,
buildResetPassword,
resetPassword }
//Files that we reuse over and over
//but they don't directly belong to the MVC Structure

const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const Util = {}

/* *********
* Constructs the nav HTML unordered list
************ */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list +='<li><a href="/" title="Home page">Home</a></li>'
    list +='<li><a href="/search/" title="Search">Search</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list += '<a href="/inv/type/' +
        row.classification_id + 
        '" title="See our inventory of ' + 
        row.classification_name + 
        ' vehicles">' + 
        row.classification_name + 
        "</a>"
    })
    list += "</ul>"
    return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid= ""
  if(data.length > 0){
    grid = '<div id="inv-display" class="inv-display">'
    data.forEach(vehicle => { 
      grid += '<div class="inv-item">'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><div class="image-container"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></div></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</div>'
    })
    grid += '</div>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the inventory detail view HTML
* ************************************ */
Util.buildInvDetailGrid = async function(data){
  let grid
  if(data.length > 0){
    let details = data[0]
    grid = '<div class="inv-details">'     
      grid += '<h2>' + details.inv_year + ' ' +  details.inv_make + ' ' + details.inv_model + '</h2>'
      grid += '<div class="main-across">'
      grid += '<div>'
      grid += '<img src="' + details.inv_image
      +'" alt="Image of '+ details.inv_make + ' ' + details.inv_model 
      +' on CSE Motors">'
      grid += '</div>'
      grid += '<div><h3>' +  details.inv_make + ' ' + details.inv_model + ' Details</h3>'
      grid += '<p><span class="highlight">Price:</span> $' + new Intl.NumberFormat('en-US').format(details.inv_price) + '</p>'
      grid += '<p><span class="highlight">Description:</span> ' + details.inv_description + '</p>'
      grid += '<p><span class="highlight">Color:</span> ' + details.inv_color + '</p>'
      grid += '<p><span class="highlight">Miles:</span> ' + new Intl.NumberFormat('en-US').format(details.inv_miles) + '</p>'
      grid += '</div>'
      grid += '</div>'  
      grid += '</div>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
      '<select name="classification_id" id="classificationList" required>'
    classificationList += `<option value="">Choose a Classification</option>`
    data.rows.forEach((row) => {
      classificationList += '<option value="' + row.classification_id + '"'
      if (
        classification_id != null &&
        row.classification_id == classification_id
      ) {
        classificationList += " selected "
      }
      classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
  }

  Util.buildYearList = async function (label, fieldName, fieldId, selected=null) {
    let yearSelect = `<label>${label}`
    yearSelect += `<select name="${fieldName}" id="${fieldId}" required>`

    for(let i = 1950; i <= 2025; i++)
    {
      yearSelect += `<option value="${i}" `
      if(selected != null && selected == i)
      {
        yearSelect += " selected "
      }
      yearSelect += ">" + i + "</option>"
    }
    yearSelect += "</select></label>"
    return yearSelect
  }
  
  function verifyJwt(token, secret)
  {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (err, account) =>
      {
        if (err) return reject(err)
        resolve(account);
      });
    });
  }

  Util.getLoggedIn = async function (req){
    if (!req.cookies.jwt) return null
    try{
      const accountData = await verifyJwt(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
      return accountData
    }
    catch{
      return null
    }
  }
  
/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
//Promise.resolve is a wrapper 
/*
the wrapped function is called and attempts to fulfill its normal process, but now does so within a JavaScript promise. If it succeeds, then the promise is resolved and everything continues normally.
.catch(next) - if there is an error, then the Promise "fails", the error that caused the failure is "caught" and forwarded to the next process in the application chain.

*/

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  res.locals.loggedIn = 0;
  res.locals.account_firstname = "";
  res.locals.account_lastname = "";
  res.locals.account_email = "";
  res.locals.account_type = "None";
  res.locals.account_id = -1;
  if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedIn = 1
    res.locals.account_firstname = accountData?.account_firstname ?? "";
    res.locals.account_lastname = accountData?.account_lastname ?? "";
    res.locals.account_email = accountData?.account_email ?? "";
    res.locals.account_type = accountData?.account_type ?? "None";
    res.locals.account_id = accountData?.account_id  ?? -1
    next()
   })
 } else {
  next()
 }
}

/* ****************************************
* Middleware to create navigation
**************************************** */
Util.attachNav = async (req, res, next) => {
  res.locals.nav = await Util.getNav();
  next();
}

/* ****************************************
 *  Check Account has Employee or Admin privilege
 * ************************************ */

Util.checkAccount = async (req, res, next) => {
 const token = req.cookies.jwt
 if (!token)
 {
    req.flash("notice", "Please log in");
    return res.redirect("/account/login"); 
 }
 try{
  const accountData = await verifyToken(token)
  const role = accountData.account_type
  if (role != "Admin" && role != "Employee")
  {
    req.flash("notice","Your account does not have the privileges to access the previous page")
    return res.redirect("/account/login")
  }
  next()  
 }
 catch(err)
 {
    req.flash("notice", "Please log in");
    return res.redirect("/account/login"); 
 }
}

function verifyToken(token)
{
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded);
    });
  });
}
/* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedIn) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }
 
module.exports = Util
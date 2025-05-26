//Files that we reuse over and over
//but they don't directly belong to the MVC Structure

const invModel = require("../models/inventory-model")
const Util = {}

/* *********
* Constructs the nav HTML unordered list
************ */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list +='<li><a href="/" title="Home page">Home</a></li>'
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
  let grid
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
module.exports = Util
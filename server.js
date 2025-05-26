/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config()
const app = express() //express as a function is defined to app variable
const static = require("./routes/static")
const inventoryRoute = require("./routes/inventoryRoute")
const invDetailRoute = require("./routes/inventoryDetailRoute")
const mockErrorRoute = require("./routes/mockErrorRoute")
const baseController = require("./controllers/baseController")
const utilities = require("./utilities/")

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")//ejs will be the view engine, all views stored in a views folder
app.use(expressLayouts)//use the exxpress-ejs-layouts
app.set("layout", "./layouts/layout") // not at views root, when the express ejs layout looks for the basic template, it will find a layouts folder , template named layout

/* ***********************
 * Routes
 *************************/
app.use(static) //takes the routes/static config and applies to the application

//Index route
app.get("/", utilities.handleErrors(baseController.buildHome))
//The express application will watch the get object for a particular route. / is the route being satched
//function(req, res) = js function that takes request and response as parameters
//res.render() response object, render is an express function that will retrieve the index view
//title home is an object to send- used in head partial file

// Inventory routes
app.use("/inv", inventoryRoute)

//Inventory Detail routes
app.use("/inv", invDetailRoute)

//Mock Error route
app.use("/inv", mockErrorRoute)
// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************
* Express Error Handler
* Place after all other middleware
* Otherwise it will never be reached 
* And the application will break
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})

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
const app = express()
const static = require("./routes/static")
const inventoryRoute = require("./routes/inventoryRoute")
const invDetailRoute = require("./routes/inventoryDetailRoute")
const managementRoute = require("./routes/managementRoute")
const mockErrorRoute = require("./routes/mockErrorRoute")
const baseController = require("./controllers/baseController")
const utilities = require("./utilities/")
const accountRoute = require("./routes/accountRoute")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")


//week 4
const session = require("express-session")
//don't store in memory, store in a db- connect-pg-simple
//
const pool = require('./database/')

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")//ejs will be the view engine, all views stored in a views folder
app.use(expressLayouts)//use the exxpress-ejs-layouts
app.set("layout", "./layouts/layout") // not at views root, when the express ejs layout looks for the basic template, it will find a layouts folder , template named layout

//week 4
/* ****************
* Middleware
* *****************/
app.use(session({
  //store is where the session data will be store, in connect-pg-simple pakcage
  store: new (require('connect-pg-simple')(session))({//create session table
    createTableIfMissing: true,
    pool,
}),
secret:process.env.SESSION_SECRET,//will protect the session
resave: true,//bc we are using "flash messages', usually it's false
saveUninitialized: true,
name: 'sessionId',//name of the unique session id
}))

//Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next)
{
  res.locals.messages = require('express-messages')(req, res)
  next()//passes control to the next piece of middleware
})

/*
 tells the express application to read and work with data sent via a URL as well as from a form, stored in the request object's body. The "extended: true" object is a configuration that allows rich objects and arrays to be parsed.
*/
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use(cookieParser())
app.use(utilities.checkJWTToken)
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

//Account route
app.use("/account", accountRoute)

//Inv Management route
app.use("/inv", managementRoute)



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
    nav,
    errors: null, 
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

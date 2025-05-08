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
app.get("/", function(req, res){
  res.render("index", {title: "Home"})
})
//The express application will watch the get object for a particular route. / is the route being satched
//function(req, res) = js function that takes request and response as parameters
//res.render() response object, render is an express function that will retrieve the index view
//title home is an object to send- used in head partial file



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

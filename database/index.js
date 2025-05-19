const { Pool } = require("pg")
/* Imports Pool from the pg package 
A pool is a collection of connection objects
that allow multiple site visitors to be interacting with the 
database at any given time. This keeps you from 
having to create a separate connection for 
each interaction*/

require("dotenv").config()
/*
allows the sensitive information about the db location
and connection credentials to be stored 
in a separate location and still be accessed
*/

/* ***********
* Connection Pool
* SSL Object needed for local testing of app
* But will cause problems in production environment
* If - else will make determination which to use
* *************** */

let pool 
/*
Creates a local pool variable to hold the functionality of the 
Pool connection
*/

//If it's in dev environment, checks the env file
//in production, nothing will be found
if (process.env.NODE_ENV == "development") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
})

//SSL is a way to encrypt the flow of information

// Added for troubleshooting queries
// during development

//exports an async query that accepts the text of the query and parameters,
//adds sql to the console log if it is successful.
module.exports = { //exports this to be used when a db connection is needed
  async query(text, params) {
    try {
      const res = await pool.query(text, params)
      console.log("executed query", { text })
      return res
    } catch (error) {
      console.error("error in query", { text })
      throw error
    }
  },
}
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })
  module.exports = pool
}

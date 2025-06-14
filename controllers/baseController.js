const utilities = require("../utilities/")
//imports index.js file from the utilities folder
const baseController = {}

const reviewsData = require("../data/reviews.json")
const upgradesData = require("../data/upgrades.json")
console.log(upgradesData.upgrades)

//similar to creating a method within a class,
//basecontroller would be the class name
//buildHome would be the method
baseController.buildHome = async function(req, res){
  //notice = type of message
  //added as a class to the unordered list. write css rules using these classes to style the messages
  res.render("index", {title: "Home", 
        reviews : reviewsData.reviews,
    upgrades: upgradesData.upgrades,
    errors: null,
    })
  //ejs to sends the index view back to the client
}

module.exports = baseController

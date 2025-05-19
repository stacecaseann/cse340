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
module.exports = Util
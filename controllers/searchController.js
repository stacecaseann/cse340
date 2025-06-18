const inventoryModel = require("../models/inventory-model")
const utilities = require("../utilities/")
/* ****************************************
*  Deliver login view
* *************************************** */
async function buildSearch(req, res, next) {
  const minPrice = '0'
  const maxPrice = '9990000'
  const minYear = 1950
  const maxYear = 2025
  const searchText = ''
  res.locals.min_price = minPrice
  res.locals.max_price = maxPrice
  res.locals.min_year = minYear
  res.locals.max_year = maxYear
  res.locals.make = []
  res.locals.search_text = ""

  const minYearList = await utilities.buildYearList("Min Year","min_year", "minYear", minYear)
  const maxYearList = await utilities.buildYearList("Max Year", "max_year", "maxYear", maxYear)

  const data = await inventoryModel.searchInventory(
    [],
    minPrice,
    maxPrice,
    minYear,
    maxYear,
    ""    
  )
  const grid = await utilities.buildClassificationGrid(data)
  const allMakes = await inventoryModel.getMake()
  res.render("search/search-inventory", {
    title: "Search",
    errors: null,
    grid,
    allMakes,
    minYearList,
    maxYearList,
    searchText
  })
}


/* ****************************************
*  Deliver search inventory
* *************************************** */
async function searchInventory(req, res) {
  const test = req.body
  const minPrice = req.body.min_price
  const maxPrice = req.body.max_price
  const make = [].concat(req.body.make || []);
  const minYear = req.body.min_year
  const maxYear = req.body.max_year
  const searchText = req.body.search_text

  res.locals.min_price = minPrice
  res.locals.max_price = maxPrice
  res.locals.make = make
  res.locals.min_year = minYear
  res.locals.max_year = maxYear
  res.locals.search_text = searchText

  const allMakes = await inventoryModel.getMake()
  const minYearList = await utilities.buildYearList("Min Year", "min_year", "minYear", minYear)
  const maxYearList = await utilities.buildYearList("Max Year", "max_year", "maxYear", maxYear)
  const data = await inventoryModel.searchInventory(
    make,
    minPrice,
    maxPrice,
    minYear,
    maxYear,
    searchText
  )
  const grid = await utilities.buildClassificationGrid(data)
  console.log(data)
  res.render("search/search-inventory", {
    title: "Search",
    errors: null,
    grid,
    allMakes,
    minYearList,
    maxYearList
  })
}

module.exports = { buildSearch,searchInventory }
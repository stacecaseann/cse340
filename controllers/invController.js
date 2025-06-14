const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const classificationModel = require("../models/classification-model")
const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */

invCont.buildByClassificationId = async function (req, res, next) { //next is Express function
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)

    const className = data?.[0]?.classification_name ?? ""

    res.render("./inventory/classification", {
        title: className + " Vehicles",
        grid,
        errors: null,
    })
}
/* ***************************
 *  Build Classification View
 * ************************** */
invCont.createClassificationEntry = async function(req, res, next){
    const { classification_name } = req.body

    const classificationResult = await classificationModel.createClassification(
    classification_name
  )

 if (classificationResult) {
    req.flash(
      "notice",
      `Classification ${classification_name} was created successfully.`
    )
    const classificationSelect = await utilities.buildClassificationList()
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      errors:null,
      classificationSelect,
    })
  } else {
    req.flash("notice", "Sorry, the classification was not created.")
    res.status(501).render("inventory/classification-entry", {
      title: "Add New Classification",
      classification_name,
      errors:null,
    })
  }

}

invCont.buildClassificationCreationForm = async function (req, res, next){
    res.render("inventory/classification-entry", {
        title: "Add new classification",
        errors: null,
    })
}

/* ***************************
 *  Build Vehicle View
 * ************************** */
invCont.createInventoryEntry = async function(req, res, next){
    const { 
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id } = req.body

    const vehicleResult = await invModel.addToInventory(
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    ) 

 if (vehicleResult) {
    req.flash(
      "notice",
      `${inv_year} ${inv_make} ${inv_model} was created successfully.`
    )
    const classificationSelect = await utilities.buildClassificationList()
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      errors:null,
      classificationSelect,
    })
  } else {
        const classificationList = await utilities.buildClassificationList()
    req.flash("notice", "Sorry, the vehicle was not created.")
    res.status(501).render("inventory/vehicle-entry", {
      title: "Add New Vehicle",
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
      errors:null,
      classificationList,
    })
  }

}

invCont.buildVehicleCreationForm = async function (req, res, next){
    const classificationList = await utilities.buildClassificationList()
    res.render("inventory/vehicle-entry", {
        title: "Add New Vehicle",
        errors: null,
        classificationList,
    })
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData.length != 0 && invData[0].inv_id) {
    return res.json(invData)
  } else {
    res.json([])
  }
}


/* ***************************
 *  Edit Inventory Form
 * ************************** */
invCont.buildEditInventory = async function (req, res, next){
  const test = req.params.inv_id
  const inv_id = parseInt(test)
  const itemData = await invModel.getInventoryById(inv_id)
  const classificationList = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    errors: null,
    classificationList,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
    })
  }
}
/* ***************************
 *  Delete inventory confirmation
 * ************************** */

invCont.deleteInventoryConfirmation = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id)
    const itemData = await invModel.getInventoryById(inv_id)
 
    res.render("./inventory/delete-confirm", {
        title: `Delete ${itemData.inv_make} ${itemData.inv_model}`,
        errors: null,
        inv_id: itemData.inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: itemData.inv_year,
    })
}


/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  const {
    inv_id,
    inv_make,
    inv_model  
  } = req.body
  const updateResult = await invModel.removeInventoryById(
    inv_id
  )
const itemName = inv_make + " " + inv_model
    //const classificationSelect = await utilities.buildClassificationList(classification_id)
    
  if (updateResult) {
    req.flash("notice", `The ${inv_make} ${inv_model} was successfully deleted.`)
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, the delete failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    //classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    })
  }
}


module.exports = invCont;
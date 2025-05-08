const express = require('express'); 
const router = express.Router();//router is a function

// Static Routes
// Set up "public" folder / subfolders for static files
router.use(express.static("public")); //use the express.static function, static resources will be in this folder
router.use("/css", express.static(__dirname + "public/css"));//any route that contains css is in public/css
router.use("/js", express.static(__dirname + "public/js"));
router.use("/images", express.static(__dirname + "public/images"));

module.exports = router; //exports the router object with all of these statements for use in other areas of the application **!!!**




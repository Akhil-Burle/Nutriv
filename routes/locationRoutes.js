const express = require("express");
const locationController = require("./../controllers/locationController");
const authController = require("./../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(locationController.getAllLocations)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    locationController.addNewLocation
  );

module.exports = router;

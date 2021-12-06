const express = require("express");
const discountController = require("./../controllers/discountController");
const authController = require("./../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(discountController.getAllDiscounts)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    discountController.addNewDiscount
  );

module.exports = router;

const express = require("express");
const couponController = require("./../controllers/couponController.js");
const authController = require("./../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    couponController.getAllCoupons
  )
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    couponController.addNewCoupon
  );

module.exports = router;

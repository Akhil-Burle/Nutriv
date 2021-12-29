const express = require("express");
const cartController = require("./../controllers/cartController");
const authController = require("./../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(authController.protect, cartController.getAllCartItems)
  .post(authController.protect, cartController.addNewCartItem);

router
  .route("/:id")
  .get(authController.protect, cartController.getCartItem)
  .patch(authController.protect, cartController.updateCartItem)
  .delete(authController.protect, cartController.deleteCartItem);

module.exports = router;

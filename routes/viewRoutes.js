const express = require("express");

const viewsController = require("../controllers/viewsController.js");
const authController = require("../controllers/authController.js");
const bookingController = require("../controllers/bookingController.js");

const router = express.Router();

router.get("/", authController.isLoggedIn, viewsController.index);
router.get(
  "/menu",
  bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewsController.getOverview
);
router.get("/menu", authController.isLoggedIn, viewsController.getOverview);
router.get("/menu/:slug", authController.isLoggedIn, viewsController.getDish);
router.get("/login", authController.isLoggedIn, viewsController.getLoginForm);
router.get("/signup", authController.isLoggedIn, viewsController.getSignupForm);
router.get("/emailVerify", viewsController.getEmailVerifyPage);
router.get("/logout", authController.isLoggedIn, authController.logout);
router.get("/me", authController.protect, viewsController.getAccount);
router.get("/my-orders", authController.protect, viewsController.getMyBookings);

router.post(
  "/submit-user-data",
  authController.protect,
  viewsController.updateUserData
);

module.exports = router;

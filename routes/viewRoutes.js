const express = require("express");

const viewsController = require("../controllers/viewsController.js");
const authController = require("../controllers/authController.js");

const router = express.Router();

router.get("/", authController.isLoggedIn, viewsController.index);
router.get("/menu", authController.isLoggedIn, viewsController.getOverview);
router.get("/menu/:slug", authController.isLoggedIn, viewsController.getDish);
router.get("/login", authController.isLoggedIn, viewsController.getLoginForm);
router.get("/signup", authController.isLoggedIn, viewsController.getSignupForm);
router.get("/emailVerify", viewsController.getEmailVerifyPage);
// router.get("/logout", authController.isLoggedIn, authController.logout);
router.get("/me", authController.protect, viewsController.getAccount);
router.get("/my-orders", authController.protect, viewsController.getMyBookings);

router.get("/docs", viewsController.getDocs);

router.post(
  "/submit-user-data",
  authController.protect,
  viewsController.updateUserData
);

// Admin control routes:
// router.use(authController.protect);
// router.use(authController.restrictTo("admin"));

router.get(
  "/dashboard",
  authController.protect,
  authController.restrictTo("admin", "manager"),
  viewsController.getDashboard
);
router.get(
  "/dashboard/addNewDish",
  authController.protect,
  authController.restrictTo("admin", "manager"),
  viewsController.getNewDishForm
);
router.get(
  "/dashboard/getAllDishes",
  authController.protect,
  authController.restrictTo("admin", "manager"),
  viewsController.getAllDishesTable
);

module.exports = router;

const express = require("express");

const viewsController = require("../controllers/viewsController.js");
const authController = require("../controllers/authController.js");

const router = express.Router();

router.use(viewsController.alerts);

router.get("/", authController.isLoggedIn, viewsController.index);
router.get("/menu", authController.isLoggedIn, viewsController.getOverview);
router.get("/menu/:slug", authController.isLoggedIn, viewsController.getDish);
router.get("/login", authController.isLoggedIn, viewsController.getLoginForm);
router.get("/signup", authController.isLoggedIn, viewsController.getSignupForm);
router.get("/emailVerify", viewsController.getEmailVerifyPage);
router.get("/me", authController.protect, viewsController.getAccount);
router.get("/my-orders", authController.protect, viewsController.getMyBookings);
router.get("/verify", viewsController.getVerifyPage);
router.get("/cart", authController.protect, viewsController.getCart);
router.get(
  "/subscriptions",
  authController.protect,
  viewsController.getSubscriptions
);
router.get("/verifySuccessfull", viewsController.getVerifySuccessfull);
router.get("/forgotPassword", viewsController.getForgotPasswordForm);
router.get("/forgotPasswordMessage", viewsController.getForgotPasswordMessage);
router.get("/resetPassword/:token", viewsController.getResetPasswordForm);

router.get("/docs", viewsController.getDocs);
router.get("/terms", viewsController.getTerms);

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
router.get(
  "/dashboard/updateDish/:id",
  authController.protect,
  authController.restrictTo("admin", "manager"),
  viewsController.getUpdateDishForm
);

module.exports = router;

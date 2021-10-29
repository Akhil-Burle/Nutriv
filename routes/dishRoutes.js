const express = require("express");
const dishController = require("./../controllers/dishController");
const authController = require("./../controllers/authController.js");
const reviewRouter = require("./reviewRoutes.js");

const router = express.Router();

// router.param('id', dishController.checkID);

router.use("/:dishId/reviews", reviewRouter);

router
  .route("/top-5-cheap")
  .get(dishController.aliasTopDishes, dishController.getAllDishes);

router.route("/dish-stats").get(dishController.getDishStats);
router.route("/monthly-plan/:year").get(dishController.getMonthlyPlan);

router
  .route("/")
  .get(authController.protect, dishController.getAllDishes)
  .post(dishController.createDish);

router
  .route("/:id")
  .get(dishController.getDish)
  .patch(dishController.updateDish)
  .delete(
    authController.protect,
    authController.restrictTo("admin", "manager"),
    dishController.deleteDish
  );

module.exports = router;

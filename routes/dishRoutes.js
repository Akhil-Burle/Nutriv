const express = require("express");
const dishController = require("./../controllers/dishController");
const authController = require("./../controllers/authController.js");
const reviewRouter = require("./../routes/reviewRoutes.js");

const router = express.Router();

// router.param('id', dishController.checkID);

router.use("/:dishId/reviews", reviewRouter);

router
  .route("/top-5-cheap")
  .get(dishController.aliasTopDishes, dishController.getAllDishes);

router.route("/dish-stats").get(dishController.getDishStats);
router
  .route("/monthly-plan/:year")
  .get(
    authController.protect,
    authController.restrictTo("admin", "chef"),
    dishController.getMonthlyPlan
  );

router
  .route("/hotels-within/:distance/center/:latlng/unit/:unit")
  .get(dishController.getHotelsWithin);

router.route("/distances/:latlng/unit/:unit").get(dishController.getDistances);

router
  .route("/")
  .get(dishController.getAllDishes)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    dishController.uploadDishPhoto,
    dishController.resizeDishPhoto,
    dishController.createDish
  );

router
  .route("/:id")
  .get(dishController.getDish)
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    dishController.updateDish
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    dishController.deleteDish
  );

module.exports = router;

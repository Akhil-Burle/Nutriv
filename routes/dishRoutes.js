const express = require("express");
const dishController = require("./../controllers/dishController");

const router = express.Router();

// router.param('id', dishController.checkID);

router
  .route("/top-5-cheap")
  .get(dishController.aliasTopDishes, dishController.getAllDishes);

router.route("/dish-stats").get(dishController.getDishStats);
router.route("/monthly-plan/:year").get(dishController.getMonthlyPlan);

router
  .route("/")
  .get(dishController.getAllDishes)
  .post(dishController.createDish);

router
  .route("/:id")
  .get(dishController.getDish)
  .patch(dishController.updateDish)
  .delete(dishController.deleteDish);

module.exports = router;

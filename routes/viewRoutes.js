const express = require("express");

const viewsController = require("../controllers/viewsController.js");
const authController = require("../controllers/authController.js");

const router = express.Router();

router.use(authController.isLoggedIn);

router.get("/", viewsController.index);
router.get("/menu", viewsController.getOverview);
router.get("/menu/:slug", viewsController.getDish);
router.get("/login", viewsController.getLoginForm);

module.exports = router;

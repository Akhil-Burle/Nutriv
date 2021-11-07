const express = require("express");
const multer = require("multer");
const userController = require("./../controllers/userController.js");
const authController = require("./../controllers/authController.js");

const upload = multer({ dest: "public/img/users" });

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/verify", authController.verify);
router.get("/verifyEmail/:token", authController.verifyEmail);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

// Protect all routes after this middleware:
router.use(authController.protect);

router.patch("/updateMyPassword", authController.updatePassword);

router.get("/me", userController.getMe, userController.getUser);

router.patch("/updateMe", upload.single("photo"), userController.updateMe);
router.delete("/deleteMe", userController.deleteMe);

// All the below are only for the admin:
router.use(authController.restrictTo("admin"));

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;

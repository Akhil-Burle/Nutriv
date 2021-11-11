const express = require("express");
const bookingController = require("./../controllers/bookingController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router.get("/checkout-session/:dishId", bookingController.getCheckoutSession);

router.use(authController.restrictTo("admin"));

router.get("/getAllBookings", bookingController.getAllBookings);
router.post("/addNewBooking", bookingController.addNewBooking);
router.patch("/updateBooking/:id", bookingController.updateBooking);
router.delete("/deleteBooking/:id", bookingController.deleteBooking);
router.get("/getBooking/:id", bookingController.getBooking);

module.exports = router;

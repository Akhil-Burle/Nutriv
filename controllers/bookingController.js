const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Dish = require("../models/dishModel");
const Booking = require("../models/bookingModel.js");
const User = require("../models/userModel.js");
const catchAsync = require("../utils/catchAsync.js");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory.js");

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // Get the currently booked dish:
  const dish = await Dish.findById(req.params.dishId);

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${req.protocol}://${req.get("host")}/menu?dish=${
      req.params.dishId
    }&user=${req.user.id}&price=${dish.price}`,
    cancel_url: `${req.protocol}://${req.get("host")}/menu/${dish.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.dishId,
    line_items: [
      {
        name: `${dish.name}`,
        description: `${dish.summary}`,
        amount: dish.price * 100,
        currency: "inr",
        quantity: 1,
      },
    ],
  });

  //   console.log(session);

  /* const invoiceItem = await stripe.invoiceItems.create({
    customer: ` ${session.id}`,
    amount: `${session.amount_total}`,
  });
  const invoice = await stripe.invoices.pay("in_18jwqyLlRB0eXbMtrUQ97YBw"); */

  // Create session as response
  res.status(200).json({
    status: "success",
    session,
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  // This is only TEMPORARY, because it's UNSECURE: everyone can make bookings without paying
  const { dish, user, price } = req.query;

  if (!dish && !user && !price) return next();
  await Booking.create({ dish, user, price });

  res.redirect(req.originalUrl.split("?")[0]);
});

exports.getAllBookings = factory.getAll(Booking);
// exports.getUserBookings = factory.getOne(Booking, { path: "bookings" });
exports.addNewBooking = factory.createOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);

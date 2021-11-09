const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Dish = require("../models/dishModel");
const catchAsync = require("../utils/catchAsync.js");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory.js");

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // Get the currently booked dish:
  const dish = await Dish.findById(req.params.dishId);

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${req.protocol}://${req.get("host")}/`,
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

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Dish = require("../models/dishModel.js");
const User = require("../models/userModel.js");
const Booking = require("../models/bookingModel.js");
const catchAsync = require("../utils/catchAsync.js");
const factory = require("./handlerFactory.js");

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked dish
  const dish = await Dish.findById(req.params.dishId);
  // console.log(dish);

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${req.protocol}://${req.get("host")}/my-orders?alert=booking`,
    cancel_url: `${req.protocol}://${req.get("host")}/menu/${dish.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.dishId,
    line_items: [
      {
        name: `${dish.name}`,
        description: dish.summary,
        images: [
          `${req.protocol}://${req.get("host")}/img/dishes/${dish.imageCover}`,
        ],
        amount: dish.price * 100,
        currency: "inr",
        quantity: 1,
      },
    ],
  });

  // 3) Create session as response
  res.status(200).json({
    status: "success",
    session,
  });
});

const createBookingCheckout = async (session) => {
  const dish = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email })).id;
  const price = session.data.object.amount_total / 100;
  await Booking.create({ dish, user, price });
};

exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed")
    createBookingCheckout(event.data.object);

  res.status(200).json({ received: true });
};

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);

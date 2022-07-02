const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Dish = require("../models/dishModel.js");
const User = require("../models/userModel.js");
const Booking = require("../models/bookingModel.js");
const catchAsync = require("../utils/catchAsync.js");
const factory = require("./handlerFactory.js");
const Email = require("./../utils/email.js");

/*         "GB",
        "BE",
        "CL",
        "CO",
        "CU",
        "CD",
        "GL",
        "IR",
        "IT",
        "MX",
        "NZ",
        "PK",
        "PT",
        "QA",
        "RU",
        "SA",
        "SG",
        "KR",
        "LK",
        "CH",
        "TW",
        "TH",
        "AE",
        "TR",
 */

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked dish
  const dish = await Dish.findById(req.params.dishId);
  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    customer_email: req.user.email,
    client_reference_id: req.params.dishId,
    shipping_address_collection: {
      allowed_countries: ["US", "CA", "IN", "AU", "GB"],
    },
    allow_promotion_codes: true,
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 0,
            currency: "inr",
          },
          display_name: "Standard",
          delivery_estimate: {
            minimum: {
              unit: "hour",
              value: 1,
            },
            maximum: {
              unit: "hour",
              value: 1,
            },
          },
        },
      },
    ],

    line_items: [
      {
        tax_rates: ["txr_1JtvInSB8CbvCgkh0EtVqYE6"],
        adjustable_quantity: {
          enabled: true,
          minimum: 1,
          maximum: 40,
        },
        price_data: {
          currency: "inr",
          product_data: {
            name: `${dish.name}`,
            description: dish.summary,
          },

          unit_amount: `${dish.price * 100}`,
        },
        quantity: 1,
      },
    ],

    phone_number_collection: {
      enabled: true,
    },
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/my-orders?alert=booking`,
    cancel_url: `${req.protocol}://${req.get("host")}/menu/${dish.slug}`,
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
  const price = session.amount_total / 100;
  await Booking.create({ dish, user, price });

  // const fullUser = await User.findOne({ email: session.customer_email });
  const fullUser = await User.findOne({ email: "laura@nutriv.com" });
  console.log(fullUser);

  // const url = "https://nutrivakhil.herokuapp.com/my-orders";
  // await new Email(fullUser, url).sendBooking();
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

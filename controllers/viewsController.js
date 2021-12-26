const Dish = require("../models/dishModel.js");
const User = require("../models/userModel.js");
const Booking = require("../models/bookingModel.js");
const Location = require("../models/locationModel.js");
const Discount = require("../models/discountModel.js");
const Cart = require("../models/cartModel.js");
const catchAsync = require("../utils/catchAsync.js");
const AppError = require("../utils/appError.js");
const APIFeatures = require("../utils/apiFeatures");

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === "booking")
    res.locals.alert =
      "Your booking was successful! Please check your email for a confirmation. If your booking doesn't show up here immediatly, please come back later.";
  next();
};

exports.index = (req, res, next) => {
  res.status(200).render("index", { title: "Never Cook Again!" });
};

exports.getOverview = catchAsync(async (req, res, next) => {
  // Get all dishes from collection:
  let filter = {};
  if (req.params.dishId) filter = { dish: req.params.dishId };
  // const dishes = await Dish.find();
  const features = new APIFeatures(Dish.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  // Build the template for the overview:
  const dishes = await features.query;
  const discounts = await Discount.find({ isValid: true });
  // Render template:
  res.status(200).render("menu", {
    title: "Our Menu",
    dishes,
    discounts,
  });
});

exports.getDish = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested dish (including reviews and guides)
  const dish = await Dish.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review rating user",
  });
  const discounts = await Discount.find({ isValid: true });

  if (!dish) {
    return next(new AppError("There is no dish with that name.", 404));
  }

  // 2) Build template
  // 3) Render template using data from 1)
  res.status(200).render("dish", {
    title: `${dish.name}`,
    dish,
    discounts,
  });
});

exports.getEmailVerifyPage = (req, res) => {
  res.status(200).render("message", {
    title: "Verify your email",
    text: "Please verify your email address by clicking on the link sent to the email address provided. Please check your spam folder if you can't find it in your inbox.",
  });
};

exports.getVerifySuccessfull = (req, res) => {
  res.status(200).render("message", {
    title: "Verification Successfull",
    text: "Your account was successfully verifed! Place your first order for free!!",
  });
};
exports.getForgotPasswordMessage = (req, res) => {
  res.status(200).render("message", {
    title: "Verification Successfull",
    text: "Email successfully please click on the link sent. Please check your spam folder if you can't find it in your inbox.",
  });
};

exports.getLoginForm = (req, res) => {
  res.status(200).render("login", { title: "Login" });
};

exports.getSignupForm = (req, res) => {
  res.status(200).render("signup", { title: "Create a new account" });
};

exports.getAccount = (req, res) => {
  res.status(200).render("account", { title: "Your Account" });
};

exports.getDocs = (req, res) => {
  res.status(200).render("docs");
};
exports.getTerms = (req, res) => {
  res.status(200).render("terms", { title: "Privacy & Terms" });
};

exports.getVerifyPage = (req, res) => {
  res.status(200).render("verifyForm", { title: "Verify email" });
};

exports.getForgotPasswordForm = (req, res) => {
  res.status(200).render("forgotPassword", { title: "Forgot Password" });
};
exports.getResetPasswordForm = (req, res) => {
  res.status(200).render("resetPassword", { title: "Reset Your Password" });
};

exports.getMyBookings = catchAsync(async (req, res, next) => {
  // Find all bookings:
  const bookings = await Booking.find({ user: req.user.id });
  // Find dishes with the returned IDS:
  const dishIDs = bookings.map((el) => el.dish);
  const dishes = await Dish.find({ _id: { $in: dishIDs } });

  res.status(200).render("menu", {
    title: "My Bookings",
    dishes,
  });
});

exports.getCart = catchAsync(async (req, res, next) => {
  const cartItems = await Cart.find({ user: req.user.id });
  console.log(cartItems);
  res.status(200).render("cart", { title: "Cart", cartItems });
});

exports.getNewDishForm = catchAsync(async (req, res) => {
  const chefs = await User.find({ role: "chef" });
  const locations = await Location.find();
  res.status(200).render("addNewDish", {
    title: "Add new dish",
    chefs,
    locations,
  });
});

exports.getAllDishesTable = catchAsync(async (req, res) => {
  const dishes = await Dish.find();
  res.status(200).render("getAllDishes", { title: "All Dishes", dishes });
});
exports.getUpdateDishForm = catchAsync(async (req, res) => {
  const dish = await Dish.findById(req.params.id);
  res.status(200).render("updateDish", { title: "Update", dish });
});

exports.getDashboard = catchAsync(async (req, res) => {
  res.status(200).render("dashboard", { title: "Management Dashboard" });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).render("account", { user: updatedUser });
});

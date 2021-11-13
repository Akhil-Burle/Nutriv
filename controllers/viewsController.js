const Dish = require("../models/dishModel.js");
const User = require("../models/userModel.js");
const Booking = require("../models/bookingModel.js");
const catchAsync = require("../utils/catchAsync.js");
const AppError = require("../utils/appError.js");

exports.index = (req, res, next) => {
  res.status(200).render("index", { title: "Never Cook Again!" });
};

exports.getOverview = catchAsync(async (req, res, next) => {
  // Get all dishes from collection:
  const dishes = await Dish.find();

  // Build the template for the overview:

  // Render template:
  res.status(200).render("menu", {
    title: "All Dishes",
    dishes,
  });
});

exports.getDish = catchAsync(async (req, res, next) => {
  const dish = await Dish.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review rating user",
  });

  if (!dish) {
    return next(new AppError("There is no dish with that name!", 404));
  }
  res.status(200).render("dish", {
    title: `${dish.name}`,
    dish,
  });
});

exports.getEmailVerifyPage = (req, res) => {
  res.status(200).render("emailVerify", { title: "Verify your email" });
};

exports.getLoginForm = (req, res) => {
  res.status(200).render("login", { title: "Login" });
};

exports.getSignupForm = (req, res) => {
  res.status(200).render("signup", { title: "Create a new account" });
};

exports.getAccount = (req, res) => {
  res.status(200).render("account");
};

exports.getDocs = (req, res) => {
  res.status(200).render("docs");
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

exports.getNewDishForm = catchAsync(async (req, res) => {
  const chefs = await User.find({ role: "chef" });
  res.status(200).render("addNewDish", {
    title: "Add new dish",
    chefs,
  });
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

const Dish = require("../models/dishModel.js");
const User = require("../models/userModel.js");
const catchAsync = require("../utils/catchAsync.js");
const AppError = require("../utils/appError.js");

exports.index = (req, res, next) => {
  res.status(200).render("base");
};

exports.getOverview = catchAsync(async (req, res, next) => {
  // Get all dishes from collection:
  const dishes = await Dish.find();

  // Build the template for the overview:

  // Render template:
  res.status(200).render("menu", {
    title: "All Items",
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
    title: "Pizza",
    dish,
  });
});

exports.getEmailVerifyPage = (req, res) => {
  res.status(200).render("emailVerify");
};

exports.getLoginForm = (req, res) => {
  res.status(200).render("login");
};

exports.getSignupForm = (req, res) => {
  res.status(200).render("signup");
};

exports.getAccount = (req, res) => {
  res.status(200).render("account");
};

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

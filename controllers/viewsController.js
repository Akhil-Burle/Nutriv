const Dish = require("../models/dishModel.js");
const catchAsync = require("../utils/catchAsync.js");

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
  res.status(200).render("dish", {
    title: "Pizza",
    dish,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render("login");
};

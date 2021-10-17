const Dish = require("../models/dishModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync.js");
const AppError = require("../utils/appError");

exports.aliasTopDishes = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

exports.getAllDishes = catchAsync(async (req, res, next) => {
  // EXECUTE QUERY
  const features = new APIFeatures(Dish.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const dishes = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: dishes.length,
    data: {
      dishes,
    },
  });
});

exports.getDish = catchAsync(async (req, res, next) => {
  const dish = await Dish.findById(req.params.id);
  // Dish.findOne({ _id: req.params.id })

  if (!dish) {
    return next(new AppError("No tour found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      dish,
    },
  });
});

exports.createDish = catchAsync(async (req, res, next) => {
  const newDish = await Dish.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      dish: newDish,
    },
  });
});

exports.updateDish = catchAsync(async (req, res, next) => {
  const dish = await Dish.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!dish) {
    return next(new AppError("No tour found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      dish,
    },
  });
});

exports.deleteDish = catchAsync(async (req, res, next) => {
  const dish = await Dish.findByIdAndDelete(req.params.id);

  if (!dish) {
    return next(new AppError("No tour found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getDishStats = catchAsync(async (req, res, next) => {
  const stats = await Dish.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        numDishes: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: { _id: { $ne: 'EASY' } }
    // }
  ]);

  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1; // 2021

  const plan = await Dish.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numDishStarts: { $sum: 1 },
        dishes: { $push: "$name" },
      },
    },
    {
      $addFields: { month: "$_id" },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numDishStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      plan,
    },
  });
});

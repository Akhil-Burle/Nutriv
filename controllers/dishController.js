const Dish = require("../models/dishModel");
const multer = require("multer");
const sharp = require("sharp");
const catchAsync = require("../utils/catchAsync.js");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory.js");

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/img/dishes");
//   },
// });
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadDishPhoto = upload.single("imageCover");

exports.resizeDishPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `dish-${Date.now()}.png`;

  await sharp(req.file.buffer)
    .resize(360, 240)
    .toFormat("png")
    .png({ quality: 90 })
    .toFile(`public/img/dishes/${req.file.filename}`);

  next();
});

exports.aliasTopDishes = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

exports.getAllDishes = factory.getAll(Dish);

exports.getDish = factory.getOne(Dish, { path: "reviews" });

exports.createDish = factory.createOne(Dish);

exports.updateDish = factory.updateOne(Dish);

exports.deleteDish = factory.deleteOne(Dish);

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

/* 

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
  const dish = await Dish.findById(req.params.id).populate("reviews");
  // Dish.findOne({ _id: req.params.id })

  if (!dish) {
    return next(new AppError("No dish found with that ID", 404));
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

exports.deleteDish = catchAsync(async (req, res, next) => {
  const dish = await Dish.findByIdAndDelete(req.params.id);

  if (!dish) {
    return next(new AppError("No dish found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.updateDish = catchAsync(async (req, res, next) => {
  const dish = await Dish.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!dish) {
    return next(new AppError("No dish found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      dish,
    },
  });
});



*/

exports.getHotelsWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");

  const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        "Please provide latitude and longitude in the format lat,lng.",
        400
      )
    );
  }

  const dishes = await Dish.find({
    availableIn: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: "success",
    results: dishes.length,
    data: {
      data: dishes,
    },
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");

  const multiplier = unit === "mi" ? 0.00062137 : 0.001;

  if (!lat || !lng) {
    next(
      new AppError(
        "Please provide latitude and longitude in the format lat,lng.",
        400
      )
    );
  }

  const distances = await Dish.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: "distance",
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      data: distances,
    },
  });
});

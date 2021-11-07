const Review = require("./../models/reviewModel.js");
// const catchAsync = require("./../utils/catchAsync.js");
const factory = require("./handlerFactory.js");

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.dish) req.body.dish = req.params.dishId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.deleteReview = factory.deleteOne(Review);

exports.updateReview = factory.updateOne(Review);

exports.createReview = factory.createOne(Review);

exports.getReview = factory.getOne(Review);

exports.getAllReviews = factory.getAll(Review);



/*
exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.dishId) filter = { dish: req.params.dishId };
  const reviews = await Review.find(filter);

  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const newReview = await Review.create(req.body);

  res.status("201").json({
    status: "success",
    data: {
      newReview,
    },
  });
});
*/

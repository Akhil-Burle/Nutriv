const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review can not be empty!"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    dish: {
      type: mongoose.Schema.ObjectId,
      ref: "Dish",
      required: [true, "Review must belong to a dish!"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must have a user!"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  /*  this.populate({
    path: "dish",
    select: "name",
  }).populate({
    path: "user",
    select: "name photo",
  }); */

  //   To not populate the dishes but only just show the id of the dish and show the user data ..

  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;

// POST /dish/food/reviews
// GET /dish/food/reviews
// GET /dish/food/reviews

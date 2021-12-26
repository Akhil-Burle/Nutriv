const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  dish: {
    type: mongoose.Schema.ObjectId,
    ref: "Dish",
    required: [true, "Booking must belong to a Dish!"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Booking must belong to a User!"],
  },
  addedAt: {
    type: Date,
    default: Date.now(),
  },
});

cartSchema.pre(/^find/, function (next) {
  this.populate("dish");
  next();
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;

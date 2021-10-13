const mongoose = require("mongoose");

const dishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A dish must have a name"],
    unique: true,
  },
  deliveryTime: {
    type: Number,
    required: [true, "A Dish must have a delivery duration!"],
  },
  ratingsAverage: { type: Number },
  ratingsQuantity: { type: Number, default: 0 },
  price: { type: Number, required: [true, "A dish must have a price"] },
  rarity: { type: String, required: [true, "A dish must have Availability.."] },
  priceDiscount: Number,
  foodType: [String],
  summary: {
    type: String,
    trim: true, //Removes white spaces on the begining and the end
    required: [true, "A dish must have a small description!"],
  },
  description: { type: String, trim: true },
  imageCover: {
    type: String,
    required: [true, "A dish must have a image..."],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});
const Dish = mongoose.model("Dish", dishSchema);

module.exports = Dish;

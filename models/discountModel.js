const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema({
  percentDiscount: {
    type: Number,
    required: [true, "Discount must have a percent!"],
  },
  validFrom: {
    type: Date,
    required: [true, "Discount must have validity"],
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresOn: {
    type: Date,
    required: [true, "A Discount must expire"],
    default: Date.now,
  },
  isValid: {
    type: Boolean,
    default: true,
  },
});

discountSchema.pre(/^find/, function (next) {
  this.find({ isValid: { $ne: false } });
  next();
});

const Discount = mongoose.model("Discount", discountSchema);

module.exports = Discount;

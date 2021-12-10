const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, "Coupon must have a code"],
  },
  isValid: {
    type: Boolean,
    default: true,
  },
});
const Coupons = mongoose.model("Coupons", couponSchema);

module.exports = Coupons;

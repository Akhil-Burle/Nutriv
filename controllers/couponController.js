const Coupons = require("./../models/couponModel.js");
const factory = require("./handlerFactory");

exports.getAllCoupons = factory.getAll(Coupons);
exports.addNewCoupon = factory.createOne(Coupons);

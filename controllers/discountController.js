const Discount = require("./../models/discountModel.js");
const factory = require("./handlerFactory");

exports.getAllDiscounts = factory.getAll(Discount);
exports.addNewDiscount = factory.createOne(Discount);

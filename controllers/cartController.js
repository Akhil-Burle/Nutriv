const Cart = require("./../models/cartModel.js");
const factory = require("./handlerFactory");

exports.getAllCartItems = factory.getAll(Cart);
exports.addNewCartItem = factory.createOne(Cart);
exports.updateCartItem = factory.updateOne(Cart);
exports.getCartItem = factory.getOne(Cart);
exports.deleteCartItem = factory.deleteOne(Cart);

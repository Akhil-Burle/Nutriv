const Locations = require("./../models/locationModel.js");
const factory = require("./handlerFactory");

exports.getAllLocations = factory.getAll(Locations);
exports.addNewLocation = factory.createOne(Locations);

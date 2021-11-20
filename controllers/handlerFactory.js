const catchAsync = require("./../utils/catchAsync.js");
const AppError = require("./../utils/appError.js");
const APIFeatures = require("../utils/apiFeatures");

/**
 *
 * @param {*} Model
 * @returns Errors
 * @description Delete One document in different places.
 */
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

/**
 *
 * @param {*} Model
 * @returns Errors
 * @description Update one document used in controllers.
 */
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

/**
 *
 * @param {*} Model
 * @returns Errors
 * @description Create a new document used in controllers.
 */

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    console.log(req.body);
    console.log(req.file);

    const doc = req.body;
    if (req.file) doc.imageCover = req.file.filename;
    // const doc = await Model.create(req.body);

    await Model.create(doc);

    res.status(201).json({
      status: "success",
      data: {
        dish: doc,
      },
    });
  });

/**
 *
 * @param {*} Model
 * @param {Object} popOptions
 * @returns Errors
 * @description Get a single document on the basis of the Model.
 */
exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

/**
 *
 * @param {*} Model
 * @returns Errors
 * @description Get all the documents in a particular collection.
 */

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on dish.
    let filter = {};
    if (req.params.dishId) filter = { dish: req.params.dishId };

    // EXECUTE QUERY
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // const doc = await features.query.explain();
    const doc = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });

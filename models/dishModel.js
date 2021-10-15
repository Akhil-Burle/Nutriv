const mongoose = require("mongoose");
const slugify = require("slugify");

const dishSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A dish must have a name"],
      unique: true,
    },
    slug: String,
    deliveryTime: {
      type: Number,
      required: [true, "A Dish must have a delivery duration!"],
    },
    ratingsAverage: { type: Number },
    ratingsQuantity: { type: Number, default: 0 },
    price: { type: Number, required: [true, "A dish must have a price"] },
    rarity: {
      type: String,
      required: [true, "A dish must have Availability.."],
    },
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
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

dishSchema.virtual("deliveryTimeHours").get(function () {
  return this.deliveryTime / 60;
});

// Document Middleware and runs before the save command and the .create command when used .insertMany() it wil lnot toggle only on .create and save it gets executed
dishSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

/* dishSchema.pre("save", function (next) {
  console.log("Will save document");
  next();
});

// Executed only after pre middlewares
dishSchema.post("save", function (doc, next) {
  console.log(doc);
  next();
}); */

// Query Middleware:
dishSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

// dishSchema.post(/^find/, function (docs, next) {
//   console.log(`Query took ${date.now() - this.start} milliseconds!`);
//   console.log(docs);
//   next();
// });

// Aggregation Middleware:
dishSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretDish: { $ne: true } } });

  console.log(this.pipeline());
  next();
});

const Dish = mongoose.model("Dish", dishSchema);

module.exports = Dish;

// Document, aggregate, query, model middle ware are there in mongoose

const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");

const dishSchema = new mongoose.Schema(
  {
    /*
    ----------------------------------------------------------------------------------------------------------
    Name
    ----------------------------------------------------------------------------------------------------------
    */

    name: {
      type: String,
      required: [true, "A dish must have a name"],
      unique: true,
      trim: true,
      maxlength: [
        40,
        "A dish must have name less or eequal than 40 characters",
      ],
      /* validate: [
        validator.isAlpha,
        "The name of the dish should be in ENGLISH only!",
      ], */
    },
    slug: String,

    /*
    ----------------------------------------------------------------------------------------------------------
    Delivery Time
    ----------------------------------------------------------------------------------------------------------
    */
    deliveryTime: {
      type: Number,
      required: [true, "A Dish must have a delivery duration!"],
    },

    /*
    ----------------------------------------------------------------------------------------------------------
    Ratings
    ----------------------------------------------------------------------------------------------------------
    */
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Ratings must be lesser than 5.0"],
    },

    /*
    ----------------------------------------------------------------------------------------------------------
    Number of Ratings
    ----------------------------------------------------------------------------------------------------------
    */
    ratingsQuantity: { type: Number, default: 0 },

    /*
    ----------------------------------------------------------------------------------------------------------
    Price
    ----------------------------------------------------------------------------------------------------------
    */
    price: { type: Number, required: [true, "A dish must have a price"] },

    /*
    ----------------------------------------------------------------------------------------------------------
    Rarity like Available or no.
    ----------------------------------------------------------------------------------------------------------
    */
    rarity: {
      type: String,
      required: [true, "A dish must have Availability.."],
    },

    /*
    ----------------------------------------------------------------------------------------------------------
    Discount price for dish
    ----------------------------------------------------------------------------------------------------------
    */

    priceDiscount: {
      type: Number,

      // Custom validater val is the value inputed the return return false or true.
      validate: {
        message: "Disount price ({VALUE}) should be below the regular price!",
        validator: function (val) {
          // this only points to the current doc on NEW docment creation
          return val < this.price;
        },
      },
    },
    priceAfterDiscount: this.price - this.priceDiscount,

    /*
    ----------------------------------------------------------------------------------------------------------
    Food Type like Vegan, Paleo, veg, non veg
    ----------------------------------------------------------------------------------------------------------
    */
    foodType: {
      type: String,
      required: [true, "A dish must have a difficulty"],
      enum: {
        values: ["Vegan", "Paleo", "Vegetarian", "Non Vegetarian"],
        message:
          "Difficulty is either: Vegan, Paleo, Vegetarian and Non Vegetarian",
      },
    },

    /*
    ----------------------------------------------------------------------------------------------------------
    Summary of the dish
    ----------------------------------------------------------------------------------------------------------
    */
    summary: {
      type: String,
      trim: true, //Removes white spaces on the begining and the end
      required: [true, "A dish must have a small description!"],
    },

    /*
    ----------------------------------------------------------------------------------------------------------
    Description of the dish
    ----------------------------------------------------------------------------------------------------------
    */
    description: { type: String, trim: true },

    /*
    ----------------------------------------------------------------------------------------------------------
    Cover image of a dish
    ----------------------------------------------------------------------------------------------------------
    */
    imageCover: {
      type: String,
      required: [true, "A dish must have a image..."],
    },

    /*
    ----------------------------------------------------------------------------------------------------------
    Some images of the dish
    ----------------------------------------------------------------------------------------------------------
    */
    images: [String],

    /*
    ----------------------------------------------------------------------------------------------------------
    Time of creation **not entered by user**
    ----------------------------------------------------------------------------------------------------------
    */
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    secretDish: {
      type: Boolean,
      default: false,
    },
    valid: {
      type: Boolean,
      default: true,
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

// Document Middleware and runs before the .save() command and the .create() command when used .insertMany() it will not toggle only on .create and save it gets executed
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
  this.find({ secretDish: { $ne: true } });

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

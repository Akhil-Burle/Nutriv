const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");
// const User = require("./userModel.js");

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
    availability: {
      type: String,
      required: [true, "A dish must have Availability.."],
      enum: {
        values: ["Not-Available", "Available"],
        message: "Availability must be Available or Not-Available!",
      },
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

    /*
    ----------------------------------------------------------------------------------------------------------
    Food Type like Vegan, Paleo, veg, non veg
    ----------------------------------------------------------------------------------------------------------
    */
    foodType: {
      type: String,
      required: [true, "A dish must have a type"],
      enum: {
        values: ["Vegan", "Paleo", "Vegetarian", "NON-Vegetarian"],
        message:
          "Food Type is either: Vegan, Paleo, Vegetarian and Non-Vegetarian",
      },
    },

    type: {
      type: String,
      required: [true, "A dish must have a type"],
      enum: {
        values: [
          "Starter",
          "Tapas",
          "Salad",
          "Soup",
          "Burger & Sandwich",
          "Main Dish",
          "Dessert",
          "Sides",
        ],
        message:
          "Type is either: Tapas, Salad, Soup, Burger & Sandwich, Main Dish, Dessert",
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
    Cover image of a dish
    ----------------------------------------------------------------------------------------------------------
    */
    imageCover: {
      type: String,
    },

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
    availableIn: [
      {
        // GeoJson
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
      },
    ],
    chefs: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    currentprice: {
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// dishSchema.index({ price: 1 });
dishSchema.index({ price: 1, ratingsAverage: -1 });
dishSchema.index({ slug: 1 });
dishSchema.index({ availableIn: "2dsphere" });

dishSchema.virtual("deliveryTimeHours").get(function () {
  return this.deliveryTime / 60;
});

dishSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "dish",
  localField: "_id",
});

// Document Middleware and runs before the .save() command and the .create() command when used .insertMany() it will not toggle only on .create and save it gets executed
dishSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

/* 
For Embedding
dishSchema.pre("save", async function (next) {
  const chefsPromises = this.chefs.map(async (id) => await User.findById(id));
  this.chefs = await Promise.all(chefsPromises);
  next();
}); */

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

dishSchema.pre(/^find/, function (next) {
  this.populate({
    path: "chefs",
    select: "-__v -passwordChangedAt",
  });
  next();
});

// Aggregation Middleware:
/* dishSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretDish: { $ne: true } } });

  console.log(this.pipeline());
  next();
}); */

const Dish = mongoose.model("Dish", dishSchema);

module.exports = Dish;

// Document, aggregate, query, model middle ware are there in mongoose

/* const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const Dish = require("./../../models/dishModel");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

// Run using: node ./dev-data/data/import-dev-data.js --import / --delete

mongoose.connect(DB).then(() => console.log("DB connection successful!"));

// READ JSON FILE
const dishes = JSON.parse(
  fs.readFileSync(`${__dirname}/dishes-simple.json`, "utf-8")
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Dish.create(dishes);
    console.log("Data Successfully loaded");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Dish.deleteMany();
    console.log("Data Successfully deleted");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
 */

const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Dish = require("./../../models/dishModel.js");
const Review = require("./../../models/reviewModel.js");
const User = require("./../../models/userModel.js");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => console.log("DB connection successful!"));

// READ JSON FILE
const dishes = JSON.parse(
  fs.readFileSync(`${__dirname}/dishes-simple.json`, "utf-8")
);
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, "utf-8")
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Dish.create(dishes);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log("Data successfully loaded!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Dish.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("Data successfully deleted!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}

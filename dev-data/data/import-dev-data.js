const mongoose = require("mongoose");
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

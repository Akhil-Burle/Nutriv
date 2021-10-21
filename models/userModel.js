const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  /*
----------------------------------------------------------------------------------------------------------
Name of the user
----------------------------------------------------------------------------------------------------------
*/
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },

  /*
----------------------------------------------------------------------------------------------------------
Email of the user
----------------------------------------------------------------------------------------------------------
*/
  email: {
    type: String,
    required: [true, "An account should have an email address"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email!"],
  },

  /*
----------------------------------------------------------------------------------------------------------
Phone-Number of the user
----------------------------------------------------------------------------------------------------------
*/
  phone: {
    type: String,
    // validate: [
    //   validator.isMobilePhoneLocales,
    //   ['en-IN'],
    //   "Please provite a valid phone number",
    // ],
  },

  /*
----------------------------------------------------------------------------------------------------------
Photo
----------------------------------------------------------------------------------------------------------
*/
  photo: {
    type: String,
  },

  /*
----------------------------------------------------------------------------------------------------------
Password
----------------------------------------------------------------------------------------------------------
*/
  password: {
    type: String,
    required: [true, "An account should have a password"],
    minlength: 8,
    select: false,
  },

  /*
----------------------------------------------------------------------------------------------------------
Password Confirmation
----------------------------------------------------------------------------------------------------------
*/
  passwordConfirm: {
    type: String,
    required: [true, "You should confim your password before you continue"],
    minlength: 8,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
    },
    message: "The passwords aren't same try again!",
  },
  passwordChangedAt: { type: Date },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  // this.email = await bcrypt.hash(this.email, 8);
  // this.email = await bcrypt.hash(this.email, 8);
  // this.phone = await bcrypt.hash(this.phone, 8);

  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctDetails = async function (
  candidateDetails,
  userDetails
) {
  return await bcrypt.compare(candidateDetails, userDetails);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;

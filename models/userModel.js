const crypto = require("crypto");
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
Photo
----------------------------------------------------------------------------------------------------------
*/
  photo: {
    type: String,
  },

  /*
----------------------------------------------------------------------------------------------------------
Roles of a user
----------------------------------------------------------------------------------------------------------
*/
  role: {
    type: String,
    enum: ["user", "admin", "manager", "chef"],
    default: "user",
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
  passwordResetToken: String,
  emailVerifyToken: String,
  passwordResetExpires: Date,
  emailVerifyExpires: Date,

  /*
----------------------------------------------------------------------------------------------------------
Delete user or active
----------------------------------------------------------------------------------------------------------
*/
  active: {
    type: Boolean,
    default: true,
    select: false,
  },

  /*
----------------------------------------------------------------------------------------------------------
User verification
----------------------------------------------------------------------------------------------------------
*/
  isVerified: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctDetails = async function (
  candidateDetails,
  userDetails
) {
  return await bcrypt.compare(candidateDetails, userDetails);
};

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) {
    return next();
  }

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

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

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.createEmailVerificationToken = function () {
  const verifyToken = crypto.randomBytes(32).toString("hex");

  this.emailVerifyToken = crypto
    .createHash("sha256")
    .update(verifyToken)
    .digest("hex");

  this.emailVerifyExpires = Date.now() + 10 * 60 * 1000;

  return verifyToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;

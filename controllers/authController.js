const jwt = require("jsonwebtoken");
const User = require("./../models/userModel.js");
const catchAsync = require("./../utils/catchAsync.js");
const AppError = require("./../utils/appError.js");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    phone: req.body.phone,
  });

  // const newUser = await User.create(req.body);

  const token = signToken(newUser._id);
  console.log(token);

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  // 1: Check if email and password actually exists
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  /*   console.log(email);
  console.log(password); */

  // 2: Check if the user exists

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctDetails(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 3: If everything is ok, send the json web token
  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1: Getting token and check if it exists:
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  console.log(token);

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access..", 401)
    );
  }

  // 2: Verification of the token:

  // 3: Check if the user still exists:

  // 4: Check if user changed the password after token was issued

  next();
});

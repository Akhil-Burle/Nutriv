const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel.js");
const catchAsync = require("./../utils/catchAsync.js");
const AppError = require("./../utils/appError.js");
const Email = require("./../utils/email.js");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    phone: req.body.phone,
    photo: req.body.photo,
  });

  // const newUser = await User.create(req.body);

  const verifyToken = newUser.createEmailVerificationToken();
  await newUser.save({ validateBeforeSave: false });

  const signUpEmailVerify = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/verifyEmail/${verifyToken}`;

  // const message = `Verify your email before getting started!  ${signUpEmailVerify}.`;

  try {
    const url = signUpEmailVerify;
    await new Email(newUser, url).sendWelcome();
  } catch (err) {
    (newUser.emailVerifyToken = undefined),
      (newUser.emailVerifyExpires = undefined);
    await newUser.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There was an error sending the email, Try again later!",
        500
      )
    );
  }
  // createSendToken(newUser, 201, res);

  res.status(201).json({
    status: "success",
  });
});

/**
 * Verify email entry and sending token to email
 */
exports.verify = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  // 1: Check if email and password actually exists
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctDetails(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  if (user.isVerified === true) {
    return next(new AppError("Your account is already verified", 400));
  }

  const verifyToken = user.createEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  const verifyURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/verifyEmail/${verifyToken}`;

  try {
    const url = verifyURL;
    await new Email(user, url).emailVerify();
  } catch (err) {
    (user.emailVerifyToken = undefined), (user.emailVerifyExpires = undefined);
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There was an error sending the email, Try again later!",
        500
      )
    );
  }

  res.status(200).json({
    status: "success",
  });
});

exports.verifyEmail = catchAsync(async (req, res, next) => {
  const hashedEmailToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    emailVerifyToken: hashedEmailToken,
    emailVerifyExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token is invalid or has expired try again!"));
  }
  user.emailVerifyToken = undefined;
  user.isVerified = true;
  user.emailVerifyExpires = undefined;

  await user.save({ validateBeforeSave: false });

  res.redirect("/verifySuccessfull");

  createSendToken(user, 200, req, res);
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

  if (user.isVerified === false) {
    return next(
      new AppError("Please verify your account before getting started!")
    );
  }

  if (!user || !(await user.correctDetails(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 3: If everything is ok, send the json web token
  createSendToken(user, 200, req, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1: Getting token and check if it exists:
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access..", 401)
    );
  }

  // 2: Verification of the token:
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3: Check if the user still exists:
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token does no longer exist", 401)
    );
  }

  // 4: Check if the user is verified:
  /*   if (currentUser.isVerified === false) {
    return next(
      new AppError(
        "The user is not verified please Verify your self to continue",
        401
      )
    );
  } */

  // 5: Check if user changed the password after token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }

  // Grant access to the protected route
  req.user = currentUser;
  res.locals.user = currentUser;

  next();
});

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() * 10 + 1000),
  });
  res.status(200).json({ status: "success" });
};

// Only for rendered pages, no errors.
exports.isLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      // 2: Verification of the token:
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 3: Check if the user still exists:
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 5: Check if user changed the password after token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // There is a logged in user.
      res.locals.user = currentUser;

      return next();
    }
    next();
  } catch (err) {
    return next();
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // Get user based on posted email:
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new AppError(
        "There is no email with that email address please try again.",
        404
      )
    );
  }

  // Generate the random token:
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // Send it back like an email:
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Fogot your password? Submit a PATCH request with your new password and confirm your password to ${resetURL}.\nIf you din't forget your password, please ignore this email!`;

  try {
    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: "success",
      message: "Token sent to email",
    });
  } catch (err) {
    (user.passwordResetToken = undefined),
      (user.passwordResetExpires = undefined);
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There was an error sending the email, Try again later!",
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1: Get user based on the token:
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // 2: IF token has not expired, and there is user, set the new password:
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3: Update changedPasswordAt property for the user:
  // Middle ware in UserModel..

  // 4: Log the user in, send JWT:

  createSendToken(user, 200, req, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select("+password");

  // 2) Check if POSTed current password is correct
  if (!(await user.correctDetails(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is wrong.", 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!
  // user.findbyidand update will not work because all the middlewares will not work! and the password doesn't really exist to check it!

  // 4) Log user in, send JWT
  createSendToken(user, 200, req, res);
});

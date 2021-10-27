const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const appError = require("./utils/appError.js");
const globalErrorHandler = require("./controllers/errorController.js");
const dishRouter = require("./routes/dishRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

// 1) GLOBAL MIDDLEWARES

// Security HTTP headers
app.use(helmet());

// Development loggin
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limiting fileds
const limiter = rateLimit({
  max: 250,
  windowMs: 60 * 60 * 1000,
  message: "You've made too many request, please try again in an hour",
});
app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));

// Data sanitization against NoSQL query injection:
app.use(mongoSanitize());

// Data sanitization against XSS:
app.use(xss());

// Prevent parameter pollution:
app.use(
  hpp({
    whitelist: [
      "deliveryTime",
      "ratingsAverage",
      "ratingsQuantity",
      "price",
      "foodType",
    ],
  })
);

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// 3) ROUTES
app.use("/api/v1/menu", dishRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  /*  res.status(404).json({
    status: "fail",
    message: `Cant find ${req.originalUrl} on this server!`,
  }); */

  next(new appError(`Cant find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

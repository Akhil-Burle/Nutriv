const express = require("express");
const morgan = require("morgan");

const appError = require("./utils/appError.js");
const globalErrorHandler = require("./controllers/errorController.js");
const dishRouter = require("./routes/dishRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
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

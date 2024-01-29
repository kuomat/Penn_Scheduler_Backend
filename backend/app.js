const express = require("express");
const morgan = require("morgan");
const courseRouter = require("./routes/courseRoutes");
const majorRouter = require("./routes/majorRoutes");
const userRouter = require("./routes/userRoutes");
const HTTP_STATUS = require("./utils/httpStatus");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");

const app = express();

// Defend against common attacks
app.use(helmet());
app.use(mongoSanitize());

app.use(cors()); // Enable frontend API calls
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/majors", majorRouter);
app.use("/api/v1/users", userRouter);

// Requests that don't follow the above formats
app.all("*", (req, res, next) => {
  return next(
    new AppError(`Can't find ${req.originalUrl}`, HTTP_STATUS.NOT_FOUND)
  );
});

app.use(globalErrorHandler);
module.exports = app;

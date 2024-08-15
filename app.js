const express = require("express");
const app = express();
const userRouter = require("./Routes/userRouter");
const viewRouter = require("./Routes/viewRouter");
const taskRouter = require("./Routes/taskRouter");
const globalErrorHandler = require("./Controllers/errorController");
const AppError = require("./utils/AppError");
const path = require("path");
const cookieParser = require("cookie-parser");

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "Views"));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// app.use((req, res, next) => {
//   console.log(req.cookies);
//   next();
// });

app.use("/users", userRouter);
app.use("/", viewRouter);
app.use("/tasks", taskRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`can not find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

const sendErrDev = (err, req, res, next) => {
  if (req.originalUrl.startsWith("/api")) {
    // API
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  } else {
    // Redred website
    console.log(err);
    res.status(err.statusCode).render("error", {
      msg: err.message,
      statusCode: err.statusCode,
    });
  }
};
const sendErrProd = (err, req, res, next) => {
  if (req.originalUrl.startsWith("/api")) {
    // API
    res.status(err.statusCode).json({
      status: err.status,
      message: "something went wrong",
    });
  } else {
    // Redred website
    res.status(err.statusCode).render("error", {
      msg: "something went wrong",
      statusCode: err.statusCode,
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") sendErrDev(err, req, res, next);

  if (process.env.NODE_ENV === "production") sendErrProd(err, req, res, next);
};

const User = require("../Models/UserModel");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { promisify } = require("util");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const signWithToken = (statusCode, user, res) => {
  const token = signToken(user.id);
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;
  res.status(statusCode).json({
    status: "succes",
    token,
    data: user,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;
  const newUser = await User.create({ name, email, password, passwordConfirm });
  signWithToken(201, newUser, res);
});

exports.login = catchAsync(async (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return next(new AppError("email or password is missing", 400));
  }
  const user = await User.findOne({ email: req.body.email }).select(
    "+password"
  );

  if (!user || !(await user.checkPassword(req.body.password, user.password))) {
    return next(new AppError("email or password is invalid", 400));
  }

  signWithToken(200, user, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1 check if the token exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  } else {
    return next(new AppError("Not authorized, your token is invalid", 401));
  }
  // 2 check if the token is valid
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3 check if the user still exits
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError("this user is no longer exists", 404));
  }
  // 4 check if the user changed his password
  if (user.isPasswordChangedAfter(decoded.iat)) {
    return next(
      new AppError("the password has been changed please login again", 400)
    );
  }
  req.user = user;
  next();
});

exports.isLoggedIn = catchAsync(async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      const token = req.cookies.jwt;
      const decoded = await promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET
      );
      const user = await User.findById(decoded.id);
      if (!user) {
        return next();
      }
      if (user.isPasswordChangedAfter(decoded.iat)) {
        return next();
      }
      res.locals.user = user;
      return next();
    }
  } catch (err) {
    return next();
  }
  next();
});

exports.logout = (req, res) => {
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 10000),
  };

  res.cookie("jwt", "logged out", cookieOptions);
  res.status(200).json({ status: "success" });
};

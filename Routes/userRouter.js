const express = require("express");
const router = express.Router();
const path = require("path");
const authController = require("../Controllers/authController");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

router.route("/").get(
  /*authController.protect,*/ (req, res) => {
    const homePath = path.join(__dirname, "..", "Views/home.html");
    // const cookieOptions = {
    //   httpOnly: true,
    //   expires: new Date(
    //     Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    //   ),
    // };
    // if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

    res.sendFile(homePath);
  }
);

module.exports = router;

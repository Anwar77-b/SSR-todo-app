const express = require("express");
const router = express.Router();
const authController = require("../Controllers/authController");
const taskController = require("../Controllers/taskController");

router.use(authController.isLoggedIn);

router.get(["/home", "/"], (req, res) => {
  res.render("home", {
    title: "Home",
  });
});
router.get("/signup", (req, res) => {
  res.render("signup", {
    title: "Signup",
  });
});
router.get("/login", (req, res) => {
  res.render("login", {
    title: "Login",
  });
});

module.exports = router;

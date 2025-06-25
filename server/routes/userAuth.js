const express = require("express");
const passport = require("passport");
const User = require("../models/user");
require("../passport-config");

const router = express.Router();

router.get("/signup", (req, res) => {
  res.render("users/signup");
});

router.post("/signup", async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const newUser = new User({ email, username, role: "customer" });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, err => {
      if (err) return next(err);
      req.flash("success", "Welcome!");
      res.redirect("/user/dashboard");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/user/signup");
  }
});

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post("/login", passport.authenticate("user-local", {
  failureRedirect: "/user/login",
  failureFlash: true
}), (req, res) => {
  req.flash("success", "Logged in!");
  res.redirect("/user/dashboard");
});

router.get("/logout", (req, res) => {
  req.logout(() => {
    req.flash("success", "Logged out.");
    res.redirect("/user/login");
  });
});

router.get("/auth/google", passport.authenticate("user-google", { scope: ["profile", "email"] }));

router.get("/auth/google/callback",
  passport.authenticate("user-google", {
    failureRedirect: "/user/login",
    failureFlash: true
  }),
  (req, res) => {
    req.flash("success", "Logged in with Google!");
    res.redirect("/user/dashboard");
  }
);

router.get("/dashboard", (req, res) => {
  if (!req.isAuthenticated() || req.user.role !== "customer") {
    req.flash("error", "You must be logged in as a user.");
    return res.redirect("/user/login");
  }
  res.render("users/dashboard", { user: req.user });
});





module.exports = router;

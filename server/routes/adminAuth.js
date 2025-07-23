const express = require("express");
const passport = require("passport");
const Admin = require("../models/admin");
const Order = require("../models/order");
const { isAdmin } = require("../middlewares");
require("../passport-config");
const router = express.Router();

//------------------------------AUTH-------------------------------------------------
//Login Page
router.get("/login", (req,res)=>{
  res.render("admin/login");
})

// Login POST
router.post("/login", passport.authenticate("admin-local", {
  failureRedirect: "/admin/login",
  failureFlash: true
}), (req, res) => {
  req.flash("success", "Logged in successfully!");
  res.redirect("/admin/dashboard");
});

//Signup
router.get("/signup",(req,res)=>{
  res.render("admin/signup.ejs");
})

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newAdmin = new Admin({ email, username, role: "admin" });
    const registeredAdmin = await Admin.register(newAdmin, password);
    req.login(registeredAdmin, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome Admin!");
      res.redirect("/admin/dashboard");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/admin/signup");
  }
});

// Logout
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "Logged out.");
    res.redirect("/admin/login");
  });
});

// Google login
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google callback
router.get("/admin/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/admin/login",
    failureFlash: true
  }),
  (req, res) => {
    req.flash("success", "Logged in with Google!");
    res.redirect("/admin/dashboard");
  }
);

const CarouselSlide = require('../models/carouselSlide');
//Dashboard
router.get("/dashboard",isAdmin,  async (req, res) => {
  const slides = await CarouselSlide.find({});
  res.render("admin/adminHome.ejs", { user: req.user, slides });
});


//Statistics

module.exports = router;
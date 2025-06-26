const express = require("express");
const passport = require("passport");
const Admin = require("../models/admin");
const { isAdmin } = require("../middlewares");
require("../passport-config");
const router = express.Router();

const app = express();

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


//------------------------------ROUTES-------------------------------------------------

const CarouselSlide = require('../models/carouselSlide');
//Dashboard
router.get("/dashboard",isAdmin,  async (req, res) => {
  const slides = await CarouselSlide.find({});
  res.render("admin/adminHome.ejs", { user: req.user, slides });
});


//Products
router.get("/products", isAdmin, async (req, res) => {
  try {
    const products = await Product.find({});
    res.render("productspage", { products });
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to fetch products.");
    res.redirect("/admin/dashboard");
  }
});


//Statistics
router.get("/stats", isAdmin, async (req, res) => {
  try {
    const [totalOrders, deliveredOrders, pendingOrders, cancelledOrders, recentOrders] = await Promise.all([
      Order.countDocuments({}),
      Order.countDocuments({ orderStatus: "Delivered" }),
      Order.countDocuments({ orderStatus: "Pending" }),
      Order.countDocuments({ orderStatus: "Cancelled" }),
      Order.find().sort({ placedAt: -1 }).limit(5)
    ]);

    res.render("stats", {
      totalOrders,
      deliveredOrders,
      pendingOrders,
      cancelledOrders,
      orders: recentOrders
    });
  } catch (err) {
    console.error(err);
    req.flash("error", "Unable to load dashboard stats.");
    res.redirect("/admin/dashboard");
  }
});


module.exports = router;
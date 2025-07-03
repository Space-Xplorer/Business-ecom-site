const express = require("express");
const passport = require("passport");
const User = require("../models/user");

require("../passport-config");

const router = express.Router();

// === Signup ===
router.post("/signup", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, role: "customer" });

    const registeredUser = await User.register(user, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);
      res.status(200).json({ message: "Signup successful", user: registeredUser });
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// === Login ===
router.post("/login", (req, res, next) => {
  passport.authenticate("user-local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    req.login(user, (err) => {
      if (err) return next(err);
      res.status(200).json({ message: "Login successful", user });
    });
  })(req, res, next);
});

// === Logout ===
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Error during logout" });
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logged out" });
  });
});

// === Google Auth ===
router.get("/auth/google", passport.authenticate("user-google", {
  scope: ["profile", "email"]
}));

router.get("/auth/google/callback",
  passport.authenticate("user-google", {
    failureRedirect: "http://localhost:5173/login",
  }),
  (req, res) => {
    console.log("✅ Google login successful:", req.user);
    res.redirect("http://localhost:5173/");
  }
);


// === Check Auth Status ===
router.get("/status", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({ isAuthenticated: true, user: req.user });
  } else {
    res.status(200).json({ isAuthenticated: false });
  }
});

// === Protected Dashboard ===
router.get("/dashboard", (req, res) => {
  if (!req.isAuthenticated() || req.user.role !== "customer") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  res.status(200).json({ user: req.user });
});

module.exports = router;

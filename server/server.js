require('dotenv').config()
const express=require("express");
const app=express();
const path= require("path");
const port=8080;
const mongoose = require("mongoose");

const methodOverride = require('method-override');
app.use(methodOverride('_method'))

const ejsMate = require("ejs-mate");
app.engine('ejs', ejsMate);

const ExpressError = require("./utils/ExpressError");

const Product = require('./models/product');
const generateProductCode = require('./utils/generateProductCode');

const {validateProduct, isAdmin}= require("./middlewares.js");

const MONGO_URL = process.env.ECOMM_URL;
main().then(()=>{
    console.log("SUccesful!");
}).catch((err)=>
    console.log(err)
);

async function main() {
    await mongoose.connect(MONGO_URL); 
    
}
app.set("view engine", "ejs" );
app.set("views",path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());


const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");

const Admin = require("./models/admin"); // your admin model
require("./passport-config"); // sets up Google and local strategy

app.use(session({
  secret: "notagoodsecret",
  resave: false,
  saveUninitialized: true
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Flash & user to locals
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});


app.listen(port, ()=>{
    console.log("listening!");
});


app.get("/", (req,res)=>{
   res.redirect("/admin/dashboard");
})

app.get("/newproduct",isAdmin, (req,res)=>{
    res.render("new.ejs");
})

app.post("/newproduct",isAdmin, validateProduct, async (req, res) => {
  try {
    let productData = req.body.product;

    // Parse comma-separated string fields into arrays
    productData.subcategories = productData.subcategories
      ? productData.subcategories.split(',').map(s => s.trim())
      : [];

    productData.sizesAvailable = productData.sizesAvailable
      ? productData.sizesAvailable.split(',').map(s => s.trim())
      : [];

    productData.colors = productData.colors
      ? productData.colors.split(',').map(c => c.trim())
      : [];

    productData.photos = productData.photos
      ? productData.photos.split(',').map(url => url.trim())
      : [];
    productData.productCode = generateProductCode(productData);

    const newProduct = new Product(productData);
    await newProduct.save();

    // req.flash("success", "New product created!");
    console.log(newProduct)
    res.send("product added")
  } catch (err) {
    console.error(err);
    // req.flash("error", "Failed to create product.");
    res.redirect("/newproduct");
  }
})


app.get("/admin/login", (req,res)=>{
  res.render("login.ejs");
})

// Login POST
app.post("/admin/login", passport.authenticate("local", {
  failureRedirect: "/admin/login",
  failureFlash: true
}), (req, res) => {
  req.flash("success", "Logged in successfully!");
  res.redirect("/admin/dashboard");
});


app.get("/admin/signup",(req,res)=>{
  res.render("signup.ejs");
})

app.post("/admin/signup", async (req, res) => {
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
app.get("/admin/logout", (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "Logged out.");
    res.redirect("/admin/login");
  });
});

// Google login
app.get("/admin/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google callback
app.get("/admin/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/admin/login",
    failureFlash: true
  }),
  (req, res) => {
    req.flash("success", "Logged in with Google!");
    res.redirect("/admin/dashboard");
  }
);

app.get("/admin/dashboard",isAdmin,  (req, res) => {
  res.render("adminHome", { user: req.user });
});


app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});


app.use((err,req,res,next)=>{
    const {status=500, message="Something Went Wrong!"}=err;
    res.render("error.ejs", {message});
    // res.status(status).send(message);
})

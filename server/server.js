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

const userRoutes = require("./routes/userAuth");
const adminRoutes = require("./routes/adminAuth.js")
const categoryRoutes = require('./routes/category');

const MONGO_URL = process.env.ECOMM_URL;
main().then(()=>{
    console.log("MongoDB connected successfully");
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
app.use(methodOverride('_method'));

const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");

const Admin = require("./models/admin"); // your admin model
require("./passport-config.js"); // sets up Google and local strategy

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
    console.log(`listening to ${port}`);
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


app.use('/', categoryRoutes);

app.use("/user", userRoutes);

app.use("/admin", adminRoutes)


app.get("/products/:id", isAdmin, async (req, res, next) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      req.flash("error", "Product not found");
      return res.redirect("/admin/products");
    }
    res.render("productdetails.ejs", { product });
  } catch (err) {
    next(err);
  }
});

app.get("/admin/products/:id/edit", isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      req.flash("error", "Product not found.");
      return res.redirect("/admin/products");
    }
    res.render("editProduct", { product });
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to fetch product.");
    res.redirect("/admin/products");
  }
}); 

app.use('/uploads', express.static('uploads'));

//Statistics
app.get("/admin/stats", isAdmin, async (req, res) => {
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


 //orders
  app.get("/admin/orders", async (req, res) => {
    const orders = await Order.find().lean();
    res.render("orders", { orders });
  });

  app.get("/admin/orders/:id", async (req, res) => {
    const order = await Order.findById(req.params.id).lean();
    if (!order) return res.status(404).send("Order not found");
    res.render("orderdetail", { order });
  });
  


app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});


app.use((err,req,res,next)=>{
    const {status=500, message="Something Went Wrong!"}=err;
    res.render("error.ejs", {message});
    // res.status(status).send(message);
})

require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const port = 8080;
const cors = require("cors");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const ejsMate = require("ejs-mate");
const MongoStore = require("connect-mongo");

const ExpressError = require("./utils/ExpressError");
const generateProductCode = require("./utils/generateProductCode");

// Passport config
require("./passport-config");

// Routes
const userRoutes = require("./routes/userAuth");
const adminRoutes = require("./routes/adminAuth");
const categoryRoutes = require("./routes/category");
const carouselRoutes = require("./routes/carousel");
const paymentRoutes = require("./routes/payment");
const orderRoutes= require("./routes/orders")
const productRoutes= require("./routes/adminProduct")
const productsApiRoutes = require("./routes/products");
const addressRoutes = require("./routes/address");

// Connect DB
const MONGO_URL = process.env.ECOMM_URL;
mongoose.connect(MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// CORS — placed early
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// Parsing & Method override
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// Static files
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads"));

// Sessions
app.use(session({
  name: "session",
  secret: "notagoodsecret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: MONGO_URL,
    collectionName: "sessions",
  }),
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Flash + current user setup
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

// ===== ROUTES =====

app.get("/", (req, res) => res.redirect("/admin/dashboard"));

// === All routers
app.use("/", categoryRoutes);
app.use("/admin", adminRoutes);
app.use(carouselRoutes);
app.use("/admin/products", productRoutes)

app.use("/user", userRoutes);         // <-- Your React frontend will hit these
app.use("/api/payment", paymentRoutes);
app.use("/api/orders", orderRoutes)
app.use("/api/addresses", addressRoutes);
app.use(productsApiRoutes);



// === Error Handling
app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Something Went Wrong!" } = err;
  res.status(status).render("error.ejs", { message });
});

// === Start Server
app.listen(port, () => {
  console.log(`Connected to ${port}`);
});

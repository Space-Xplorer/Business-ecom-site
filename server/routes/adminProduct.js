const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const { isAdmin, validateProduct } = require("../middlewares");

router.get("/", isAdmin, async (req, res) => {
  try {
    const products = await Product.find({});
    res.render("products/all", { products });
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to fetch products.");
    res.redirect("/admin/dashboard");
  }
});


router.get("/newproduct", isAdmin, (req, res) => {
  res.render("products/directnew.ejs");
});

router.post("/newproduct", isAdmin, validateProduct, async (req, res) => {
  try {
    let productData = req.body.product;

    productData.subcategories = productData.subcategories?.split(',').map(s => s.trim()) || [];
    productData.sizesAvailable = productData.sizesAvailable?.split(',').map(s => s.trim()) || [];
    productData.colors = productData.colors?.split(',').map(c => c.trim()) || [];
    productData.photos = productData.photos?.split(',').map(url => url.trim()) || [];
    productData.productCode = generateProductCode(productData);

    const newProduct = new Product(productData);
    await newProduct.save();
    res.send("product added");
  } catch (err) {
    console.error(err);
    res.redirect("/newproduct");
  }
});

// Product details/edit
router.get("/:id", isAdmin, async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      req.flash("error", "Product not found");
      return res.redirect("./products/productspage");
    }
    res.render("products/productdetails.ejs", { product });
  } catch (err) {
    next(err);
  }
});

// PUT: Update stock only
router.put('/:id/stock', async (req, res) => {
  try {
    const { stock } = req.body;
    await Product.findByIdAndUpdate(req.params.id, { stock });
    req.flash('success', 'Stock updated successfully.');
    res.redirect('/admin/products');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to update stock.');
    res.redirect('/admin/products');
  }
});

// DELETE: Delete a product
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    req.flash('success', 'Product deleted successfully.');
    res.redirect('/admin/products');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to delete product.');
    res.redirect('/admin/products');
  }
});


module.exports = router; 
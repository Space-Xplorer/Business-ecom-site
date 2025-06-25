const express = require('express');
const router = express.Router();
const MainCategory = require('../models/maincategory');
const ApparelType = require('../models/appareltype');
const Subcategory = require('../models/subcategory');
const Product = require('../models/product'); 
const {validateProduct, isAdmin}= require("../middlewares.js");

// --- FORMS ---

// Add Main Category Form
router.get('/categories/main/new', (req, res) => {
  res.render('categories/main_form');
});

// Add Apparel Type Form
router.get('/categories/apparel/new', async (req, res) => {
  const mainCategories = await MainCategory.find({});
  res.render('categories/apparel_form', { mainCategories });
});

// Add Subcategory Form
router.get('/categories/subcategory/new', async (req, res) => {
  const apparelTypes = await ApparelType.find({}).populate('mainCategory');
  res.render('categories/subcat_form', { apparelTypes });
});

// --- POST ROUTES ---

// Create Main Category
router.post('/categories/main', async (req, res) => {
  try {
    const { name } = req.body;
    const existing = await MainCategory.findOne({ name });
    if (existing) return res.status(400).send('Main category already exists');

    const mainCat = new MainCategory({ name });
    await mainCat.save();
    res.redirect('/categories/all');
  } catch (err) {
    res.status(500).send('Error creating main category');
  }
});

// Create Apparel Type
router.post('/categories/:mainId/apparel', async (req, res) => {
  try {
    const { name } = req.body;
    const { mainId } = req.params;

    const mainCategory = await MainCategory.findById(mainId);
    if (!mainCategory) return res.status(404).send('Main category not found');

    const apparel = new ApparelType({ name, mainCategory: mainId });
    await apparel.save();

    mainCategory.apparelTypes.push(apparel._id);
    await mainCategory.save();

    res.redirect('/categories/all');
  } catch (err) {
    res.status(500).send('Error creating apparel type');
  }
});

// Create Subcategory
router.post('/categories/apparel/:apparelId/subcategory', async (req, res) => {
  try {
    const { name } = req.body;
    const { apparelId } = req.params;

    const apparelType = await ApparelType.findById(apparelId);
    if (!apparelType) return res.status(404).send('Apparel type not found');

    const subcat = new Subcategory({ name, apparelType: apparelId });
    await subcat.save();

    apparelType.subcategories.push(subcat._id);
    await apparelType.save();

    res.redirect('/categories/all');
  } catch (err) {
    res.status(500).send('Error creating subcategory');
  }
});

// --- DISPLAY ROUTES ---

// All Categories (Nested)
router.get('/categories/all', async (req, res) => {
  const categories = await MainCategory.find({})
    .populate({
      path: 'apparelTypes',
      populate: { path: 'subcategories' }
    });
  res.render('categories/all', { categories });
});

// All Products
router.get('/products', async (req, res) => {
  const products = await Product.find({});
  res.render('products/all', { products });
});

// Products by Subcategory
router.get('/subcategory/:subcatId/products', async (req, res) => {
  const subcatId = req.params.subcatId;
  const subcategory = await Subcategory.findById(subcatId).populate({
    path: 'apparelType',
    populate: { path: 'mainCategory' }
  });

  const products = await Product.find({ subcategories: subcategory.name });
  res.render('categories/subcat_products', { subcategory, products });
});

// GET /subcategory/:subcatId/product/new
router.get('/subcategory/:subcatId/product/new', async (req, res) => {
  const subcategory = await Subcategory.findById(req.params.subcatId)
    .populate({
      path: 'apparelType',
      populate: { path: 'mainCategory' }
    });

  if (!subcategory) return res.status(404).send('Subcategory not found');
  res.render('products/new', { subcategory });
});


// POST /subcategory/:subcatId/product
router.post('/subcategory/:subcatId/product',validateProduct, async (req, res) => {
  try {
    const subcategory = await Subcategory.findById(req.params.subcatId)
      .populate({
        path: 'apparelType',
        populate: { path: 'mainCategory' }
      });

    if (!subcategory) return res.status(404).send('Subcategory not found');

    const { name, price, stock, sizesAvailable, colors, description, photos } = req.body;

    // Auto-generate product code (e.g., MEN-TSHIRT-GRAPHIC-001)
    const productCode = `${subcategory.apparelType.mainCategory.name.slice(0, 3).toUpperCase()}-${subcategory.apparelType.name.slice(0, 3).toUpperCase()}-${subcategory.name.slice(0, 3).toUpperCase()}-${Date.now()}`;

    const newProduct = new Product({
      name,
      price,
      stock,
      mainCategory: subcategory.apparelType.mainCategory.name,
      apparelType: subcategory.apparelType.name,
      subcategories: subcategory.name,
      sizesAvailable: Array.isArray(sizesAvailable) ? sizesAvailable : [sizesAvailable],
      colors: Array.isArray(colors) ? colors : [colors],
      description,
      photos: Array.isArray(photos) ? photos : [photos],
      productCode
    });

    await newProduct.save();
    res.redirect(`/subcategory/${subcategory._id}/products`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding product");
  }
});


module.exports = router;

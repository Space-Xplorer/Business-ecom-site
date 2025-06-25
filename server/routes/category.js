const express = require('express');
const router = express.Router();
const ApparelType = require('../models/appareltype');
const Subcategory = require('../models/subcategory');
const Product = require('../models/product'); 
const { validateProduct, isAdmin } = require("../middlewares.js");

// --- DISPLAY MAIN CATEGORY SELECTOR ---
router.get('/categories/all', isAdmin, (req, res) => {
  const fixedMainCategories = ['Men', 'Women', 'Kids', 'All', 'General'];
  res.render('categories/index', { fixedMainCategories });
});

// --- DISPLAY SPECIFIC MAIN CATEGORY PAGE ---
router.get('/categories/:mainName', isAdmin, async (req, res) => {
  const { mainName } = req.params;
const capitalized = mainName.charAt(0).toUpperCase() + mainName.slice(1).toLowerCase();

const apparelTypes = await ApparelType.find({ mainCategory: capitalized }).populate('subcategories');

res.render('categories/show', {
  mainCategoryName: capitalized,
  apparelTypes
});

});

// --- CREATE APPAREL TYPE UNDER MAIN CATEGORY ---
// Create Apparel Type (for fixed main categories)
router.post('/categories/:mainName/apparel', isAdmin, async (req, res) => {
  try {
    const { name } = req.body;
    const { mainName } = req.params;

    // Optional: Validate allowed main categories
    const allowed = ['men', 'women', 'kids'];
    if (!allowed.includes(mainName.toLowerCase())) {
      return res.status(400).send("Invalid main category");
    }

    const newApparel = new ApparelType({
      name,
      mainCategory: mainName.charAt(0).toUpperCase() + mainName.slice(1) // format as 'Men'
    });

    await newApparel.save();
    res.redirect(`/categories/${mainName}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating apparel type");
  }
});


// --- CREATE SUBCATEGORY UNDER APPAREL TYPE ---
router.post('/categories/apparel/:apparelId/subcategory', isAdmin, async (req, res) => {
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

// --- PRODUCTS ---

// View all products (if needed)
router.get('/products', async (req, res) => {
  const products = await Product.find({});
  res.render('products/all', { products });
});

// View products by subcategory
router.get('/subcategory/:subcatId/products', isAdmin, async (req, res) => {
  const subcatId = req.params.subcatId;

  const subcategory = await Subcategory.findById(subcatId).populate({
    path: 'apparelType',
    populate: { path: 'mainCategory' }
  });

  const products = await Product.find({ subcategories: subcategory.name });

  res.render('categories/subcat_products', { subcategory, products });
});

// New product form under subcategory
router.get('/subcategory/:subcatId/product/new', isAdmin, async (req, res) => {
  const subcategory = await Subcategory.findById(req.params.subcatId).populate({
    path: 'apparelType',
    populate: { path: 'mainCategory' }
  });

  if (!subcategory) return res.status(404).send('Subcategory not found');
  res.render('products/new', { subcategory });
});

router.post('/subcategory/:subcatId/product', isAdmin, validateProduct, async (req, res) => {
  try {
    const subcategory = await Subcategory.findById(req.params.subcatId).populate('apparelType');

    if (!subcategory) return res.status(404).send('Subcategory not found');

    const { name, price, stock, sizesAvailable, colors, description, photos } = req.body;

    const mainCat = subcategory.apparelType.mainCategory; // string
    const apparelName = subcategory.apparelType.name;
    const subcatName = subcategory.name;

    const productCode = `${mainCat.slice(0,3).toUpperCase()}-${apparelName.slice(0,3).toUpperCase()}-${subcatName.slice(0,3).toUpperCase()}-${Date.now()}`;

    const newProduct = new Product({
      name,
      price,
      stock,
      mainCategory: mainCat,
      apparelType: apparelName,
      subcategories: subcatName,
      sizesAvailable: Array.isArray(sizesAvailable) ? sizesAvailable : [sizesAvailable],
      colors: Array.isArray(colors) ? colors : [colors],
      description,
      photos: Array.isArray(photos) ? photos : [photos],
      productCode
    });

    await newProduct.save();
    res.redirect(`/subcategory/${subcategory._id}/products`);
  } catch (err) {
    console.error("Product creation error:", err);
    res.status(500).send("Error adding product");
  }
});


// DELETE apparel type
router.delete('/categories/apparel/:apparelId', isAdmin, async (req, res) => {
  const { apparelId } = req.params;
  const apparel = await ApparelType.findByIdAndDelete(apparelId);

  // Optional: delete related subcategories
  if (apparel) {
    await Subcategory.deleteMany({ apparelType: apparel._id });
  }

  res.redirect(`/categories/${apparel.mainCategory.toLowerCase()}`);
});

// DELETE subcategory
router.delete('/categories/subcategory/:subcatId', isAdmin, async (req, res) => {
  const subcat = await Subcategory.findByIdAndDelete(req.params.subcatId);

  if (subcat) {
    await ApparelType.findByIdAndUpdate(subcat.apparelType, {
      $pull: { subcategories: subcat._id }
    });
  }

  res.redirect("/categories/all");
});


module.exports = router;

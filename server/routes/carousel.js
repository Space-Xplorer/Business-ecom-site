const express = require('express');
const router = express.Router();
const multer = require('multer');
const CarouselSlide = require('../models/carouselSlide');

// Multer config for file uploads
const upload = multer({ dest: 'uploads/' });

// POST /carousel - Add new carousel slide
router.post('/carousel', upload.single('image'), async (req, res) => {
  try {
    const { title, link, altText } = req.body;
    const imageUrl = `/uploads/${req.file.filename}`;
    const slide = new CarouselSlide({ imageUrl, title, link, altText });
    await slide.save();
    res.redirect('/admin/home');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding carousel slide');
  }
});

// GET /carousel - List all carousel slides (admin panel)
router.get('/carousel', async (req, res) => {
  try {
    const slides = await CarouselSlide.find({});
    res.render('admin/carousel', { slides });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching carousel slides');
  }
});

// DELETE /carousel/delete/:id - Delete a carousel slide
router.get('/carousel/delete/:id', async (req, res) => {
  try {
    await CarouselSlide.findByIdAndDelete(req.params.id);
    res.redirect('/admin/home');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting carousel slide');
  }
});

module.exports = router;

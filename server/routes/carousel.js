const express = require('express');
const router = express.Router();
const CarouselSlide = require('../models/carouselSlide');

// POST /carousel - Add new carousel slide (using imageUrl from form)
router.post('/carousel', async (req, res) => {
  try {
    const { imageUrl, title, link, altText } = req.body;
    // imageUrl comes directly from the form input
    const slide = new CarouselSlide({ imageUrl, title, link, altText });
    await slide.save();
    res.redirect('/admin/dashboard');
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
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting carousel slide');
  }
});

// Public API to get active carousel slides
router.get('/api/carousel', async (req, res) => {
  try {
    const slides = await CarouselSlide.find({ isActive: true });
    res.json(slides);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch carousel slides' });
  }
});

module.exports = router;

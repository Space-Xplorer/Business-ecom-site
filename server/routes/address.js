const express = require('express');
const router = express.Router();
const Address = require('../models/address');
const User = require('../models/user');

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ message: 'Please log in to continue' });
  }
  next();
}

// Get all addresses for the logged-in user
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('addresses');
    res.json(user.addresses || []);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch addresses' });
  }
});

// Add a new address for the logged-in user
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const address = new Address({ ...req.body });
    await address.save();
    await User.findByIdAndUpdate(req.user._id, { $push: { addresses: address._id } });
    res.status(201).json(address);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add address' });
  }
});

// Update an address
router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const address = await Address.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(address);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update address' });
  }
});

// Delete an address
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    await Address.findByIdAndDelete(req.params.id);
    await User.findByIdAndUpdate(req.user._id, { $pull: { addresses: req.params.id } });
    res.json({ message: 'Address deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete address' });
  }
});

module.exports = router; 
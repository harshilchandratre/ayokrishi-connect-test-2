// routes/feedback.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Handle POST request to store form data
router.post('/submit', async (req, res) => {
  try {
    const { name, email, suggestion } = req.body;
    const newUser = new User({ name, email, suggestion });
    await newUser.save();
    res.status(201).json({ message: 'Feedback saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

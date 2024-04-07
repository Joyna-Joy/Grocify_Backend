const express = require('express');
const Nutrition = require('../Models/NutritionModel');

const router = express.Router();

// Get all nutrition entries
router.get('/viewNutrition', async (req, res) => {
  try {
    const nutritionEntries = await Nutrition.find();
    res.json(nutritionEntries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new nutrition entry
router.post('/addNutrition', async (req, res) => {
  const nutritionEntry = new Nutrition({
    title: req.body.title,
    content: req.body.content,
    imageUrl: req.body.imageUrl,
    nutritionInfo: req.body.nutritionInfo,
  });

  try {
    const newNutritionEntry = await nutritionEntry.save();
    res.status(201).json(newNutritionEntry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Search for nutrition entries by title or content
router.get('/searchNutrition', async (req, res) => {
  const query = req.query.q; // Get the query parameter from the URL
  try {
    const searchResults = await Nutrition.find({
      $or: [
        { title: { $regex: query, $options: 'i' } }, // Case-insensitive title search
        { content: { $regex: query, $options: 'i' } }, // Case-insensitive content search
      ],
    });
    res.json(searchResults);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

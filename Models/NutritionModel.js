const mongoose = require('mongoose');

const nutritionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  imageUrl: String,
  // Nutritional information
  nutritionInfo: {
    type: Map,
    of: Number,
  },
});

const Nutrition = mongoose.model('Nutrition', nutritionSchema);

module.exports = Nutrition;

const mongoose = require('mongoose');

const recipeProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String // This will store the filename of the uploaded image
    }
});

module.exports = mongoose.model('RecipeProduct', recipeProductSchema);

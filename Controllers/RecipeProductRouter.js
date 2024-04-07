const express = require('express');
const router = express.Router();
const RecipeProduct = require('../Models/RecipeProductModel');
const multer = require('multer');

// Get all products
router.get('/viewProduct', async (req, res) => {
    try {
        const Recipeproducts = await RecipeProduct.find();
        res.json(Recipeproducts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new product
router.post('/addProduct', async (req, res) => {
    const Recipeproducts = new RecipeProduct({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        imageUrl:req.body.imageUrl

    });
    try {
        const newProduct = await Recipeproducts.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.post("/searchProduct", async (req, res) => {
    try {
      const Recipeproducts = await RecipeProduct.find({
        name: { $regex: req.body.name, $options: "i" },
      });
      res.json(Recipeproducts);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
});

router.patch('/updateProduct/:id', async (req, res) => {
    try {
      const Recipeproducts = await RecipeProduct.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(Recipeproducts);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Set the destination folder where uploaded files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname) // Set the filename to be unique
    }
});
const upload = multer({ storage: storage });

router.post('/upload', upload.single('image'), async (req, res) => {
    const Recipeproducts = new RecipeProduct({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        imageUrl: req.file ? req.file.filename : null // Store the filename in the database if an image is uploaded
    });
    try {
        const newProduct = await Recipeproducts.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;

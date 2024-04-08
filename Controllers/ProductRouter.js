const express = require("express");
const router = express.Router();
const  Product = require("../Models/ProductModel");
const SearchFeatures = require('../utils/searchFeatures');
const Cart = require("../Models/CartModel")

// Get All Products
router.get('/Viewproducts', async (req, res, next) => {
    const resultPerPage = 12;
    const productsCount = await Product.countDocuments();
    const searchFeature = new SearchFeatures(Product.find(), req.query)
        .search()
        .filter();

    let products = await searchFeature.query;
    let filteredProductsCount = products.length;

    searchFeature.pagination(resultPerPage);

    products = await searchFeature.query.clone();

    res.status(200).json({
        success: true,
        products,
        productsCount,
        resultPerPage,
        filteredProductsCount,
    });
});

// Get Product Details
router.get('/getproduct/:id', async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({ success: false, message: "Product Not Found" });
    }

    res.status(200).json({
        success: true,
        product,
    });
});

// Get All Products (Product Sliders)
router.get('/sliders', async (req, res, next) => {
    const products = await Product.find();

    res.status(200).json({
        success: true,
        products,
    });
});

// Create Product
router.post('/addProduct', async (req, res, next) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to create product" });
    }
});

// Update Product
router.put('/Updateproduct/:id', async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update product" });
    }
});

// Delete Product
router.delete('/Deleteproduct/:id', async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete product" });
    }
});

router.get('/search_products', async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }
        // Perform a case-insensitive search for products whose names contain the search query
        const products = await Product.find({ name: { $regex: query, $options: 'i' } });
        res.json(products);
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Create or Update Reviews
router.post('/reviewsProduct/:id', async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Implementation of creating or updating reviews for a product
        // For simplicity, assume reviews are added directly to the product
        product.reviews.push(req.body);
        await product.save();

        res.status(200).json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to add or update review" });
    }
});

// Get All Reviews of a Product
router.get('/reviewsProduct/:id', async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        const reviews = product.reviews;
        res.status(200).json({ success: true, reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch reviews" });
    }
});

// Delete Review
router.delete('/product/:productId/review/:id', async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        product.reviews = product.reviews.filter(review => review._id.toString() !== req.params.id);
        await product.save();
        res.status(200).json({ success: true, message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete review" });
    }
});

router.get('product_category/:categoryIds', async (req, res, next) => {
    try {
        // Parse category IDs from URL parameters
        const categoryIds = req.params.categoryIds.split(',');

        // Find products that belong to any of the specified categories
        const products = await Product.find({ category: { $in: categoryIds } });

        // Check if any products were found
        if (products.length === 0) {
            return res.status(404).json({ success: false, message: "No products found for the specified categories" });
        }

        res.status(200).json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch products by category" });
    }
});


router.post('/add_cart', async (req, res) => {
    try {
        const { user_id, product_id, quantity } = req.body;
        const product = await Product.findById(product_id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const total_price = product.price * quantity;
        const cartItem = new Cart({
            user_id,
            cartItems: [{
                product_id,
                quantity,
                price:total_price // Assuming the product has a discount_price field
            }]
        });
        const result = await cartItem.save();
        res.json({ status: "success" });
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/get_cart/:id', async (req, res) => {
    try {
        const user_id = req.params.id; // Extract user_id from URL params
        const data = await Cart.findOne({ user_id }).populate('cartItems.product_id', 'product_name  product_img');
        if (!data) {
            return res.json({ status: "no items" });
        }
        res.json(data);
    } catch (error) {
        console.error('Error retrieving cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});




module.exports = router;




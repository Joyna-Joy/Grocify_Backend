const express=require("express")
const router=express.Router()
const productModel=require("../Models/ProductModel")
const Cart=require("../Models/CartModel")

router.post('/product_upload', async (req, res) => {
    try {
        const discount = req.body.discount;
        const price = req.body.price;
        const discount_price = calculateDiscountPrice(price, discount);
        
        const newProduct = new productModel({
            product_name: req.body.product_name,
            price: req.body.price,
            discount: req.body.discount,
            discount_price: discount_price,
            short_desc: req.body.short_desc,
            long_desc: req.body.long_desc,
            vendor_id: req.body.vendor_id,
            category_id: req.body.category_id,
            product_img: req.body.product_img // Assuming product_img contains the image URL
        });

        await newProduct.save();
        res.send("Successfully uploaded");
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to upload product" });
    }
});

router.get("/viewproduct",async(req,res)=>{
    let result=await productModel.find()
    res.json(result)
});

router.get('/product_category', async(req,res)=>{
    let category_id=req.query.category_id
    let data=await productModel.find({"category_id":category_id});
    if(!data)
    {
        return res.json({
            status: "No products"
        })
    }
    res.json(data)
});

router.get('/product_details',async(req,res)=>{
    let product_id=req.query.productId
    let data=await productModel.findById(product_id)
    .populate('vendor_id', 'company_name email ');
    if(!data)
    {
        return res.json({
            status: "No products"
        })
    }
    res.json(data)
});

router.get('/search_products',async(req,res)=>{
    let search=req.query.search
    let data= await productModel.find({"product_name":{ $regex:".*"+search+".*",$options:'i'}});
    if(!data)
    {
        return res.json({
            status: "No products"
        })
    }
    res.json(data)
});


function calculateDiscountPrice(price, discount) {
    const discountedAmount = (parseInt(price) * (parseInt(discount) / 100));
    return (parseInt(price) - discountedAmount).toString();
}

router.put('/update_product', (req, res) => {
    // Extract product ID from request query
    const productId = req.query.id;

    // Extract other product details from request body
    const {
        product_name,
        price,
        discount,
        discount_price,
        short_desc,
        long_desc,
        vendor_id,
        category_id,
        product_img // Assuming product_img contains the image URL
    } = req.body;

    // Update the product in the database
    productModel.findByIdAndUpdate(productId, {
        product_name,
        price,
        discount,
        discount_price,
        short_desc,
        long_desc,
        vendor_id,
        category_id,
        product_img
    }, { new: true })
    .then((updatedProduct) => {
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(updatedProduct);
    })
    .catch((error) => {
        console.error('Error updating product:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    });
});


router.post('/add_cart', async (req, res) => {
    try {
        const { user_id, product_id, quantity } = req.body;
        const product = await productModel.findById(product_id);
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


router.put('/update_cart_qty', async (req, res) => {
    const user_id = req.query.user_id;
    const { product_id, quantity } = req.body;
    if (!quantity || !product_id) {
        return res.status(400).json({ error: 'Quantity and product ID are required' });
    }
    try {
        let cart = await Cart.findOne({ "user_id": user_id });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        let itemIndex = cart.cartItems.findIndex(item => item.product_id.toString() === product_id);
        if (itemIndex === -1) {
            return res.status(404).json({ error: 'Product not found in cart' });
        }
        cart.cartItems[itemIndex].quantity = quantity;
        await cart.save();
        res.status(200).json({ message: 'Quantity updated successfully', cart });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete("/delete_cart", async (req, res) => {
    const user_id = req.query.user_id;

    try {
        // Delete the cart item by user_id
        const deletedCart = await Cart.findOneAndDelete({ "user_id": user_id });

        // Check if the cart was deleted
        if (!deletedCart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Send success response
        res.status(200).json({ message: "Cart deleted successfully" });
    } catch (error) {
        console.error("Error deleting cart:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


module.exports=router
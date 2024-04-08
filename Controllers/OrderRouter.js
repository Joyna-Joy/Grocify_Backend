const express = require('express');
const router = express.Router();
const Order = require('../models/orderModel');
const Cart = require("../Models/CartModel")

// Create New Order
router.post('/new_order', async (req, res, next) => {
    try {
        const {
            user_id,
            shippingInfo,
            orderItems,
            paymentInfo,
        } = req.body;

        // Calculate totalPrice based on orderItems
        let totalPrice = 0;
        for (const orderItem of orderItems) {
            totalPrice += orderItem.price * orderItem.quantity;
        }

        const orderExist = await Order.findOne({ paymentInfo });

        if (orderExist) {
            return res.status(400).json({ message: "Order Already Placed" });
        }

        const order = await Order.create({
            user_id,
            shippingInfo,
            orderItems,
            paymentInfo,
            totalPrice, // Assign calculated totalPrice
            paidAt: Date.now(),
        });

        res.status(201).json({
            success: true,
            order,
        });
    } catch (error) {
        console.error('Error creating new order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Get Single Order Details
router.get('/getOrder/:id', async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate("user_id", "name email");

        if (!order) {
            return res.status(404).json({ message: "Order Not Found" });
        }

        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        console.error('Error retrieving single order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get Logged In User Orders
router.get('/my_orders', async (req, res, next) => {
    try {
        // Simulate user orders without authentication
        const orders = await Order.find();

        res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        console.error('Error retrieving user orders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get All Orders ---ADMIN
router.get('/all_orders', async (req, res, next) => {
    try {
        const orders = await Order.find();

        res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        console.error('Error retrieving all orders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update Order Status ---ADMIN
router.patch('/updateOrder/:id', async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order Not Found" });
        }

        // Simulate order status update without authentication
        order.orderStatus = req.body.status;
        await order.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete Order ---ADMIN
router.delete('/deleteOrder/:id', async (req, res, next) => {
    try {
        const orderId = req.params.id;
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: "Order Not Found" });
        }

        // Simulate order deletion without authentication
        await Order.deleteOne({ _id: orderId });

        res.status(200).json({
            success: true,
        });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Cancel Order
router.put('/cancel_order/:id', async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order Not Found" });
        }

        // Check if order status is eligible for cancellation
        if (order.orderStatus !== 'Shipped') {
            return res.status(400).json({ message: "Order cannot be canceled" });
        }

        // Simulate order cancellation
        order.orderStatus = 'Canceled';
        await order.save({ validateBeforeSave: false });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error canceling order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Return Order
router.put('/return_order/:id', async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order Not Found" });
        }

        // Check if order status is eligible for return
        if (order.orderStatus !== 'Delivered') {
            return res.status(400).json({ message: "Order cannot be returned" });
        }

        // Simulate order return
        order.orderStatus = 'Returned';
        await order.save({ validateBeforeSave: false });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error returning order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

 
module.exports = router;

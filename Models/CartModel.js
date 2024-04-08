const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user_id: {
        type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"User"
    },
    cartItems: [
        {
            product_id:{
                type:mongoose.Schema.Types.ObjectId,
                    required:true,
                    ref:"Product"
            },
            quantity: {
                type: Number,
                default: 1
            },
            price: {
                type: Number,
                 required: true
            }
        }
    ]
});

module.exports = mongoose.model('Cart', cartSchema);
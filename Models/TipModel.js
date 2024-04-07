const mongoose = require('mongoose');

const tipSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,        
        required: true
    },
    
});


module.exports = mongoose.model('Tip', tipSchema);

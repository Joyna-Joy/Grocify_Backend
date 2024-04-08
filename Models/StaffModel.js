const mongoose = require('mongoose');
const staffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },  
  phone_no: {
    required: true,
    type: String,
  },
  role: {
    type: String,
    required: true
  }
});



const Staff = mongoose.model('Staff', staffSchema);

module.exports = Staff;

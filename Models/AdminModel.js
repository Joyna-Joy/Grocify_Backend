const mongoose=require('mongoose');
const VendorSchema=mongoose.Schema({
    company_name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    }
})
module.exports=mongoose.model('vendor',VendorSchema)
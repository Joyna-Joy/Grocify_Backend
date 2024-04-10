const express=require("express")
const router=express.Router()
const vendorModel=require("../models/vendor")
const upload=require("../upload")


router.post('/upload', (req, res) => {
    const newData = new vendorModel({
      company_name: req.body.company_name,
      email: req.body.email,
      // Add other fields as needed
    });
  
    newData.save()
      .then(() => res.send("Successfully uploaded"))
      .catch(err => console.error(err));
  });
  
  router.get("/viewVendor",async(req,res)=>{
    let result=await vendorModel.find()
    res.json(result)
});


  module.exports=router
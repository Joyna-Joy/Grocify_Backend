const express = require('express');
const staffRouter = express.Router();
const bcrypt=require("bcryptjs")
const Staff = require('../Models/StaffModel');


hashPasswordGenerator=async(pass)=>{
  const salt=await bcrypt.genSalt(10)
  return bcrypt.hash(pass,salt)
}

//signup 
staffRouter.post("/signup",async(req,res)=>{
  let {data}={"data":req.body}
  let password=req.body.password
  const hashedPassword=await hashPasswordGenerator(password)
  data.password=hashedPassword
  let signup=new Staff(data)
  let result=await signup.save()
  res.json({
      status:"success"
  })
})

//login 
staffRouter.post("/login",async(req,res)=>{
  let input=req.body
  let email=req.body.email
  let data=await Staff.findOne({"email":email})
  if(!data){
      return res.json(
          {
              status:"invalid email id"
          }
      )
  }
  console.log(data)
  let dbPassword=data.password
  let inputPassword=req.body.password
  console.log(dbPassword)
  console.log(inputPassword)
  const match=await bcrypt.compare(inputPassword,dbPassword)
  if(!match)
  {
      return res.json(
          {
              status : "incorrect password"
          }
      )
  }
  res.json({
      status : "success","staffdata":data
  })
})

staffRouter.put("/changepassword/:staffId", async (req, res) => {
  const { staffId } = req.params;
  const { oldPassword, newPassword } = req.body;
  try {
      const staff = await Staff.findById(staffId);
      if (!staff) {
          return res.status(404).json({ success: false, message: "User not found" });
      }
      const isMatch = await bcrypt.compare(oldPassword, staff.password);
      if (!isMatch) {
          return res.status(400).json({ success: false, message: "Old password is incorrect" });
      }
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      staff.password = hashedNewPassword;
      await staff.save();
      res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
      res.status(500).json({ success: false, message: "Failed to change password" });
  }
});



staffRouter.get("/viewallStaff",async(req,res)=>{
  let result=await Staff.find()
  res.json(result)
})



// Update item
staffRouter.patch('/updateStaff/:id', async (req, res) => {
  try {
    const updatedStaff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedStaff);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



// Delete Staff --ADMIN
staffRouter.delete("/deleteUser/:id", async (req, res, next) => {
  try {
      const staffId = req.params.id;
      const deletedStaff = await Staff.findByIdAndDelete(staffId);
      if (!deletedStaff) {
          return res.status(404).json({
              success: false,
              message: `Staff with id ${staffId} not found.`
          });
      }
      res.status(200).json({
          success: true,
          message: `Staff with id ${staffId} deleted successfully.`,
          deletedStaff
      });
  } catch (error) {
      next(error); // Pass the error to the error handling middleware
  }
});



module.exports = staffRouter;

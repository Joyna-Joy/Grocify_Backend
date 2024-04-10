const express=require("express")
const router=express.Router()
const User =require("../Models/UserModel")
const bcrypt=require("bcryptjs")

hashPasswordGenerator=async(pass)=>{
    const salt=await bcrypt.genSalt(10)
    return bcrypt.hash(pass,salt)
}

//signup

router.post("/signup",async(req,res)=>{
    let {data}={"data":req.body}
    let password=req.body.password
    const hashPassword=await hashPasswordGenerator(password)
    data.password=hashPassword
    let userModel=new User(data)
    let result=await userModel.save()
    res.json({
        status:"success"
    })
})

//login
router.post("/login",async(req,res)=>{
    let input=req.body
    let email=req.body.email
    let data=await User.findOne({"email":email})
    if(!data)
    {
        return res.json({
            status:"invalid email"
        })
    }
    console.log(data)
    let dbPassword=data.password
    let inputPassword=req.body.password
    console.log(dbPassword)
    console.log(inputPassword)
    const match=await bcrypt.compare(inputPassword,dbPassword)
    if(!match)
    {
        return res.json({
            status:"invalid password"
        })
    }
    res.json({
        status:"success","userdata":data
    })
})


// Update Profile

router.put("/updateprofile/:userId", async (req, res) => {
    const userId = req.params.userId;
    try {
      const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
      if (!updatedUser) {
        return res.status(404).json({ status: "error", message: "User not found" });
      }
      res.json({ status: "success", message: "Profile updated successfully", user: updatedUser });
    } catch (err) {
      res.status(500).json({ status: "error", message: "Failed to update profile" });
    }
  });


  // Logout
   router.post("/logout", (req, res) => {
    // Clear user session or token
    // For example, if you are using express-session:
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ status: "error", message: "Logout failed" });
      }
      res.json({ status: "success", message: "Logged out successfully" });
    });
  });



  // Change Password
router.put("/changepassword/:userId", async (req, res) => {
    const { userId } = req.params;
    const { oldPassword, newPassword } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Old password is incorrect" });
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();
        res.status(200).json({ success: true, message: "Password changed successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to change password" });
    }
});



//view user

  router.get('/getAllUsers', async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({
            success: true,
            users,
        });
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
});

// Get Single User Details --ADMIN
router.get('/getSingleUser/:id', async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: `User doesn't exist with id: ${req.params.id}`,
            });
        }
        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
});

// Delete User --ADMIN
router.delete("/deleteUser/:id", async (req, res, next) => {
    try {
        const userId = req.params.id;
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: `User with id ${userId} not found.`
            });
        }
        res.status(200).json({
            success: true,
            message: `User with id ${userId} deleted successfully.`,
            deletedUser
        });
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
});


module.exports = router;
const express=require("express")
const path=require('path')
const router=express.Router()
const categoryModel=require("../Models/categoryModel")

const multer=require('multer')

const Storage=multer.diskStorage({
    destination: 'uploads',
    filename:(req,file,cb)=>{
        let ext=path.extname(file.originalname)
        cb(null, Date.now()+ext);
    },
});

const upload=multer({
    storage:Storage
}).single("categoryImage")

router.post('/upload',(req,res)=>{
    upload(req,res,(err)=>{
        if(err){
            console.log(err)
        }
        else{
            const newcategory=new categoryModel({
                categoryName:req.body.categoryName,
                categoryImage:req.file.path
            })
            newcategory.save()
      .then(() => res.send("Successfully added"))
      .catch(err => console.log(err));
        }
    })
});
router.get("/view_category",async(req,res)=>{
    let result=await categoryModel.find()
    res.json(result)
});

router.post('/add_category', async (req, res) => {
    const tip = new categoryModel({
        categoryName: req.body.categoryName,
        categoryImage:req.body.categoryImage
    });
    try {
        const newTip = await tip.save();
        res.status(201).json(newTip);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


module.exports=router
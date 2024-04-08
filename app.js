const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const tipRouter=require("./Controllers/TipRouter");
const recipeProductRouter=require("./Controllers/RecipeProductRouter");
const nutritionRouter=require("./Controllers/NutritionRouter");
const gorceryListRouter =require("./Controllers/GorceryListRouter");
const userRouter=require('./Controllers/UserRouter');
const productRouter=require('./Controllers/ProductRouter');
const categoryRouter=require("./Controllers/categoryRouter");
const staffRouter = require('./Controllers/StaffRouter');
const orderRouter = require('./Controllers/OrderRouter')


const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb+srv://Joyna-Joy-24:Joyna24joy@cluster0.gj0szp5.mongodb.net/grocifyDB?retryWrites=true&w=majority", { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));



  app.use('/api/user',userRouter);
  app.use('/api/product',productRouter);
  app.use("/api/category",categoryRouter);
  app.use('/api/staff', staffRouter);
  app.use('/api/order', orderRouter);



//Routes For Recipe
app.use('/api/tips', tipRouter);
app.use('/api/recipeProducts', recipeProductRouter);
app.use('/api/nutrition',nutritionRouter);
app.use('/api',gorceryListRouter);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(3000,()=>{
  console.log("server running")
})
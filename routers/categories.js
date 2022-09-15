const Categories = require("../models/categories");

const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
} = require("./verifytoken");

const router = require("express").Router();

//Post Product
router.post("/",verifyTokenAndAdmin,async(req,res,next)=>{
  const newCategory = new Categories(
    {
    name: req.body.name,
    image: req.body.image,
    subcategories: req.body.subcategories,
    faIcon: req.body.faIcon
  });
  try {
    const savedCategory = await newCategory.save();
    return res.status(200).json(savedCategory);
  } catch (error){
    return res.status(500).json(error);
  }
})

//Get a Category
router.get("/:id",async(req,res,next)=>{
  try {
    const category = await Categories.findById(req.params.id);;
    return res.status(200).json(category);
  } catch (error){
    return res.status(500).json(error);
  }
})


//Get All Categories
router.get("/",async(req,res,next)=>{
  try {
    const categories = await Categories.find();;
    return res.status(200).json(categories);
  } catch (error){
    return res.status(500).json(error);
  }
})


//Update Category
router.patch("/:id",verifyTokenAndAdmin,async(req,res)=>{
  try {
      const UpdatedCategory = await Categories.findByIdAndUpdate(
        req.params.id,{
          $set: req.body
      }, { new: true });
      return res.status(200).json(UpdatedCategory);
    }
   catch (error){
    return res.status(500).json(error);
  }
})

//DELETE Category
router.delete("/:id",verifyTokenAndAdmin,async(req,res)=>{
  try {
      const deletedCategory = await Categories.findByIdAndDelete(req.params.id);
      return res.status(200).json("Product has been successfully Deleted");
  } catch (error){
    return res.status(500).json(error);
  }
})

module.exports = router;

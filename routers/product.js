const Product = require("../models/products");
const user = require("../models/users");

const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
} = require("./verifytoken");


const router = require("express").Router();


//Post Product
router.post("/",verifyToken,async(req,res)=>{
  try {
    const Suser = await user.findOne({_id:req.user.id});
    console.log(Suser);
    const allproducts = await Product.find({creatorid:Suser.username});
    console.log(allproducts);
    if((Suser.usertype=="customer"&&allproducts.length<4)){
    const newProduct = new Product({creatorid:Suser.username,...req.body});
    const savedproduct = await newProduct.save();
    return res.status(200).json(savedproduct);}
    else if(Suser.usertype=="silver"&&allproducts.length<8){
      const newProduct = new Product({creatorid:Suser.username,...req.body});
      const savedproduct = await newProduct.save();
      return res.status(200).json(savedproduct);
    }
    else if(Suser.usertype=="gold"&&allproducts.length<16){
      const newProduct = new Product({creatorid:Suser.username,...req.body});
      const savedproduct = await newProduct.save();
      return res.status(200).json(savedproduct);
    }
    else if(Suser.usertype=="diamond"&&allproducts.length<31){
      const newProduct = new Product({creatorid:Suser.username,...req.body});
      const savedproduct = await newProduct.save();
      return res.status(200).json(savedproduct);
    }
    else{return res.status(401).json("Already Full");}
  } catch (error){
    return res.status(500).json(error);
  }
})

router.put("/update/:id",verifyTokenAndAdmin,async(req,res)=>{
  try{
    const data = await Product.findByIdAndUpdate(req.params.id,{$set:req.body},{ new:true });
    return res.status(200).json(data);
  }catch(err){
    return res.status(500).json(err);
  }
})

router.get("/search/:id/:num",async(req,res,next)=>{
  try {
    const name = req.params.id.toString();
    const products = await Product.find({title:{$regex:name,$options:"$i"}}).limit(10).skip(10*(req.params.num-1)).sort({PL:-1});
    const descproducts = await Product.find({descrip:{$regex:name,$options:"$i"}}).limit(10).skip(10*(req.params.num-1)).sort({PL:-1});
    const catproducts = await Product.find({category:{$regex:name,$options:"$i"}}).limit(10).skip(10*(req.params.num-1)).sort({PL:-1});
    const data = [...products,...descproducts,...catproducts];
    const newArray = data.map((m) => [m.id, m]);
    const newMap = new Map(newArray);
    const iterator = newMap.values();
    const uniqueMembers = [...iterator];
    return res.status(200).json(uniqueMembers);
  } catch (error){
    return res.status(500).json(error);
  }
})

router.get("/getbyid/:id",async(req,res)=>{
  try {
    const Updatedproducts = await Product.findByIdAndUpdate(
      req.params.id,{
        $set: req.body,
    }, { new: true }
    );
    return res.status(200).json(Updatedproducts);
  } catch (error){
    return res.status(500).json(error);
  }
})

//Get User Products
router.get("/user/:id",async(req,res,next)=>{
  try {
    const products = await Product.find({creatorid: req.params.id});
    return res.status(200).json(products);
  } catch (error){
    return res.status(500).json(error);
  }
})


//Get a Product
router.get("/:id/:name",async(req,res,next)=>{
  try {
    const regex = new RegExp(["^", req.params.name, "$"].join(""), "i");
    const products = await Product.find({title:regex});
    products.filter(product=>(product.creatorid)===(req.params.id?.toString()));
    return res.status(200).json(products[0]);
  } catch (error){
    return res.status(500).json(error);
  }
})



//Get All Product
router.get("/:num",async(req,res,next)=>{
  try {
    var num;
    if(req.params.num){num=req.params.num}else{num=1}
    const products = await Product.find().sort({PL:-1}).limit(10).skip(10*(num-1));
    return res.status(200).json(products);
  } catch (error){
    return res.status(500).json(error);
  }
})


//Update Product
router.patch("/:id",verifyToken,async(req,res)=>{
  try {
    const product = await Product.findById({_id: req.params.id});
    const creatorid = product.creatorid;
    if(creatorid === req.user.username || req.user.isAdmin){
      const Updatedproducts = await Product.findByIdAndUpdate(
        req.params.id,{
          $set: req.body,
      }, { new: true }
      );
      return res.status(200).json(Updatedproducts);
    }
    return res.status(403).json("You are not allowed to do that!");
  } catch (error){
    return res.status(500).json(error);
  }
})

//DELETE Product
router.delete("/:id",verifyToken,async(req,res)=>{
  try {
    const product = await Product.findById({_id: req.params.id});
    const creatorid = product.creatorid;
    if(creatorid === req.user.username || req.user.isAdmin){
      const DELETEproducts = await Product.findByIdAndDelete(req.params.id);
      return res.status(200).json("Product has been successfully Deleted");
    }
    return res.status(403).json("You are not allowed to do that!");
  } catch (error){
    return res.status(500).json(error);
  }
})
module.exports = router;

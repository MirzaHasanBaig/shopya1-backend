const Cart = require("../models/cart");

const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
} = require("./verifytoken");

const router = require("express").Router();

//Get All Carts
router.get("/",verifyTokenAndAdmin,async(req,res)=>{
  try {
    const cart = await Cart.find();
    return res.status(200).json(cart);
  } catch (e) {
    return res.status(500).json(e);
  }
})

//Post a Cart
router.post("/user/:id",verifyTokenAndAuthorization,async(req,res)=>{
  const newCart = new Cart({
    userId: req.params.id,
  });
  try {
    const savedCart = await newCart.save();
    return res.status(201).json(savedCart);
  } catch (err) {
    return res.status(500).json(err);
  }
})

//Update a Cart
router.patch("/:id",verifyToken,async(req,res)=>{
  try {
    const cart = await Cart.findById(req.params.id);
    const userid = cart.userId;
    if(userid === req.user.id || req.user.isAdmin){
      const Updatedcart = await Cart.findByIdAndUpdate(
        req.params.id,{
          $set: {
            userId:cart.userId,
            product:req.body.product},
      }, { new: true }
      );
      return res.status(200).json(Updatedcart);
    }
    return res.status(403).json("You are not allowed to do that!");
  } catch (error){
    return res.status(500).json(error);
  }
});

//DELETE a Cart
router.delete("/:id",verifyToken,async(req,res)=>{
  try {
    const cart = await Cart.findById(req.params.id);
    const userid = cart.userId;
    if(userid === req.user.id || req.user.isAdmin){
      const Deletedcart = await Cart.findByIdAndUpdate(
        req.params.id,{
        $set: {
          userId:cart.userId,
          product:[]},
    }, { new: true });
      return res.status(200).json(Deletedcart);
    }
    return res.status(403).json("You are not allowed to do that!");
  } catch (error){
    return res.status(500).json(error);
  }
})




//Get a USER Cart
router.get("/user/:id",verifyTokenAndAuthorization,async(req,res)=>{
  try {
    const cart = await Cart.find({userId: req.params.id});
    return res.status(200).json(cart);
  } catch (error){
    return res.status(500).json(error);
  }
})


module.exports = router;

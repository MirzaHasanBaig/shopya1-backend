const Order = require("../models/orders");
const Product = require("../models/products");
const user = require("../models/users")

const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
} = require("./verifytoken");

const router = require("express").Router();

router.get("/review/:id",async(req,res)=>{
  try {
      var Allstar = [];
      var Allreview = [];
      var AVgStar = 0;
      const AllReview = await Order.find().where('products.productid').in(req.params.id).exec();
      AllReview.map((sreview)=>{
      const {products} = sreview;
      const myreview = products.filter(product => product.productid == req.params.id);
      const {star,review} = myreview[0];
      Allstar.push(star);
      Allreview.push(review);
    })
    Allstar.map((star)=>{
      AVgStar = AVgStar+star;
    })
    AVgStar = AVgStar/Allstar.length;
    if(!AVgStar){AVgStar=3}
    return res.status(200).json({Allstar,Allreview,AVgStar});
  } catch (error){
    return res.status(500).json(error);
  }
})

//Post Order
router.post("/",verifyToken,async(req,res,next)=>{
  const newOrder = new Order({
    userId: req.user.id,...req.body
});
  try {
    const savedOrder = await newOrder.save();
    return res.status(200).json(savedOrder);
  } catch (error){
    return res.status(500).json(error);
  }
})


//Get Orders By Buyer
router.get("/buyer/:id",verifyTokenAndAuthorization,async(req,res,next)=>{
  try {
    const order = await Order.find({userId: req.params.id});;
    return res.status(200).json(order);
  } catch (error){
    return res.status(500).json(error);
  }
})

//Get Orders By Seller
router.get("/seller/:id",verifyTokenAndAuthorization,async(req,res,next)=>{
  try {
    var productids=[];
    var myorders=[];
    const myuser = await user.findById(req.params.id);
    const Sproducts = await Product.find({creatorid:myuser.username});
    Sproducts?.map(product=>{productids.push(product._id)});
    const orders = await Order.find().where('products.productid').in(productids).exec();
    for (let i = 0; i < orders.length; i++) {
      for (let j = 0; j < orders[i].products.length; j++) {
        for (let k = 0; k < productids.length; k++) {
          if( orders[i].products[j].productid==productids[k]){
            const {amount,products,...otherdata} = orders[i]._doc;
            const product = orders[i].products[j];
            myorders.push({...otherdata,product}); 
          }
        }
      }
    }
    
    return res.status(200).json(myorders);
  } catch (error){
    return res.status(500).json(error);
  }
})

//Get Stats

router.get("/income",verifyTokenAndAdmin,async(req,res)=>{
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth()-1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth()-1));
  try {
    const data = await Order.aggregate([
    {$match: {createdAt:{$gte:previousMonth}}},
    {$project:{
      month: {$month:"$createdAt"},
      sales:"$amount",
    }},
    {$group:{
      _id:"$month",
      total:{$sum:"$sales"}
    },
  },
    ]).sort({_id:1})
      return res.status(200).json(data);
  } catch (error){
    return res.status(500).json(error);
  }
})

//Get a Order
router.get("/orderid/:id",verifyToken,async(req,res,next)=>{
  try {
    const order = await Order.findById(req.params.id);
    return res.status(200).json(order);
  } catch (error){
    return res.status(500).json(error);
  }
})


//Get All Order
router.get("/all/:num",verifyTokenAndAdmin,async(req,res,next)=>{
  try {
    const products = await Order.find().sort({_id:1}).skip(((req.params.num)-1)*6).limit(6);
    return res.status(200).json(products);
  } catch (error){
    return res.status(500).json(error);
  }
})


//Update Order
router.patch("/:id",verifyTokenAndAdmin,async(req,res)=>{
  try {
      const Updatedproducts = await Order.findByIdAndUpdate(
        req.params.id,{
          $set: req.body,
      }, { new: true }
      );
      return res.status(200).json(Updatedproducts);
  } catch (error){
    return res.status(500).json(error);
  }
})


router.put("/buyyerreview/:id/:arrid",async(req,res)=>{
  try {
      const Updatedproducts = await Order.updateOne(
        {"_id" :  req.params.id, "products._id" :  req.params.arrid},{
          $set: {"products.$.star" : req.body.star,"products.$.review" : req.body.review},
      }, { new: true }
      );
      return res.status(200).json(Updatedproducts);
  } catch (error){
    return res.status(500).json(error);
  }
})

router.put("/sellerreview/:id/:arrid",async(req,res)=>{
  try {
      const Updatedproducts = await Order.updateOne(
        {"_id" :  req.params.id, "products._id" :  req.params.arrid},{
          $set: {"products.$.status" : req.body.status},
      }, { new: true }
      );
      return res.status(200).json(Updatedproducts);
  } catch (error){
    return res.status(500).json(error);
  }
})


//DELETE order
router.delete("/:id",verifyTokenAndAdmin,async(req,res)=>{
  try {
      const deleteOrder = await Order.findByIdAndDelete(req.params.id);
      return res.status(200).json("Product has been successfully Deleted");
  } catch (error){
    return res.status(500).json(error);
  }
})



module.exports = router;

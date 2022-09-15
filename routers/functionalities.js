const ban = require("../models/banner");
const review = require("../models/review");
const blogs = require("../models/blogs");
const images = require("../models/images");
const contact = require("../models/contact");
const user = require("../models/users");
const license = require("../models/license");
const mailchimp = require("@mailchimp/mailchimp_marketing");

mailchimp.setConfig({
  apiKey: process.env.mail_chimpkey,
  server: "us14",
});

const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
} = require("./verifytoken");


const router = require("express").Router()

router.get("/banner",async (req,res)=>{
  try{
    const data = await ban.find();
    return res.status(200).json(data);
  }catch(err){
    return res.status(500).json(err);
  }
})
router.post("/banner",verifyTokenAndAdmin, async(req,res)=>{
  const newban = new ban({...req.body});
  try{
    const data = await newban.save();
    return res.status(200).json(data);
  }catch(err){
    return res.status(500).json(err);
  }
})


router.get("/contact",verifyTokenAndAdmin,async (req,res)=>{
  try{
    const data = await contact.find();
    return res.status(200).json(data);
  }catch(err){
    return res.status(500).json(err);
  }
})

router.post("/contact", async(req,res)=>{
  const newcontact = new contact({...req.body});
  try{
    const data = await newcontact.save();
    return res.status(200).json(data);
  }catch(err){
    return res.status(500).json(err);
  }
})

router.get("/license",verifyTokenAndAdmin,async (req,res)=>{
  try{
    const licese = await license.find();
    return res.status(200).json(licese);
  }catch(err){
    return res.status(500).json(err);
  }
})

router.put("/license/:id",verifyTokenAndAdmin,async (req,res)=>{
  try{
    const  res = await license.findByIdAndUpdate(req.params.id,{$set: req.body}, { new: true });
    if(req.body.status==="disabled"){const res2 = await user.findOneAndUpdate({username:req.body.username},{enabled:false,usertype:"customer"}, {
      new: true,
      upsert: true,
      rawResult: true
    });}else{
      const res2 = await user.findOneAndUpdate({username:req.body.username},{enabled:true,usertype:req.body.type}, {
        new: true,
        upsert: true,
        rawResult: true
      });
    }
    
    return res.status(200).json(res);
  }catch(err){
    return res.status(500).json(err);
  }
})

router.delete("/license/:id",verifyTokenAndAdmin,async (req,res)=>{
  try{
    const licese = await license.findByIdAndDelete(req.params.id);
    return res.status(200).json("Working");
  }catch(err){
    return res.status(500).json(err);
  }
})


router.post("/license",verifyToken,async (req,res)=>{
  try{
  const newreview = new license({...req.body,username:req.user.username});
    const data = await newreview.save();
    return res.status(200).json(data);
  }catch(err){
    return res.status(500).json(err);
  }
})



router.get("/blogs",async (req,res)=>{
  try{
    const Blogs = await blogs.find();
    return res.status(200).json(Blogs);
  }catch(err){
    return res.status(500).json(err);
  }
})


router.delete("/blogs/:id",verifyTokenAndAdmin,async (req,res)=>{
  try{
    const Blogs = await blogs.findByIdAndDelete(req.params.id);
    return res.status(200).json(Blogs);
  }catch(err){
    return res.status(500).json(err);
  }
})

router.post("/email",async(req,res)=>{
  try{
const listId = "28ede1b874";
const subscribingUser = {
  firstName: "User",
  email: req.body.email,
};
await mailchimp.lists.addListMember(listId, {
    email_address: subscribingUser.email,
    status: "subscribed",
    merge_fields: {
      FNAME: subscribingUser.firstName,
    }   
  });
return res.status(200).json({status:"working"});
}
catch(err){
  return res.status(500).json(err);
}
})

router.get("/blog/:id",async (req,res)=>{
  try{
    const regex = new RegExp(["^", req.params.id, "$"].join(""), "i");
    const Blogs = await blogs.findOne({title:regex});
    return res.status(200).json(Blogs);
  }catch(err){
    return res.status(500).json(err);
  }
})

router.post("/blog",verifyTokenAndAdmin,async (req,res)=>{
  try{
  const suser = await user.findById(req.user.id);
  const newreview = new blogs({...req.body,creatorId:suser.username});
    const data = await newreview.save();
    return res.status(200).json(data);
  }catch(err){
    return res.status(500).json(err);
  }
})

router.put("/blog/:id",verifyTokenAndAdmin,async (req,res)=>{
  try{
  await blogs.findByIdAndUpdate(req.params.id,{$set: req.body}, { new: true });
    return res.status(200).json("Working");
  }catch(err){
    return res.status(500).json(err);
  }
})

router.get("/images",async (req,res)=>{
  try{
    const data = await images.find();
    return res.status(200).json(data);
  }catch(err){
    return res.status(500).json(err);
  }
})

router.put("/images/:id",verifyTokenAndAdmin,async (req,res)=>{
  try{
    const data = await images.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true});
    return res.status(200).json(data);
  }catch(err){
    return res.status(500).json(err);
  }
})

module.exports =  router
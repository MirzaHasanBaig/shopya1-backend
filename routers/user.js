const User = require("../models/users");
const CryptoJS = require("crypto-js");
const Product = require("../models/products");

const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
} = require("./verifytoken");

const router = require("express").Router();

//UPDATE
router.put("/:id", verifyTokenAndAuthorization, async(req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, {
                $set: {
                  IBAN: req.body.IBAN,
                  name:req.body.name,
                  email:req.body.email,
                  phone:req.body.phone,
                  address:req.body.address,
                  logoimage: req.body.logoimage,
                  Banimage:req.body.Banimage,
                  ACCtitle:req.body.ACCtitle
                },
            }, { new: true }
        );
        return res.status(200).json("done");
    } catch (err) {
        return res.status(500).json(err);
    }
});

router.put("/password/:id", verifyTokenAndAuthorization, async(req, res) => {
  try {
      const myuser = await User.findById(req.params.id);
      const hashedpassword = CryptoJS.AES.decrypt(myuser.password,process.env.encryption_key);
      const originalPassword = hashedpassword.toString(CryptoJS.enc.Utf8);
      console.log(originalPassword);
      if(originalPassword===req.body.oldpassword){
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, {
                $set: {
                  password: CryptoJS.AES.encrypt(req.body.newpassword,process.env.encryption_key).toString(),
                },
            }, { new: true }
        );
        return res.status(200).json("Done");
      }
      return res.status(404).json("Not Found");
  } catch (err) {
      return res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async(req, res) => {
    try {
        const deleteUser = await User.findById(req.params.id);
        if(deleteUser.enabled){
          const deletedUser = await User.findByIdAndUpdate(req.params.id,{enabled:false});
          return res.status(200).json(deleteUser);
        }else{
          const deletedUser = await User.findByIdAndUpdate(req.params.id,{enabled:true});
          return res.status(200).json(deleteUser);
        }
    } catch (err) {
        return res.status(500).json(err);
    }
});

//GET NEW USER
router.get("/", verifyTokenAndAdmin, async(req, res) => {
  const query = req.query.new;
  try {
    const userSelect = query ?
    await User.find().sort({_id:-1}).limit(1):
    await User.find();
    return res.status(200).json(userSelect);
  } catch (err) {
      return res.status(500).json(err);
  }
});
// Check UserName
router.get("/check/:id",async(req, res) => {
  var check = {availability:true}
  try {
    const users = await User.find();
    const data = users.filter(user=>user.username===req.params.id);
    if(data[0]){
      check = {availability:false};
    }
    return res.status(200).json(check);
  } catch (err) {
      return res.status(500).json(err);
  }
});

//GET USER
router.get("/find/:id", verifyTokenAndAdmin, async(req, res) => {

    try {
        const getUser = await User.findById(req.params.id);
        const { password, ...others } = getUser._doc;
        return res.status(200).json({others});
    } catch (err) {
        return res.status(500).json(err);
    }
});

//Get Store 
router.get("/find/vendor/:id", async(req, res) => {

  try {
      const getUser = await User.findOne({username: req.params.id});
      const {enabled,isadmin,password,card,...data} = getUser._doc;
      return res.status(200).json({...data});
  } catch (err) {
      return res.status(500).json(err);
  }
});

router.get("/stats", verifyTokenAndAdmin, async(req, res) => {
  const date = new Date();
  const lastyear = new Date(date.setFullYear(date.getFullYear()-1));
  try{
    const data = await User.aggregate([
        { $match: { createdAt: { $gte: lastyear } } },
        {
          $project: {
            month: { $month: "$createdAt" },
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: 1 },
          },
        },
      ]).sort({_id:1});
    res.status(200).json(data);
  }
  catch(err){
    return res.status(500).json(err);
  }
});


module.exports = router;

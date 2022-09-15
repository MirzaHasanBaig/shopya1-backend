const jwt = require("jsonwebtoken");

const CryptoJS = require("crypto-js");

var isadmin;
const verifyToken = (req, res, next) => {
  var value;
  try{
    var decrypted = CryptoJS.AES.decrypt(req.body.password, process.env.encryption_key);
    var value = decrypted.toString(CryptoJS.enc.Utf8);
  }
  catch(err){
    value=true;
  }
  if (!value) {
        req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.encryption_key
        ).toString();
  }
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.token_key, (err, user) => {
      if (err) return res.status(403).json("Token is not valid!");
      if(!user.enabled){return res.status(403).json("Your account is disabled!")};
      req.user = user;
      next();
    })
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id ||req.user.username === req.params.id|| req.user.isadmin) {
      next();
    } else {
      return res.status(403).json("You are not allowed to do that! 1");
    }
  });
};


const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isadmin) {
      next();
    } else {
      return res.status(403).json("You are not alowed to do that! 2");
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};

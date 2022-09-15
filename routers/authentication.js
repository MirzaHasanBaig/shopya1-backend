const router = require("express").Router();
const User = require("../models/users");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//REGISTER
router.post("/register", async(req, res) => {
    const newUser = new User({...req.body,
        password: CryptoJS.AES.encrypt(
            req.body.password,
            process.env.encryption_key
        ).toString(),
    });

    try {
        const savedUser = await newUser.save();
        return res.status(201).json(savedUser);
    } catch (err) {
        return res.status(500).json(err);
    }
});

//LOGIN

router.post('/login', async(req, res) => {
    try {
        const user = await User.findOne({
            username: req.body.username
        });
        if (user.enabled) {
            if (!user) { return res.status(401).json("Wrong User Name"); }

            const hashedPassword = CryptoJS.AES.decrypt(
                user.password,
                process.env.encryption_key
            );


            const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

            const inputPassword = req.body.password;

            if (originalPassword != inputPassword) { return res.status(401).json("Wrong Password") }

            const accessToken = jwt.sign({
                    id: user._id,
                    username: user.username,
                    isadmin: user.isadmin,
                    enabled: user.enabled
                },
                process.env.token_key, { expiresIn: "1d" }
            );

            const { password, ...others } = user._doc;
            return res.status(200).json({...others, accessToken });
        } else { return res.status(403).json("You are disabled by admin"); }
    } catch (err) {
        return res.status(500).json(err);
    }
});

module.exports = router;
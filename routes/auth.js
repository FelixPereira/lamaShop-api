const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

// Register
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(req.body.password, process.env.DECODE_PASSWORD).toString()
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).send(savedUser);
  } catch(error) {
    console.log(error.message);
  }
});

// LOGIN

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({username: req.body.username});
    if(!user) {
      return res.status(404).send("User does not exist.");
    }

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password, 
      process.env.DECODE_PASSWORD
    );

    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    if(originalPassword !== req.body.password) {
      return res.status(401).send("Wrong credencial");
    }

    const accessToken = jwt.sign(
      {
        id: user._id, 
        isAdmin: user.isAdmin
      }, 
      process.env.JWT_SECRET_KEY,
      {expiresIn: "3d"}
    );

    const { password, ...others } = user._doc;
    res.send({ ...others, accessToken });
  } catch(error) {
      console.log(error.message);
  }
})

module.exports = router;
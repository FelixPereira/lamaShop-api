const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");

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


module.exports = router;
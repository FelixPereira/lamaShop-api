const router = require("express").Router();
const User = require("../models/User");

// Register
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });

  const savedUser = await newUser.save();
  res.send(savedUser);
});


module.exports = router;
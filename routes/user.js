const router = require("express").Router();
const User = require("../models/User");
const { verifyToken, verifyTokenAndAuthorization } = require("./verifyToken");

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  if(req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.DECODE_PASSWORD).toString();
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
      $set: req.body
    }, {new: true});

    const {password, ...others} = updatedUser._doc;
    res.send(others);
  } catch(error) {
    res.status(500).send(error);
  }
})

module.exports = router;
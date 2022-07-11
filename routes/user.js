const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require('crypto-js');
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

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
});

router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).send('User was deleted.');
  } catch(error) {
      res.status(500).send(error.message);
  }
});

router.get('/find/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    const {password, ...others} = user._doc;
    res.status(200).send(others);
  } catch(error) {
      res.status(500).send(error.message);
  }
});

router.get('/', verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;

  try {
    const users = query 
    ? User.find().sort({_id: -1}).limit(5) 
    : await User.find();
    res.status(200).send(users);
  } catch(error) {
      res.status(500).send(error.message);
  }
});

router.get('/stats', verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      {
        $match: {
          createdAt: {$gte: lastYear}
        }
      },
      {
        $project: {
          month: {$month: "$createdAt"},
        },
      },
      {
        $group: {
          _id: "$month",
          total: {$sum: 1}
        }
      }
    ]);

    res.status(200).send(data);
  } catch(error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
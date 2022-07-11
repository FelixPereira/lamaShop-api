const router = require("express").Router();
const Cart = require("../models/Cart");
const { verifyTokenAndAdmin, verifyTokenAndAuthorization } = require("./verifyToken");


router.post('/add-new', verifyTokenAndAuthorization, async (req, res) => {
  const cart = await new Cart({...req.body});

  try {
    const savedCart = await cart.save();
    res.status(200).send(savedCart);
  } catch(error) {
    res.status(400).send(error.message);
  }
});

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
      $set: req.body
    }, {new: true});

    res.status(200).send(updatedCart);
  } catch(error) {
    res.status(500).send(error);
  }
});

router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).send('Cart was deleted.');
  } catch(error) {
      res.status(500).send(error.message);
  }
});

router.get('/find/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({userId: req.params.userId});
    
    res.status(200).send(cart);
  } catch(error) {
      res.status(500).send(error.message);
  }
});

router.get('/', verifyTokenAndAdmin, async (req, res) => {
  try{ 
    const carts = await Cart.find();
    res.status(200).send(carts);
  } catch(error) {
      res.status(500).send(error.message);
  }
});

module.exports = router;
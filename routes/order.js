const router = require("express").Router();
const Order = require("../models/Order");
const { verifyTokenAndAdmin, verifyTokenAndAuthorization, verifyToken } = require("./verifyToken");


router.post('/add-new', verifyToken, async (req, res) => {
  const order = await new Order({...req.body});

  try {
    const savedOrder = await order.save();
    res.status(200).send(savedOrder);
  } catch(error) {
    res.status(400).send(error.message);
  }
});

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
      $set: req.body
    }, {new: true});

    res.status(200).send(updatedOrder);
  } catch(error) {
    res.status(500).send(error);
  }
});

router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).send('Order was deleted.');
  } catch(error) {
      res.status(500).send(error.message);
  }
});

router.get('/find/:userId', verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await Order.find({userId: req.params.userId});
    
    res.status(200).send(orders);
  } catch(error) {
      res.status(500).send(error.message);
  }
});

router.get('/', verifyTokenAndAdmin, async (req, res) => {
  try{ 
    const orders = await Order.find();
    res.status(200).send(orders);
  } catch(error) {
      res.status(500).send(error.message);
  }
});

router.get('/income', verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: previousMonth
          }
      }},
      {
        $project: {
          month: {
            $month: "$createdAt"
          },
          sales: "$amount",
        }
      },
      {
        $group: {
          _id: "$month",
          total: {$sum: "$sales"}
        }
      }
    ]);
    res.status(200).send(income);
  } catch(error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
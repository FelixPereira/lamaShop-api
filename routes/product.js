const router = require("express").Router();
const Product = require("../models/Product");
const { verifyTokenAndAdmin, verifyTokenAndAuthorization } = require("./verifyToken");


router.post('/add-new', verifyTokenAndAdmin, async (req, res) => {
  const product = await new Product({...req.body});

  try {
    const savedProduct = await product.save();
    res.status(200).send(savedProduct);
  } catch(error) {
    res.status(400).send(error.message);
  }
});

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
      $set: req.body
    }, {new: true});

    res.status(200).send(updatedProduct);
  } catch(error) {
    res.status(500).send(error);
  }
});

router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).send('Product was deleted.');
  } catch(error) {
      res.status(500).send(error.message);
  }
});

router.get('/find/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    res.status(200).send(product);
  } catch(error) {
      res.status(500).send(error.message);
  }
});

router.get('/', async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;

  try {
    let products;

    if(qNew) {
      products = await Product.find().sort({createdAt: -1}).limit(1);
    } else if (qCategory) {
        products = await Product.find({
          categories: {
            $in: [qCategory],
          }
        });
      } else {
          products = await Product.find();
        }

    res.status(200).send(products);
  } catch(error) {
      res.status(500).send(error.message);
  }
});

module.exports = router;
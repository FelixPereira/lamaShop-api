const router = require('express').Router();
const stripe = require('stripe');

router.post('/payment', (req, res) => {
  stripe.charges.create({
    source: req.body.tokenId,
    amount: req.body.amount,
    currency: "usd"
  },
  (stripeError, stripeRes) => {
    if(stripeError) {
      res.status(500).send(stripeError);
    } else {
        res.status(200).send(stripeRes);
    }
  }
  );
}); 

module.exports = router;
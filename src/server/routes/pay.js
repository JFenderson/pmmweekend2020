import { Router } from 'express';
import braintree from 'braintree';

let router = Router();
let brainConfig = {
  gateway: braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCH_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY
  })
};

router.get("/client_token", (req, res) => {
    brainConfig.gateway.clientToken.generate({}, (err, response) => {
        if(err){
            return res.send(err);
        }
        // console.log("RESPONSE TOKEN",response.clientToken);
        return res.send({ token: response.clientToken });
    });
});

router.post("/checkout", (req, res) => {
  const nonceFromTheClient = req.body.payment_method_nonce;
  console.log('result',req.body);
  brainConfig.gateway.transaction.sale(
    {
      amount: "10.00",
      paymentMethodNonce: nonceFromTheClient,
      options: {
        submitForSettlement: true
      }
    },
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(400).send(err);
        return;
      }
      res.status(200).send(result);
    });

//creates the customer
      brainConfig.gateway.customer.create(
        {
          firstName: req.body.fname,
          lastName: req.body.lname,
          // billingAddress: req.body.billing,
          email: req.body.email,
          phone: req.body.phone,
          paymentMethodNonce: nonceFromTheClient
        },
        (err, result) => {
          // if(err){
          //   console.log(err);
          //   res.status(400).send(err);
          // }
          
          // true
          console.log("result success", result);
          result.customer.id;
          // e.g. 494019
          console.log("customer", result.customer);
          console.log("customer id", result.customer.id);
          result.customer.paymentMethods[0].token;
          console.log(
            "payment method",
            result.customer.paymentMethods[0].token
          );
        }
      );
});

router.post("/customer", (req, res) => {
  const nonceFromTheClient = req.body.payment_method_nonce;
  console.log(req.body);
  brainConfig.gateway.customer.create({
    firstName: req.body.fname,
    lastName: req.body.lname,
    billingAddress: req.body.billing,
    email: req.body.email,
    phone: req.body.phone,
    paymentMethodNonce: nonceFromTheClient
  }, (err, result) => {
    if(err){
      res.status(400).send(err);
    }
    result.success;
    // true
    console.log('result success', result.success);
    result.customer.id;
    // e.g. 494019
    console.log("customer",result.customer);
    console.log("customer id",result.customer.id);
    result.customer.paymentMethods[0].token;
    console.log("payment method",   result.customer.paymentMethods[0].token);
  });
  
});

router.post("/create_transaction", function(req, res) {
  var saleRequest = {
    amount: "1000.00",
    creditCard: {
      number: req.body.number,
      cvv: req.body.cvv,
      expirationMonth: req.body.month,
      expirationYear: req.body.year
    },
    options: {
      submitForSettlement: true
    }
  };

  brainConfig.gateway.transaction.sale(saleRequest, function(err, result) {
    if (result.success) {
      res.send(
        "<h1>Success! Transaction ID: " + result.transaction.id + "</h1>"
      );
    } else {
      res.send("<h1>Error:  " + result.message + "</h1>");
    }
  });
});

export default router;
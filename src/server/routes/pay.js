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
        console.log("RESPONSE TOKEN",response.clientToken);
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
        res.status("error").send(err);
        return;
      }

      res.status(200).send(result);
    }
  );
});

router.post("/customer", (req, res) => {
  brainConfig.gateway.customer.create({
    firstName: req.body.fname,
    lastName: req.body.lname,
    billingAddress: req.body.billing,
    email: req.body.email,
    phone: req.body.phone,
    paymentMethodNonce: nonceFromTheClient
  }, (err, result) => {
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

export default router;
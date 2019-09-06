import config from '../config/config';
import { Router } from 'express';

let router = Router();


router.get("/client_token", (req, res) => {
    config.gateway.clientToken.generate({}, (err, response) => {
        if(err){
            return res.send(err);
        }
        return res.send({ token: response.clientToken });
    });
});

router.post("/checkout", (req, res) => {
  const nonceFromTheClient = req.body.payment_method_nonce;
  console.log(req.body);
  config.gateway.transaction.sale(
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
        res.send("error", err);
        return;
      }

      res.send("success", result);
    }
  );
});

export default router;
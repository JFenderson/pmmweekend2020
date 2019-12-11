import { Router } from "express";
// import { transporter } from "../config/nodemailer";
import dotenv from "dotenv";
import SibApiV3Sdk from "sib-api-v3-sdk";
import human from "humanparser";

dotenv.config();

let router = Router();
let defaultClient = SibApiV3Sdk.ApiClient.instance;
let apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.SEND_IN_BLUE_V3;
// Configure API key authorization: partner-key
let partnerKey = defaultClient.authentications["partner-key"];
partnerKey.apiKey = process.env.SEND_IN_BLUE_V2;

var apiInstance = new SibApiV3Sdk.SMTPApi();

var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email


router.get("/", (req, res) => {
  res.send('Server working. Please post at "/contact" to submit a message.');
});

router.post("/signup", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;

  let nameParse = human.parseName(name);


  sendSmtpEmail = {
    to: [
      {
        email: email,
        name: name
      }
    ],
    templateId: 4,
    params: {
      FIRSTNAME: nameParse.firstName,
      LASTNAME: nameParse.lastName
    },
    headers: {
      "X-Mailin-custom":
        "custom_header_1:custom_value_1|custom_header_2:custom_value_2"
    }
  };

  apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function(data) {
      res.status(200).send(data)
    },
    function(error) {
      console.error(error);
      res.status(400).send(error)
    }
  );

});

export default router;

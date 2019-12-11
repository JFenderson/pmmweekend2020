/* eslint-disable no-unused-vars */
import { Router } from "express";
import stripeLoader from "stripe";
import Table from "../util/dbTable.init";
import SibApiV3Sdk from "sib-api-v3-sdk";
import human from "humanparser";
import dotenv from "dotenv";
dotenv.config();

let router = Router();
let events = new Table("events");
const stripe = stripeLoader(process.env.STRIPE_TEST_SECRETKEY);

let defaultClient = SibApiV3Sdk.ApiClient.instance;
let apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.SEND_IN_BLUE_V3;
// Configure API key authorization: partner-key
let partnerKey = defaultClient.authentications["partner-key"];
partnerKey.apiKey = process.env.SEND_IN_BLUE_V2;

let SMTPapiInstance = new SibApiV3Sdk.SMTPApi();

let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email

router.get("/events", (req, res) => {
  events
    .getAll()
    .then(event => {
      return res.json(event);
    })
    .catch(err => {
      return res.sendStatus(400).json(err);
    });
});

//PMM KARAOKE PARTY
router.post("/tickets/pmmticketpayment", (req, res) => {
  let token = req.body.token.id;
  let email = req.body.token.email;
  let name = human.parseName(req.body.token.card.name);
  let tixType = req.body.ticketType;
  let tixQuanity = req.body.ticketQuanity;
  let eventType = req.body.eventName;
  let pmmTotal = req.body.pmmTotal;

   sendSmtpEmail = {
     to: [
       {
         email: email,
         name: req.body.name
       }
     ],
     templateId: 3,
     params: {
       FIRSTNAME: name.firstName,
       LASTNAME: name.lastName
     },
     headers: {
       "X-Mailin-custom":
         "custom_header_1:custom_value_1|custom_header_2:custom_value_2"
     }
   };


  stripe.customers.create({
      source: token,
      email: email
    })
    .then(customer => {
      return stripe.charges.create({
        amount: `${pmmTotal}`,
        currency: "usd",
        description: `PMM Weekend 2020 - ${tixType} with ${tixQuanity} `,
        customer: customer.id,
        receipt_email: customer.email
      });
    })
    .then(charge => {
      
      events
      .insert({
        name: name.fullName,
        email: email,
        event_type: tixType,
        amount: pmmTotal
      })
      .then(member => {
        return res.status(201).send(member);
      })
      .catch(err => {
        return res.status(400).send(err, 400);
      });

      return charge;
    })
    .catch(function onError(error) {
      if (error.status === 400) {
        res.status(400).send({
          error: "Bad request, often due to missing a required parameter."
        });
      } else if (error.status === 401) {
        res.status(401).send({ error: "No valid API key provided." });
      } else if (error.status === 404) {
        res.status(404).send({ error: "The requested resource doesn't exist." });
      } else if (error.status === 500) {
        res.status(500).send({ error: "Purchase Failed" });
      }
    });
});


export default router;

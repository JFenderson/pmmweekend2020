import path from "path";
import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import config from "./config/config";
import "@babel/polyfill";
import webpackHotMiddleware from "webpack-hot-middleware";
import webpack from "webpack";
import cors from 'cors';
import dotenv from "dotenv";
import http from 'http';
import https from 'http2';
import fs from 'fs';
import Table from "./util/dbTable.init";
import ZipCodes from "zipcodes";
import human from "humanparser";
import SibApiV3Sdk from "sib-api-v3-sdk";
import stripeLoader from "stripe";


dotenv.config();

const webPackConfig = require("../../webpack.config.prod.js");
const compiler = webpack(webPackConfig);

let app = express(),
  DIST_DIR = __dirname,
  HTML_FILE = path.join(DIST_DIR, "./index.html"),
  errorPg = path.join(DIST_DIR, "../dist/404.html"), //this is your error page
  legal = path.join(DIST_DIR, "../dist/legal/legal.html"),
  privatePolicy = path.join(DIST_DIR, "../dist/legal/privatePolicy.html"),
  cookiesPolicy = path.join(DIST_DIR, "../dist/legal/cookiesPolicy.html"),
  term = path.join(DIST_DIR, "../dist/legal/term.html"),
  returnPolicy = path.join(DIST_DIR, "../dist/legal/return.html"),
  members = new Table("members"),
  events = new Table("events"),
  defaultClient = SibApiV3Sdk.ApiClient.instance,
  apiKey = defaultClient.authentications["api-key"],
  partnerKey = defaultClient.authentications["partner-key"],
  apiInstance = new SibApiV3Sdk.SMTPApi(),
  sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(),
  stripe = stripeLoader(process.env.STRIPE_TEST_SECRETKEY);


  apiKey.apiKey = process.env.SEND_IN_BLUE_V3;
  partnerKey.apiKey = process.env.SEND_IN_BLUE_V2;

if (process.env.NODE_ENV !== "production") {
	console.log("Looks like we are in development mode!");
}

app.use(
  webpackHotMiddleware(compiler, {
    log: console.log,
    path: "/__webpack_hmr",
    heartbeat: 10 * 1000
  })
);


app.use(cors());
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(express.json());
app.set("trust proxy", true);
app.set("trust proxy", "loopback");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname + "../../dist")));
app.use((req, res, next) => {
  if (!req.secure) {
    return res.redirect(["https://", req.get("Host"), req.url].join(""));
  }
  next();
});

app.get("/", cors(), (_, res) => {
  res.sendFile(HTML_FILE);
});

// app.use("/api", routes);

//routes


app.get("/members/", (req, res) => {
  return members
    .getAll()
    .then(member => {
      return res.status(200).send(member);
    })
    .catch(err => {
      return res.status(400).send(err);
    });
});

app.get("/members/:id", (req, res) => {
  let id = req.params.id;
  return members
    .getOne(id)
    .then(member => {
      return res.status(200).send({ member });
    })
    .catch(err => {
      return res.status(400).send(err);
    });
});

app.delete("/members/:id", (req, res) => {
  let id = req.params.id;
  return members
    .delete(id)
    .then(member => {
      return res.status(200).send({ member });
    })
    .catch(err => {
      return res.status(400).send(err);
    });
});

app.post("/members/signup", (req, res) => {
  let { email, phoneNumber, confirm } = req.body;
  let name = human.parseName(req.body.name);
  let location = ZipCodes.lookup(req.body.location);
  let apiInstance = new SibApiV3Sdk.ContactsApi();
  let createContact = new SibApiV3Sdk.CreateContact();
  let contactEmails = new SibApiV3Sdk.AddContactToList(email); // AddContactToList | Emails addresses of the contacts

  let SMTPapiInstance = new SibApiV3Sdk.SMTPApi();

  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email

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

  let data = {
    firstName: name.firstName,
    lastName: name.lastName,
    email: email,
    phoneNumber: phoneNumber,
    city: location.city,
    state: location.state,
    confirm: confirm
  };

  // let membersJSON = JSON.stringify(data);

  // let json = JSON.parse(membersJSON);

  // members.findOne(json.firstName, json.lastName)
  // .then(member => {
  //     let memberParse = JSON.stringify(member)
  //     let memberJSON = JSON.parse(memberParse)
  //     if (
  //       (data.firstName == memberJSON.first_name) &&
  //       (data.lastName == memberJSON.last_name)
  //     ) {
  //       res.status(400).send('member exists');
  //     }else{
  //     }
  //   })
  members
    .insert({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone_number: data.phoneNumber,
      city: data.city,
      state: data.state,
      marched: data.confirm
    })
    .then(member => {
      return res.status(201).send({ member });
    })
    .catch(err => {
      console.log("at the insert", err);
      return res.status(400).send(err);
    });
  // .catch(err => {
  //   console.log('at the find',err);
  //   res.status(400).send(err);
  // });

  createContact = {
    email: email,
    attributes: {
      FNAME: data.firstName,
      LNAME: data.lastName,
      PHONE: data.phoneNumber
    }
  };

  apiInstance
    .createContact(createContact)
    .then(data => {
      return data;
      // res.status(200).send(data);
    })
    .catch(err => {
      new Error(err);
      // res.status(400).send(err);
    });

  apiInstance
    .addContactToList(5, contactEmails)
    .then(data => {
      return data;
      // res.status(200).send(data);
    })
    .catch(err => {
      new Error(err);
      // res.status(400).send(err);
    });

  SMTPapiInstance.sendTransacEmail(sendSmtpEmail)
    .then(data => {
      return data;
      // res.status(200).send(data);
    })
    .catch(err => {
      new Error(err);
      // res.status(400).send(err);
    });
});

app.get("/contact", (req, res) => {
  res.send('Server working. Please post at "/contact" to submit a message.');
});

app.post("/contact/signup", (req, res) => {
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
      res.status(200).send(data);
    },
    function(error) {
      console.error(error);
      res.status(400).send(error);
    }
  );
});


app.get("/events", (req, res) => {
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
app.post("/tickets/pmmticketpayment", (req, res) => {
  let token = req.body.token.id;
  let email = req.body.token.email;
  let name = human.parseName(req.body.token.card.name);
  let tixType = req.body.ticketType;
  let tixQuanity = req.body.ticketQuanity;
  // let eventType = req.body.eventName;
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

  stripe.customers
    .create({
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
        res
          .status(404)
          .send({ error: "The requested resource doesn't exist." });
      } else if (error.status === 500) {
        res.status(500).send({ error: "Purchase Failed" });
      }
    });
});


//end routes

// getting legal html files
app.get('/legal/legal', (_,res) => {
  res.sendFile(legal)
})
app.get('/legal/term', (_,res) => {
  res.sendFile(term)
})
app.get('/legal/privatePolicy', (_,res) => {
  res.sendFile(privatePolicy)
})
app.get('/legal/cookiesPolicy', (_,res) => {
  res.sendFile(cookiesPolicy)
})
app.get('/legal/return', (_,res) => {
  res.sendFile(returnPolicy)
})

//catch all endpoint will be Error Page
app.use('*', function (req, res) {
	res.sendStatus(404).sendFile(errorPg);
});


// app.listen(config.port, err => {
//   if (err) {
//     return console.log("error", err);
//   }
//   console.log(`server on port ${config.port}!`);
// });

// const options = {
//   hostname: "pmmweekend.com",
//   port: 443,
//   key: fs.readFileSync('test/fixtures/keys/agent2-key.pem'),
//   cert: fs.readFileSync('test/fixtures/keys/agent2-cert.pem')
// };

http.createServer(app).listen(8080, () => {
  console.log(`listening on 8080`);
});

// https.createServer(options, app).listen(433)


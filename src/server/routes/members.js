import { Router } from "express";
import Table from "../util/dbTable.init";
import ZipCodes from "zipcodes";
import human from "humanparser";
import dotenv from "dotenv";
import SibApiV3Sdk from "sib-api-v3-sdk";
dotenv.config();

let router = Router();
let members = new Table("members");
let defaultClient = SibApiV3Sdk.ApiClient.instance;
let apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.SEND_IN_BLUE_V3;
// Configure API key authorization: partner-key
let partnerKey = defaultClient.authentications["partner-key"];
partnerKey.apiKey = process.env.SEND_IN_BLUE_V2;

router.get("/", (req, res) => {
  return members
    .getAll()
    .then(member => {
      return res.status(200).send(member);
    })
    .catch(err => {
      return res.status(400).send(err);
    });
});

router.get("/:id", (req, res) => {
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

router.delete("/:id", (req, res) => {
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

router.post("/signup", (req, res) => {
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
  members.insert({
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
      console.log('at the insert', err);
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

  apiInstance.createContact(createContact)
    .then(data => {
      return data;
      // res.status(200).send(data);
    })
    .catch(err => {
      new Error(err)
      // res.status(400).send(err);
    });

  apiInstance.addContactToList(5,contactEmails)
    .then(data => {
      return data;
      // res.status(200).send(data);
    })
    .catch(err => {
      new Error(err)
      // res.status(400).send(err);
    });

  SMTPapiInstance.sendTransacEmail(sendSmtpEmail)
    .then(data => {
      return data;
      // res.status(200).send(data);
    })
    .catch(err => {
      new Error(err)
      // res.status(400).send(err);
    });
});

export default router;

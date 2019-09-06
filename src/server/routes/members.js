import { Router } from 'express';
import Table from '../util/dbTable.init';
import ZipCodes from 'zipcodes';
import human from 'humanparser';
import dotenv from 'dotenv';
import SibApiV3Sdk from 'sib-api-v3-sdk';
// import { transporter} from '../config/nodemailer';
dotenv.config();

let router = Router();
let members = new Table('members');
let defaultClient = SibApiV3Sdk.ApiClient.instance;
let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.SEND_IN_BLUE_V3;
// Configure API key authorization: partner-key
let partnerKey = defaultClient.authentications['partner-key'];
partnerKey.apiKey = process.env.SEND_IN_BLUE_V2;


router.get('/', (req, res) => {
	members.getAll()
		.then((member) => {
			return res.json(member);
    
		})
		.catch((err) => {
			return res.sendStatus(400).json(err);
    
		});
});

router.get('/:id', (req, res) => {
	let id = req.params.id;
	members.getOne(id)
		.then((member) => {
			return res.json(member);
		})
		.catch((err) => {
			return res.sendStatus(400).send(err);
    
		});
});

router.delete('id:', (req, res)=> {
    let id = req.params.id;
    members.delete(id)
    .then((member) => {
        return res.json(member);
	})
	.catch(err => {
		return res.sendStatus(400).send(err);
	});
});

router.post('/signup', (req, res) => {
	let { email, phoneNumber, crabYear} = req.body;
	let name = human.parseName(req.body.name);
	let location = ZipCodes.lookup(req.body.location);
	let apiInstance = new SibApiV3Sdk.ContactsApi();
	let createContact = new SibApiV3Sdk.CreateContact();
	let contactEmails = new SibApiV3Sdk.AddContactToList(email); // AddContactToList | Emails addresses of the contacts
// 	let emailApiInstance = new SibApiV3Sdk.EmailCampaignsApi();

// 	var emailTo = new SibApiV3Sdk.SendTestEmail('joseph.fenderson@gmail.com'); // SendTestEmail |

// 	emailApiInstance.sendTestEmail(3, emailTo).then(
// 		function() {
// 		console.log("API called successfully.");
// 		},
// 		function(error) {
// 		console.error(error);
// 		}
// 	);

// 	var SMTPapiInstance = new SibApiV3Sdk.SMTPApi();

//   var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email

//   SMTPapiInstance.sendTransacEmail(sendSmtpEmail).then(
//     function(data) {
//       console.log("API called successfully. Returned data: " + data);
//     },
//     function(error) {
//       console.error(error);
//     }
//   );

	let data = {
		firstName: name.firstName,
		lastName: name.lastName,
		email: email,
		phoneNumber: phoneNumber,
		city: location.city,
		state: location.state,
		crabYear: crabYear
	};
	
	members.insert({
		first_name: data.firstName,
		last_name: data.lastName,
		email: data.email,
		phone_number: data.phoneNumber,
		city: data.city,
		state: data.state,
		crab_year: data.crabYear
	})
	.then((member) => {
		return res.status(201).send(member);
		
	})
	.catch((err) => {
			return res.status(400).send(err, 400);
	});
		
	  
	
	
	createContact = { 'email': email,
	'attributes': {
		'FNAME': data.firstName,
		'LNAME': data.lastName,
		'PHONE': data.phoneNumber
	}};
	
	apiInstance.createContact(createContact)
	.then(data => {
		return data;
	})
	.catch(err => {
		new Error(err);
	});
	
	
	apiInstance.addContactToList(contactEmails)
	.then(function(data) {
		return res.sendStatus(201).send(data);
	}, function(error) {
		return res.sendStatus(400).send(error);
	});


    

	// const mailOption = {
	// 	from: 'fenderson.joseph@gmail.com',// who the email is coming from..in the contact form
	// 	to: `${name} <${email}>`,//who the email is going to
	// 	subject: 'Thank you for Signing Up to the PMM Weekend Site',//subject line
	// 	html: `
    // <div style="text-align: center;">
    //   <h1>Hello <span style="color: purple;">${name.firstName} ${name.lastName}</span>,</h1> 
    //   <h2>Thank you signing up. You have been added to the PMM Database which will be used to contact you for future events such as road trips to support the band, band schedules and more currently in the works.</h2>
    //   <h3>Our goal is to build and get every person that marched as PMM in our database so that we can have a directory. With your help we can get there so spread the word to sign up from the website.</h3>
    //   <h1 style="color: purple"><span style="color: gold;">P</span>MM 1X!!!</h1>
    //   <p>If you do not wish to be contacted please repond to this email saying <strong>"PLEASE REMOVE"</strong> and you will be removed from the listing.</p>
    // </div>`,
	// };

	// transporter.sendMail(mailOption,(error, res) => {
	// 	if (error) {
	// 		return new Error(error);
	// 	} else {
	// 		res.sendStatus(201).send(`email sent to ${email}!`);
	// 	}
	// 	transporter.close();
	// });

});

export default router;
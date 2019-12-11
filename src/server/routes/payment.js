/* eslint-disable no-unused-vars */
import { Router } from "express";
import stripeLoader from "stripe";
import Table from "../util/dbTable.init";
// import { transporter } from '../config/nodemailer';
import dotenv from "dotenv";
dotenv.config();

let router = Router();
let events = new Table("events");
const stripe = stripeLoader(process.env.STRIPE_TEST_SECRETKEY);
//---------------------------------------------------------------

//---------------------------------------------------------------

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
  let name = req.body.token.card.name;
  let tixType = req.body.ticketType;
  let tixQuanity = req.body.ticketQuanity;
  let eventType = req.body.eventName;
  let pmmTotal = req.body.pmmTotal;

  console.log(req.body);
  console.log(tixType);
  console.log(parseInt(tixQuanity));
  console.log(eventType);

  return stripe.customers
    .create({
      source: token,
      email: email
    })
    .then(customer => {
      stripe.charges.create({
        amount: `${pmmTotal}`,
        currency: "usd",
        description: `PMM Weekend 2020 - ${tixType} with ${tixQuanity} `,
        customer: customer.id,
        receipt_email: customer.email
      });
    })
    .then(charge => {
      res.send(charge);

      events
        .insert({
          name: name,
          email: email,
          event_type: eventType,
          amount: pmmTotal
        })
        .then(member => {
          return res.status(201).send(member);
        })
        .catch(err => {
          return res.status(400).send(err, 400);
        });

      // //SENDING email
      // let mailOption = {
      // 	from: 'fenderson.joseph@gmail.com',
      // 	to: `${name} <${email}>`,
      // 	subject: 'PMM Weekend Purchase',
      // 	text: 'Thank you for you Payment..See you at PMM Weekend!'
      // };

      // transporter.sendMail(mailOption, (error, res) => {
      // 	if (error) {
      // 		return new Error(error);
      // 	} else {
      // 		res.sendStatus(201).send(`email sent to ${email}!`);
      // 	}
      // 	transporter.close();
      // });
    })
    .catch(function onError(error) {
      if (error.status === 400) {
        res.send({
          error: "Bad request, often due to missing a required parameter."
        });
      } else if (error.status === 401) {
        res.send({ error: "No valid API key provided." });
      } else if (error.status === 404) {
        res.send({ error: "The requested resource doesn't exist." });
      } else if (error.status === 500) {
        res.send({ error: "Purchase Failed" });
      }
    });
});
// router.post('/tickets/pmmkaraoke/2', (req, res) => {
// 	let token = req.body.id;
// 	let email = req.body.email;
// 	let name = req.body.card.name;

// 	return stripe.customers.create({
// 		source: token,
// 		email: email,
// 	}).then((customer) => {
// 		stripe.charges.create({
// 			amount: 1000,
// 			currency: 'usd',
// 			description: 'For PMM Weekend Karaoke Party - 1 ticket',
// 			customer: customer.id,
// 			receipt_email: customer.email,
// 		});
// 	}).then((charge) => {
// 		res.send(charge);
// 		// //SENDING email
// 		// let mailOption = {
// 		// 	from: 'fenderson.joseph@gmail.com',
// 		// 	to: `${name} <${email}>`,
// 		// 	subject: 'PMM Weekend Purchase',
// 		// 	text: 'Thank you for you Payment..See you at PMM Weekend!'
// 		// };

// 		// transporter.sendMail(mailOption, (error, res) => {
// 		// 	if (error) {
// 		// 		return new Error(error);
// 		// 	} else {
// 		// 		res.sendStatus(201).send(`email sent to ${email}!`);
// 		// 	}
// 		// 	transporter.close();
// 		// });
// 	}).catch(function onError(error) {
// 		if (error.status === 400) {
// 			res.send({ error: 'Bad request, often due to missing a required parameter.' });
// 		} else if (error.status === 401) {
// 			res.send({ error: 'No valid API key provided.' });
// 		} else if (error.status === 404) {
// 			res.send({ error: 'The requested resource doesn\'t exist.' });
// 		} else if (error.status === 500) {
// 			res.send({ error: 'Purchase Failed' });
// 		}
// 	});
// });
// router.post('/tickets/pmmkaraoke/3', (req, res) => {
// 	let token = req.body.id;
// 	let email = req.body.email;
// 	let name = req.body.card.name;

// 	return stripe.customers.create({
// 		source: token,
// 		email: email,
// 	}).then((customer) => {
// 		stripe.charges.create({
// 			amount: 1000,
// 			currency: 'usd',
// 			description: 'For PMM Weekend Karaoke Party - 1 ticket',
// 			customer: customer.id,
// 			receipt_email: customer.email,
// 		});
// 	}).then((charge) => {
// 		res.send(charge);
// 		// //SENDING email
// 		// let mailOption = {
// 		// 	from: 'fenderson.joseph@gmail.com',
// 		// 	to: `${name} <${email}>`,
// 		// 	subject: 'PMM Weekend Purchase',
// 		// 	text: 'Thank you for you Payment..See you at PMM Weekend!'
// 		// };

// 		// transporter.sendMail(mailOption, (error, res) => {
// 		// 	if (error) {
// 		// 		return new Error(error);
// 		// 	} else {
// 		// 		res.sendStatus(201).send(`email sent to ${email}!`);
// 		// 	}
// 		// 	transporter.close();
// 		// });
// 	}).catch(function onError(error) {
// 		if (error.status === 400) {
// 			res.send({ error: 'Bad request, often due to missing a required parameter.' });
// 		} else if (error.status === 401) {
// 			res.send({ error: 'No valid API key provided.' });
// 		} else if (error.status === 404) {
// 			res.send({ error: 'The requested resource doesn\'t exist.' });
// 		} else if (error.status === 500) {
// 			res.send({ error: 'Purchase Failed' });
// 		}
// 	});
// });
// router.post('/tickets/pmmkaraoke/4', (req, res) => {
// 	let token = req.body.id;
// 	let email = req.body.email;
// 	let name = req.body.card.name;

// 	return stripe.customers.create({
// 		source: token,
// 		email: email,
// 	}).then((customer) => {
// 		stripe.charges.create({
// 			amount: 1000,
// 			currency: 'usd',
// 			description: 'For PMM Weekend Karaoke Party - 1 ticket',
// 			customer: customer.id,
// 			receipt_email: customer.email,
// 		});
// 	}).then((charge) => {
// 		res.send(charge);
// 		// //SENDING email
// 		// let mailOption = {
// 		// 	from: 'fenderson.joseph@gmail.com',
// 		// 	to: `${name} <${email}>`,
// 		// 	subject: 'PMM Weekend Purchase',
// 		// 	text: 'Thank you for you Payment..See you at PMM Weekend!'
// 		// };

// 		// transporter.sendMail(mailOption, (error, res) => {
// 		// 	if (error) {
// 		// 		return new Error(error);
// 		// 	} else {
// 		// 		res.sendStatus(201).send(`email sent to ${email}!`);
// 		// 	}
// 		// 	transporter.close();
// 		// });
// 	}).catch(function onError(error) {
// 		if (error.status === 400) {
// 			res.send({ error: 'Bad request, often due to missing a required parameter.' });
// 		} else if (error.status === 401) {
// 			res.send({ error: 'No valid API key provided.' });
// 		} else if (error.status === 404) {
// 			res.send({ error: 'The requested resource doesn\'t exist.' });
// 		} else if (error.status === 500) {
// 			res.send({ error: 'Purchase Failed' });
// 		}
// 	});
// });
// router.post('/tickets/pmmkaraoke/5', (req, res) => {
// 	let token = req.body.id;
// 	let email = req.body.email;
// 	let name = req.body.card.name;

// 	return stripe.customers.create({
// 		source: token,
// 		email: email,
// 	}).then((customer) => {
// 		stripe.charges.create({
// 			amount: 1000,
// 			currency: 'usd',
// 			description: 'For PMM Weekend Karaoke Party - 1 ticket',
// 			customer: customer.id,
// 			receipt_email: customer.email,
// 		});
// 	}).then((charge) => {
// 		res.send(charge);
// 		// //SENDING email
// 		// let mailOption = {
// 		// 	from: 'fenderson.joseph@gmail.com',
// 		// 	to: `${name} <${email}>`,
// 		// 	subject: 'PMM Weekend Purchase',
// 		// 	text: 'Thank you for you Payment..See you at PMM Weekend!'
// 		// };

// 		// transporter.sendMail(mailOption, (error, res) => {
// 		// 	if (error) {
// 		// 		return new Error(error);
// 		// 	} else {
// 		// 		res.sendStatus(201).send(`email sent to ${email}!`);
// 		// 	}
// 		// 	transporter.close();
// 		// });
// 	}).catch(function onError(error) {
// 		if (error.status === 400) {
// 			res.send({ error: 'Bad request, often due to missing a required parameter.' });
// 		} else if (error.status === 401) {
// 			res.send({ error: 'No valid API key provided.' });
// 		} else if (error.status === 404) {
// 			res.send({ error: 'The requested resource doesn\'t exist.' });
// 		} else if (error.status === 500) {
// 			res.send({ error: 'Purchase Failed' });
// 		}
// 	});
// });
// //-----------------------------------------------------------------

// //PMM ALL BLACK PARTY
// router.post('/tickets/pmmblackparty/1', (req, res) => {
// 	let token = req.body.id;
// 	let email = req.body.email;
// 	let name = req.body.card.name;

// 	return stripe.customers.create({
// 		source: token,
// 		email: email,
// 	}).then((customer) => {
// 		stripe.charges.create({
// 			amount: 1000,
// 			currency: 'usd',
// 			description: 'For PMM Weekend Karaoke Party - 1 ticket',
// 			customer: customer.id,
// 			receipt_email: customer.email,
// 		});
// 	}).then((charge) => {
// 		res.send(charge);
// 		// //SENDING email
// 		// let mailOption = {
// 		// 	from: 'fenderson.joseph@gmail.com',
// 		// 	to: `${name} <${email}>`,
// 		// 	subject: 'PMM Weekend Purchase',
// 		// 	text: 'Thank you for you Payment..See you at PMM Weekend!'
// 		// };

// 		// transporter.sendMail(mailOption, (error, res) => {
// 		// 	if (error) {
// 		// 		return new Error(error);
// 		// 	} else {
// 		// 		res.sendStatus(201).send(`email sent to ${email}!`);
// 		// 	}
// 		// 	transporter.close();
// 		// });
// 	}).catch(function onError(error) {
// 		if (error.status === 400) {
// 			res.send({ error: 'Bad request, often due to missing a required parameter.' });
// 		} else if (error.status === 401) {
// 			res.send({ error: 'No valid API key provided.' });
// 		} else if (error.status === 404) {
// 			res.send({ error: 'The requested resource doesn\'t exist.' });
// 		} else if (error.status === 500) {
// 			res.send({ error: 'Purchase Failed' });
// 		}
// 	});
// });
// router.post('/tickets/pmmblackparty/2', (req, res) => {
// 	let token = req.body.id;
// 	let email = req.body.email;
// 	let name = req.body.card.name;

// 	return stripe.customers.create({
// 		source: token,
// 		email: email,
// 	}).then((customer) => {
// 		stripe.charges.create({
// 			amount: 1000,
// 			currency: 'usd',
// 			description: 'For PMM Weekend Karaoke Party - 1 ticket',
// 			customer: customer.id,
// 			receipt_email: customer.email,
// 		});
// 	}).then((charge) => {
// 		res.send(charge);
// 		// //SENDING email
// 		// let mailOption = {
// 		// 	from: 'fenderson.joseph@gmail.com',
// 		// 	to: `${name} <${email}>`,
// 		// 	subject: 'PMM Weekend Purchase',
// 		// 	text: 'Thank you for you Payment..See you at PMM Weekend!'
// 		// };

// 		// transporter.sendMail(mailOption, (error, res) => {
// 		// 	if (error) {
// 		// 		return new Error(error);
// 		// 	} else {
// 		// 		res.sendStatus(201).send(`email sent to ${email}!`);
// 		// 	}
// 		// 	transporter.close();
// 		// });
// 	}).catch(function onError(error) {
// 		if (error.status === 400) {
// 			res.send({ error: 'Bad request, often due to missing a required parameter.' });
// 		} else if (error.status === 401) {
// 			res.send({ error: 'No valid API key provided.' });
// 		} else if (error.status === 404) {
// 			res.send({ error: 'The requested resource doesn\'t exist.' });
// 		} else if (error.status === 500) {
// 			res.send({ error: 'Purchase Failed' });
// 		}
// 	});
// });
// router.post('/tickets/pmmblackparty/3', (req, res) => {
// 	let token = req.body.id;
// 	let email = req.body.email;
// 	let name = req.body.card.name;

// 	return stripe.customers.create({
// 		source: token,
// 		email: email,
// 	}).then((customer) => {
// 		stripe.charges.create({
// 			amount: 1000,
// 			currency: 'usd',
// 			description: 'For PMM Weekend Karaoke Party - 1 ticket',
// 			customer: customer.id,
// 			receipt_email: customer.email,
// 		});
// 	}).then((charge) => {
// 		res.send(charge);
// 		// //SENDING email
// 		// let mailOption = {
// 		// 	from: 'fenderson.joseph@gmail.com',
// 		// 	to: `${name} <${email}>`,
// 		// 	subject: 'PMM Weekend Purchase',
// 		// 	text: 'Thank you for you Payment..See you at PMM Weekend!'
// 		// };

// 		// transporter.sendMail(mailOption, (error, res) => {
// 		// 	if (error) {
// 		// 		return new Error(error);
// 		// 	} else {
// 		// 		res.sendStatus(201).send(`email sent to ${email}!`);
// 		// 	}
// 		// 	transporter.close();
// 		// });
// 	}).catch(function onError(error) {
// 		if (error.status === 400) {
// 			res.send({ error: 'Bad request, often due to missing a required parameter.' });
// 		} else if (error.status === 401) {
// 			res.send({ error: 'No valid API key provided.' });
// 		} else if (error.status === 404) {
// 			res.send({ error: 'The requested resource doesn\'t exist.' });
// 		} else if (error.status === 500) {
// 			res.send({ error: 'Purchase Failed' });
// 		}
// 	});
// });
// router.post('/tickets/pmmblackparty/4', (req, res) => {
// 	let token = req.body.id;
// 	let email = req.body.email;
// 	let name = req.body.card.name;

// 	return stripe.customers.create({
// 		source: token,
// 		email: email,
// 	}).then((customer) => {
// 		stripe.charges.create({
// 			amount: 1000,
// 			currency: 'usd',
// 			description: 'For PMM Weekend Karaoke Party - 1 ticket',
// 			customer: customer.id,
// 			receipt_email: customer.email,
// 		});
// 	}).then((charge) => {
// 		res.send(charge);
// 		// //SENDING email
// 		// let mailOption = {
// 		// 	from: 'fenderson.joseph@gmail.com',
// 		// 	to: `${name} <${email}>`,
// 		// 	subject: 'PMM Weekend Purchase',
// 		// 	text: 'Thank you for you Payment..See you at PMM Weekend!'
// 		// };

// 		// transporter.sendMail(mailOption, (error, res) => {
// 		// 	if (error) {
// 		// 		return new Error(error);
// 		// 	} else {
// 		// 		res.sendStatus(201).send(`email sent to ${email}!`);
// 		// 	}
// 		// 	transporter.close();
// 		// });
// 	}).catch(function onError(error) {
// 		if (error.status === 400) {
// 			res.send({ error: 'Bad request, often due to missing a required parameter.' });
// 		} else if (error.status === 401) {
// 			res.send({ error: 'No valid API key provided.' });
// 		} else if (error.status === 404) {
// 			res.send({ error: 'The requested resource doesn\'t exist.' });
// 		} else if (error.status === 500) {
// 			res.send({ error: 'Purchase Failed' });
// 		}
// 	});
// });
// router.post('/tickets/pmmblackparty/5', (req, res) => {
// 	let token = req.body.id;
// 	let email = req.body.email;
// 	let name = req.body.card.name;

// 	return stripe.customers.create({
// 		source: token,
// 		email: email,
// 	}).then((customer) => {
// 		stripe.charges.create({
// 			amount: 1000,
// 			currency: 'usd',
// 			description: 'For PMM Weekend Karaoke Party - 1 ticket',
// 			customer: customer.id,
// 			receipt_email: customer.email,
// 		});
// 	}).then((charge) => {
// 		res.send(charge);
// 		// //SENDING email
// 		// let mailOption = {
// 		// 	from: 'fenderson.joseph@gmail.com',
// 		// 	to: `${name} <${email}>`,
// 		// 	subject: 'PMM Weekend Purchase',
// 		// 	text: 'Thank you for you Payment..See you at PMM Weekend!'
// 		// };

// 		// transporter.sendMail(mailOption, (error, res) => {
// 		// 	if (error) {
// 		// 		return new Error(error);
// 		// 	} else {
// 		// 		res.sendStatus(201).send(`email sent to ${email}!`);
// 		// 	}
// 		// 	transporter.close();
// 		// });
// 	}).catch(function onError(error) {
// 		if (error.status === 400) {
// 			res.send({ error: 'Bad request, often due to missing a required parameter.' });
// 		} else if (error.status === 401) {
// 			res.send({ error: 'No valid API key provided.' });
// 		} else if (error.status === 404) {
// 			res.send({ error: 'The requested resource doesn\'t exist.' });
// 		} else if (error.status === 500) {
// 			res.send({ error: 'Purchase Failed' });
// 		}
// 	});
// });
// //-----------------------------------------------------------------

// //PMM PICNIC
// router.post('/tickets/pmmpicnic/1', (req, res) => {
// 	let token = req.body.id;
// 	let email = req.body.email;
// 	let name = req.body.card.name;

// 	return stripe.customers.create({
// 		source: token,
// 		email: email,
// 	}).then((customer) => {
// 		stripe.charges.create({
// 			amount: 1000,
// 			currency: 'usd',
// 			description: 'For PMM Weekend Karaoke Party - 1 ticket',
// 			customer: customer.id,
// 			receipt_email: customer.email,
// 		});
// 	}).then((charge) => {
// 		res.send(charge);
// 		// //SENDING email
// 		// let mailOption = {
// 		// 	from: 'fenderson.joseph@gmail.com',
// 		// 	to: `${name} <${email}>`,
// 		// 	subject: 'PMM Weekend Purchase',
// 		// 	text: 'Thank you for you Payment..See you at PMM Weekend!'
// 		// };

// 		// transporter.sendMail(mailOption, (error, res) => {
// 		// 	if (error) {
// 		// 		return new Error(error);
// 		// 	} else {
// 		// 		res.sendStatus(201).send(`email sent to ${email}!`);
// 		// 	}
// 		// 	transporter.close();
// 		// });
// 	}).catch(function onError(error) {
// 		if (error.status === 400) {
// 			res.send({ error: 'Bad request, often due to missing a required parameter.' });
// 		} else if (error.status === 401) {
// 			res.send({ error: 'No valid API key provided.' });
// 		} else if (error.status === 404) {
// 			res.send({ error: 'The requested resource doesn\'t exist.' });
// 		} else if (error.status === 500) {
// 			res.send({ error: 'Purchase Failed' });
// 		}
// 	});
// });
// router.post('/tickets/pmmpicnic/2', (req, res) => {
// 	let token = req.body.id;
// 	let email = req.body.email;
// 	let name = req.body.card.name;

// 	return stripe.customers.create({
// 		source: token,
// 		email: email,
// 	}).then((customer) => {
// 		stripe.charges.create({
// 			amount: 1000,
// 			currency: 'usd',
// 			description: 'For PMM Weekend Karaoke Party - 1 ticket',
// 			customer: customer.id,
// 			receipt_email: customer.email,
// 		});
// 	}).then((charge) => {
// 		res.send(charge);
// 		// //SENDING email
// 		// let mailOption = {
// 		// 	from: 'fenderson.joseph@gmail.com',
// 		// 	to: `${name} <${email}>`,
// 		// 	subject: 'PMM Weekend Purchase',
// 		// 	text: 'Thank you for you Payment..See you at PMM Weekend!'
// 		// };

// 		// transporter.sendMail(mailOption, (error, res) => {
// 		// 	if (error) {
// 		// 		return new Error(error);
// 		// 	} else {
// 		// 		res.sendStatus(201).send(`email sent to ${email}!`);
// 		// 	}
// 		// 	transporter.close();
// 		// });
// 	}).catch(function onError(error) {
// 		if (error.status === 400) {
// 			res.send({ error: 'Bad request, often due to missing a required parameter.' });
// 		} else if (error.status === 401) {
// 			res.send({ error: 'No valid API key provided.' });
// 		} else if (error.status === 404) {
// 			res.send({ error: 'The requested resource doesn\'t exist.' });
// 		} else if (error.status === 500) {
// 			res.send({ error: 'Purchase Failed' });
// 		}
// 	});
// });
// router.post('/tickets/pmmpicnic/3', (req, res) => {
// 	let token = req.body.id;
// 	let email = req.body.email;
// 	let name = req.body.card.name;

// 	return stripe.customers.create({
// 		source: token,
// 		email: email,
// 	}).then((customer) => {
// 		stripe.charges.create({
// 			amount: 1000,
// 			currency: 'usd',
// 			description: 'For PMM Weekend Karaoke Party - 1 ticket',
// 			customer: customer.id,
// 			receipt_email: customer.email,
// 		});
// 	}).then((charge) => {
// 		res.send(charge);
// 		// //SENDING email
// 		// let mailOption = {
// 		// 	from: 'fenderson.joseph@gmail.com',
// 		// 	to: `${name} <${email}>`,
// 		// 	subject: 'PMM Weekend Purchase',
// 		// 	text: 'Thank you for you Payment..See you at PMM Weekend!'
// 		// };

// 		// transporter.sendMail(mailOption, (error, res) => {
// 		// 	if (error) {
// 		// 		return new Error(error);
// 		// 	} else {
// 		// 		res.sendStatus(201).send(`email sent to ${email}!`);
// 		// 	}
// 		// 	transporter.close();
// 		// });
// 	}).catch(function onError(error) {
// 		if (error.status === 400) {
// 			res.send({ error: 'Bad request, often due to missing a required parameter.' });
// 		} else if (error.status === 401) {
// 			res.send({ error: 'No valid API key provided.' });
// 		} else if (error.status === 404) {
// 			res.send({ error: 'The requested resource doesn\'t exist.' });
// 		} else if (error.status === 500) {
// 			res.send({ error: 'Purchase Failed' });
// 		}
// 	});
// });
// router.post('/tickets/pmmpicnic/4', (req, res) => {
// 	let token = req.body.id;
// 	let email = req.body.email;
// 	let name = req.body.card.name;

// 	return stripe.customers.create({
// 		source: token,
// 		email: email,
// 	}).then((customer) => {
// 		stripe.charges.create({
// 			amount: 1000,
// 			currency: 'usd',
// 			description: 'For PMM Weekend Karaoke Party - 1 ticket',
// 			customer: customer.id,
// 			receipt_email: customer.email,
// 		});
// 	}).then((charge) => {
// 		res.send(charge);
// 		// //SENDING email
// 		// let mailOption = {
// 		// 	from: 'fenderson.joseph@gmail.com',
// 		// 	to: `${name} <${email}>`,
// 		// 	subject: 'PMM Weekend Purchase',
// 		// 	text: 'Thank you for you Payment..See you at PMM Weekend!'
// 		// };

// 		// transporter.sendMail(mailOption, (error, res) => {
// 		// 	if (error) {
// 		// 		return new Error(error);
// 		// 	} else {
// 		// 		res.sendStatus(201).send(`email sent to ${email}!`);
// 		// 	}
// 		// 	transporter.close();
// 		// });
// 	}).catch(function onError(error) {
// 		if (error.status === 400) {
// 			res.send({ error: 'Bad request, often due to missing a required parameter.' });
// 		} else if (error.status === 401) {
// 			res.send({ error: 'No valid API key provided.' });
// 		} else if (error.status === 404) {
// 			res.send({ error: 'The requested resource doesn\'t exist.' });
// 		} else if (error.status === 500) {
// 			res.send({ error: 'Purchase Failed' });
// 		}
// 	});
// });
// router.post('/tickets/pmmpicnic/5', (req, res) => {
// 	let token = req.body.id;
// 	let email = req.body.email;
// 	let name = req.body.card.name;

// 	return stripe.customers.create({
// 		source: token,
// 		email: email,
// 	}).then((customer) => {
// 		stripe.charges.create({
// 			amount: 1000,
// 			currency: 'usd',
// 			description: 'For PMM Weekend Karaoke Party - 1 ticket',
// 			customer: customer.id,
// 			receipt_email: customer.email,
// 		});
// 	}).then((charge) => {
// 		res.send(charge);
// 		// //SENDING email
// 		// let mailOption = {
// 		// 	from: 'fenderson.joseph@gmail.com',
// 		// 	to: `${name} <${email}>`,
// 		// 	subject: 'PMM Weekend Purchase',
// 		// 	text: 'Thank you for you Payment..See you at PMM Weekend!'
// 		// };

// 		// transporter.sendMail(mailOption, (error, res) => {
// 		// 	if (error) {
// 		// 		return new Error(error);
// 		// 	} else {
// 		// 		res.sendStatus(201).send(`email sent to ${email}!`);
// 		// 	}
// 		// 	transporter.close();
// 		// });
// 	}).catch(function onError(error) {
// 		if (error.status === 400) {
// 			res.send({ error: 'Bad request, often due to missing a required parameter.' });
// 		} else if (error.status === 401) {
// 			res.send({ error: 'No valid API key provided.' });
// 		} else if (error.status === 404) {
// 			res.send({ error: 'The requested resource doesn\'t exist.' });
// 		} else if (error.status === 500) {
// 			res.send({ error: 'Purchase Failed' });
// 		}
// 	});
// });
// //-----------------------------------------------------------------
// //PMM PICNIC
// router.post('/tickets/pmmbrunch/1', (req, res) => {
// 	let token = req.body.id;
// 	let email = req.body.email;
// 	let name = req.body.card.name;

// 	return stripe.customers.create({
// 		source: token,
// 		email: email,
// 	}).then((customer) => {
// 		stripe.charges.create({
// 			amount: 1000,
// 			currency: 'usd',
// 			description: 'For PMM Weekend Karaoke Party - 1 ticket',
// 			customer: customer.id,
// 			receipt_email: customer.email,
// 		});
// 	}).then((charge) => {
// 		res.send(charge);
// 		// //SENDING email
// 		// let mailOption = {
// 		// 	from: 'fenderson.joseph@gmail.com',
// 		// 	to: `${name} <${email}>`,
// 		// 	subject: 'PMM Weekend Purchase',
// 		// 	text: 'Thank you for you Payment..See you at PMM Weekend!'
// 		// };

// 		// transporter.sendMail(mailOption, (error, res) => {
// 		// 	if (error) {
// 		// 		return new Error(error);
// 		// 	} else {
// 		// 		res.sendStatus(201).send(`email sent to ${email}!`);
// 		// 	}
// 		// 	transporter.close();
// 		// });
// 	}).catch(function onError(error) {
// 		if (error.status === 400) {
// 			res.send({ error: 'Bad request, often due to missing a required parameter.' });
// 		} else if (error.status === 401) {
// 			res.send({ error: 'No valid API key provided.' });
// 		} else if (error.status === 404) {
// 			res.send({ error: 'The requested resource doesn\'t exist.' });
// 		} else if (error.status === 500) {
// 			res.send({ error: 'Purchase Failed' });
// 		}
// 	});
// });
// router.post('/tickets/pmmbrunch/2', (req, res) => {
// 	let token = req.body.id;
// 	let email = req.body.email;
// 	let name = req.body.card.name;

// 	return stripe.customers.create({
// 		source: token,
// 		email: email,
// 	}).then((customer) => {
// 		stripe.charges.create({
// 			amount: 1000,
// 			currency: 'usd',
// 			description: 'For PMM Weekend Karaoke Party - 1 ticket',
// 			customer: customer.id,
// 			receipt_email: customer.email,
// 		});
// 	}).then((charge) => {
// 		res.send(charge);
// 		// //SENDING email
// 		// let mailOption = {
// 		// 	from: 'fenderson.joseph@gmail.com',
// 		// 	to: `${name} <${email}>`,
// 		// 	subject: 'PMM Weekend Purchase',
// 		// 	text: 'Thank you for you Payment..See you at PMM Weekend!'
// 		// };

// 		// transporter.sendMail(mailOption, (error, res) => {
// 		// 	if (error) {
// 		// 		return new Error(error);
// 		// 	} else {
// 		// 		res.sendStatus(201).send(`email sent to ${email}!`);
// 		// 	}
// 		// 	transporter.close();
// 		// });
// 	}).catch(function onError(error) {
// 		if (error.status === 400) {
// 			res.send({ error: 'Bad request, often due to missing a required parameter.' });
// 		} else if (error.status === 401) {
// 			res.send({ error: 'No valid API key provided.' });
// 		} else if (error.status === 404) {
// 			res.send({ error: 'The requested resource doesn\'t exist.' });
// 		} else if (error.status === 500) {
// 			res.send({ error: 'Purchase Failed' });
// 		}
// 	});
// });
// router.post('/tickets/pmmbrunch/3', (req, res) => {
// 	let token = req.body.id;
// 	let email = req.body.email;
// 	let name = req.body.card.name;

// 	return stripe.customers.create({
// 		source: token,
// 		email: email,
// 	}).then((customer) => {
// 		stripe.charges.create({
// 			amount: 1000,
// 			currency: 'usd',
// 			description: 'For PMM Weekend Karaoke Party - 1 ticket',
// 			customer: customer.id,
// 			receipt_email: customer.email,
// 		});
// 	}).then((charge) => {
// 		res.send(charge);
// 		// //SENDING email
// 		// let mailOption = {
// 		// 	from: 'fenderson.joseph@gmail.com',
// 		// 	to: `${name} <${email}>`,
// 		// 	subject: 'PMM Weekend Purchase',
// 		// 	text: 'Thank you for you Payment..See you at PMM Weekend!'
// 		// };

// 		// transporter.sendMail(mailOption, (error, res) => {
// 		// 	if (error) {
// 		// 		return new Error(error);
// 		// 	} else {
// 		// 		res.sendStatus(201).send(`email sent to ${email}!`);
// 		// 	}
// 		// 	transporter.close();
// 		// });
// 	}).catch(function onError(error) {
// 		if (error.status === 400) {
// 			res.send({ error: 'Bad request, often due to missing a required parameter.' });
// 		} else if (error.status === 401) {
// 			res.send({ error: 'No valid API key provided.' });
// 		} else if (error.status === 404) {
// 			res.send({ error: 'The requested resource doesn\'t exist.' });
// 		} else if (error.status === 500) {
// 			res.send({ error: 'Purchase Failed' });
// 		}
// 	});
// });
// router.post('/tickets/pmmbrunch/4', (req, res) => {
// 	let token = req.body.id;
// 	let email = req.body.email;
// 	let name = req.body.card.name;

// 	return stripe.customers.create({
// 		source: token,
// 		email: email,
// 	}).then((customer) => {
// 		stripe.charges.create({
// 			amount: 1000,
// 			currency: 'usd',
// 			description: 'For PMM Weekend Karaoke Party - 1 ticket',
// 			customer: customer.id,
// 			receipt_email: customer.email,
// 		});
// 	}).then((charge) => {
// 		res.send(charge);
// 		// //SENDING email
// 		// let mailOption = {
// 		// 	from: 'fenderson.joseph@gmail.com',
// 		// 	to: `${name} <${email}>`,
// 		// 	subject: 'PMM Weekend Purchase',
// 		// 	text: 'Thank you for you Payment..See you at PMM Weekend!'
// 		// };

// 		// transporter.sendMail(mailOption, (error, res) => {
// 		// 	if (error) {
// 		// 		return new Error(error);
// 		// 	} else {
// 		// 		res.sendStatus(201).send(`email sent to ${email}!`);
// 		// 	}
// 		// 	transporter.close();
// 		// });
// 	}).catch(function onError(error) {
// 		if (error.status === 400) {
// 			res.send({ error: 'Bad request, often due to missing a required parameter.' });
// 		} else if (error.status === 401) {
// 			res.send({ error: 'No valid API key provided.' });
// 		} else if (error.status === 404) {
// 			res.send({ error: 'The requested resource doesn\'t exist.' });
// 		} else if (error.status === 500) {
// 			res.send({ error: 'Purchase Failed' });
// 		}
// 	});
// });
// router.post('/tickets/pmmbrunch/5', (req, res) => {
// 	let token = req.body.id;
// 	let email = req.body.email;
// 	let name = req.body.card.name;

// 	return stripe.customers.create({
// 		source: token,
// 		email: email,
// 	}).then((customer) => {
// 		stripe.charges.create({
// 			amount: 1000,
// 			currency: 'usd',
// 			description: 'For PMM Weekend Karaoke Party - 1 ticket',
// 			customer: customer.id,
// 			receipt_email: customer.email,
// 		});
// 	}).then((charge) => {
// 		res.send(charge);
// 		// //SENDING email
// 		// let mailOption = {
// 		// 	from: 'fenderson.joseph@gmail.com',
// 		// 	to: `${name} <${email}>`,
// 		// 	subject: 'PMM Weekend Purchase',
// 		// 	text: 'Thank you for you Payment..See you at PMM Weekend!'
// 		// };

// 		// transporter.sendMail(mailOption, (error, res) => {
// 		// 	if (error) {
// 		// 		return new Error(error);
// 		// 	} else {
// 		// 		res.sendStatus(201).send(`email sent to ${email}!`);
// 		// 	}
// 		// 	transporter.close();
// 		// });
// 	}).catch(function onError(error) {
// 		if (error.status === 400) {
// 			res.send({ error: 'Bad request, often due to missing a required parameter.' });
// 		} else if (error.status === 401) {
// 			res.send({ error: 'No valid API key provided.' });
// 		} else if (error.status === 404) {
// 			res.send({ error: 'The requested resource doesn\'t exist.' });
// 		} else if (error.status === 500) {
// 			res.send({ error: 'Purchase Failed' });
// 		}
// 	});
// });
// //-----------------------------------------------------------------

// //PMM CHILD
// router.post('/tickets/chld/1', (req, res) => {
// 	let token = req.body.id;
// 	let email = req.body.email;
// 	let name = req.body.card.name;

// 	return stripe.customers.create({
// 		source: token,
// 		email: email,
// 	}).then((customer) => {
// 		stripe.charges.create({
// 			amount: 1000,
// 			currency: 'usd',
// 			description: 'For PMM Weekend Karaoke Party - 1 ticket',
// 			customer: customer.id,
// 			receipt_email: customer.email,
// 		});
// 	}).then((charge) => {
// 		res.send(charge);
// 		// //SENDING email
// 		// let mailOption = {
// 		// 	from: 'fenderson.joseph@gmail.com',
// 		// 	to: `${name} <${email}>`,
// 		// 	subject: 'PMM Weekend Purchase',
// 		// 	text: 'Thank you for you Payment..See you at PMM Weekend!'
// 		// };

// 		// transporter.sendMail(mailOption, (error, res) => {
// 		// 	if (error) {
// 		// 		return new Error(error);
// 		// 	} else {
// 		// 		res.sendStatus(201).send(`email sent to ${email}!`);
// 		// 	}
// 		// 	transporter.close();
// 		// });
// 	}).catch(function onError(error) {
// 		if (error.status === 400) {
// 			res.send({ error: 'Bad request, often due to missing a required parameter.' });
// 		} else if (error.status === 401) {
// 			res.send({ error: 'No valid API key provided.' });
// 		} else if (error.status === 404) {
// 			res.send({ error: 'The requested resource doesn\'t exist.' });
// 		} else if (error.status === 500) {
// 			res.send({ error: 'Purchase Failed' });
// 		}
// 	});
// });
// router.post('/tickets/chld/2', (req, res) => {
// 	let token = req.body.id;
// 	let email = req.body.email;
// 	let name = req.body.card.name;

// 	return stripe.customers.create({
// 		source: token,
// 		email: email,
// 	}).then((customer) => {
// 		stripe.charges.create({
// 			amount: 1000,
// 			currency: 'usd',
// 			description: 'For PMM Weekend Karaoke Party - 1 ticket',
// 			customer: customer.id,
// 			receipt_email: customer.email,
// 		});
// 	}).then((charge) => {
// 		res.send(charge);
// 		// //SENDING email
// 		// let mailOption = {
// 		// 	from: 'fenderson.joseph@gmail.com',
// 		// 	to: `${name} <${email}>`,
// 		// 	subject: 'PMM Weekend Purchase',
// 		// 	text: 'Thank you for you Payment..See you at PMM Weekend!'
// 		// };

// 		// transporter.sendMail(mailOption, (error, res) => {
// 		// 	if (error) {
// 		// 		return new Error(error);
// 		// 	} else {
// 		// 		res.sendStatus(201).send(`email sent to ${email}!`);
// 		// 	}
// 		// 	transporter.close();
// 		// });
// 	}).catch(function onError(error) {
// 		if (error.status === 400) {
// 			res.send({ error: 'Bad request, often due to missing a required parameter.' });
// 		} else if (error.status === 401) {
// 			res.send({ error: 'No valid API key provided.' });
// 		} else if (error.status === 404) {
// 			res.send({ error: 'The requested resource doesn\'t exist.' });
// 		} else if (error.status === 500) {
// 			res.send({ error: 'Purchase Failed' });
// 		}
// 	});
// });
// router.post('/tickets/chld/3', (req, res) => {
// 	let token = req.body.id;
// 	let email = req.body.email;
// 	let name = req.body.card.name;

// 	return stripe.customers.create({
// 		source: token,
// 		email: email,
// 	}).then((customer) => {
// 		stripe.charges.create({
// 			amount: 1000,
// 			currency: 'usd',
// 			description: 'For PMM Weekend Karaoke Party - 1 ticket',
// 			customer: customer.id,
// 			receipt_email: customer.email,
// 		});
// 	}).then((charge) => {
// 		res.send(charge);
// 		// //SENDING email
// 		// let mailOption = {
// 		// 	from: 'fenderson.joseph@gmail.com',
// 		// 	to: `${name} <${email}>`,
// 		// 	subject: 'PMM Weekend Purchase',
// 		// 	text: 'Thank you for you Payment..See you at PMM Weekend!'
// 		// };

// 		// transporter.sendMail(mailOption, (error, res) => {
// 		// 	if (error) {
// 		// 		return new Error(error);
// 		// 	} else {
// 		// 		res.sendStatus(201).send(`email sent to ${email}!`);
// 		// 	}
// 		// 	transporter.close();
// 		// });
// 	}).catch(function onError(error) {
// 		if (error.status === 400) {
// 			res.send({ error: 'Bad request, often due to missing a required parameter.' });
// 		} else if (error.status === 401) {
// 			res.send({ error: 'No valid API key provided.' });
// 		} else if (error.status === 404) {
// 			res.send({ error: 'The requested resource doesn\'t exist.' });
// 		} else if (error.status === 500) {
// 			res.send({ error: 'Purchase Failed' });
// 		}
// 	});
// });
// //-----------------------------------------------------------------

// //PMM BUNDLE
// router.post('/tickets/bundle/1', (req, res) => {
// 	let token = req.body.id;
// 	let email = req.body.email;
// 	let name = req.body.card.name;

// 	return stripe.customers.create({
// 		source: token,
// 		email: email,
// 	}).then((customer) => {
// 		stripe.charges.create({
// 			amount: 1000,
// 			currency: 'usd',
// 			description: 'For PMM Weekend Karaoke Party - 1 ticket',
// 			customer: customer.id,
// 			receipt_email: customer.email,
// 		});
// 	}).then((charge) => {
// 		res.send(charge);
// 		// //SENDING email
// 		// let mailOption = {
// 		// 	from: 'fenderson.joseph@gmail.com',
// 		// 	to: `${name} <${email}>`,
// 		// 	subject: 'PMM Weekend Purchase',
// 		// 	text: 'Thank you for you Payment..See you at PMM Weekend!'
// 		// };

// 		// transporter.sendMail(mailOption, (error, res) => {
// 		// 	if (error) {
// 		// 		return new Error(error);
// 		// 	} else {
// 		// 		res.sendStatus(201).send(`email sent to ${email}!`);
// 		// 	}
// 		// 	transporter.close();
// 		// });
// 	}).catch(function onError(error) {
// 		if (error.status === 400) {
// 			res.send({ error: 'Bad request, often due to missing a required parameter.' });
// 		} else if (error.status === 401) {
// 			res.send({ error: 'No valid API key provided.' });
// 		} else if (error.status === 404) {
// 			res.send({ error: 'The requested resource doesn\'t exist.' });
// 		} else if (error.status === 500) {
// 			res.send({ error: 'Purchase Failed' });
// 		}
// 	});
// });
// router.post('/tickets/bundle/2', (req, res) => {
// 	let token = req.body.id;
// 	let email = req.body.email;
// 	let name = req.body.card.name;

// 	return stripe.customers.create({
// 		source: token,
// 		email: email,
// 	}).then((customer) => {
// 		stripe.charges.create({
// 			amount: 1000,
// 			currency: 'usd',
// 			description: 'For PMM Weekend Karaoke Party - 1 ticket',
// 			customer: customer.id,
// 			receipt_email: customer.email,
// 		});
// 	}).then((charge) => {
// 		res.send(charge);
// 		// //SENDING email
// 		// let mailOption = {
// 		// 	from: 'fenderson.joseph@gmail.com',
// 		// 	to: `${name} <${email}>`,
// 		// 	subject: 'PMM Weekend Purchase',
// 		// 	text: 'Thank you for you Payment..See you at PMM Weekend!'
// 		// };

// 		// transporter.sendMail(mailOption, (error, res) => {
// 		// 	if (error) {
// 		// 		return new Error(error);
// 		// 	} else {
// 		// 		res.sendStatus(201).send(`email sent to ${email}!`);
// 		// 	}
// 		// 	transporter.close();
// 		// });
// 	}).catch(function onError(error) {
// 		if (error.status === 400) {
// 			res.send({ error: 'Bad request, often due to missing a required parameter.' });
// 		} else if (error.status === 401) {
// 			res.send({ error: 'No valid API key provided.' });
// 		} else if (error.status === 404) {
// 			res.send({ error: 'The requested resource doesn\'t exist.' });
// 		} else if (error.status === 500) {
// 			res.send({ error: 'Purchase Failed' });
// 		}
// 	});
// });
// router.post('/tickets/bundle/3', (req, res) => {
// 	let token = req.body.id;
// 	let email = req.body.email;
// 	let name = req.body.card.name;

// 	return stripe.customers.create({
// 		source: token,
// 		email: email,
// 	}).then((customer) => {
// 		stripe.charges.create({
// 			amount: 1000,
// 			currency: 'usd',
// 			description: 'For PMM Weekend Karaoke Party - 1 ticket',
// 			customer: customer.id,
// 			receipt_email: customer.email,
// 		});
// 	}).then((charge) => {
// 		res.send(charge);
// 		// //SENDING email
// 		// let mailOption = {
// 		// 	from: 'fenderson.joseph@gmail.com',
// 		// 	to: `${name} <${email}>`,
// 		// 	subject: 'PMM Weekend Purchase',
// 		// 	text: 'Thank you for you Payment..See you at PMM Weekend!'
// 		// };

// 		// transporter.sendMail(mailOption, (error, res) => {
// 		// 	if (error) {
// 		// 		return new Error(error);
// 		// 	} else {
// 		// 		res.sendStatus(201).send(`email sent to ${email}!`);
// 		// 	}
// 		// 	transporter.close();
// 		// });
// 	}).catch(function onError(error) {
// 		if (error.status === 400) {
// 			res.send({ error: 'Bad request, often due to missing a required parameter.' });
// 		} else if (error.status === 401) {
// 			res.send({ error: 'No valid API key provided.' });
// 		} else if (error.status === 404) {
// 			res.send({ error: 'The requested resource doesn\'t exist.' });
// 		} else if (error.status === 500) {
// 			res.send({ error: 'Purchase Failed' });
// 		}
// 	});
// });
// //-----------------------------------------------------------------

// //PMM TENT SPACE
// router.post('/tickets/tntsp/1', (req, res) => {
// 	let token = req.body.id;
// 	let email = req.body.email;
// 	let name = req.body.card.name;

// 	return stripe.customers.create({
// 		source: token,
// 		email: email,
// 	}).then((customer) => {
// 		stripe.charges.create({
// 			amount: 12000,
// 			currency: 'usd',
// 			description: 'For PMM Weekend - 1 tent space',
// 			customer: customer.id,
// 			receipt_email: customer.email,
// 		});
// 	}).then((charge) => {
// 		res.send(charge);

// 		// let mailOption = {
// 		// 	from: 'fenderson.joseph@gmail.com',
// 		// 	to: `${name} <${email}>`,
// 		// 	subject: 'PMM Weekend Purchase',
// 		// 	text: 'Thank you for you Payment..See you at PMM Weekend!'
// 		// };

// 		// transporter.sendMail(mailOption, (error, res) => {
// 		// 	if (error) {
// 		// 		return new Error(error);
// 		// 	} else {
// 		// 		res.sendStatus(201).send(`email sent to ${email}!`);
// 		// 	}
// 		// 	transporter.close();
// 		// });
// 	})
// 		.catch(function onError(error) {
// 			if (error.status === 400) {
// 				res.send({ error: 'Bad request, often due to missing a required parameter.' });
// 			} else if (error.status === 401) {
// 				res.send({ error: 'No valid API key provided.' });
// 			} else if (error.status === 404) {
// 				res.send({ error: 'The requested resource doesn\'t exist.' });
// 			} else if (error.status === 500) {
// 				res.send({ error: 'Purchase Failed' });
// 			}
// 		});
// });
// router.post('/tickets/tntsp/2', (req, res) => {
// 	let token = req.body.id;
// 	let email = req.body.email;
// 	let name = req.body.card.name;

// 	return stripe.customers.create({
// 		source: token,
// 		email: email,
// 	}).then((customer) => {
// 		stripe.charges.create({
// 			amount: 24000,
// 			currency: 'usd',
// 			description: 'For PMM Weekend - 2 tent spaces',
// 			customer: customer.id,
// 			receipt_email: customer.email,
// 		});
// 	}).then((charge) => {
// 		res.send(charge);

// 		// let mailOption = {
// 		// 	from: 'fenderson.joseph@gmail.com',
// 		// 	to: `${name} <${email}>`,
// 		// 	subject: 'PMM Weekend Purchase',
// 		// 	text: 'Thank you for you Payment..See you at PMM Weekend!'
// 		// };

// 		// transporter.sendMail(mailOption, (error, res) => {
// 		// 	if (error) {
// 		// 		return new Error(error);
// 		// 	} else {
// 		// 		res.sendStatus(201).send(`email sent to ${email}!`);
// 		// 	}
// 		// 	transporter.close();
// 		// });
// 	})
// 		.catch(function onError(error) {
// 			if (error.status === 400) {
// 				res.send({ error: 'Bad request, often due to missing a required parameter.' });
// 			} else if (error.status === 401) {
// 				res.send({ error: 'No valid API key provided.' });
// 			} else if (error.status === 404) {
// 				res.send({ error: 'The requested resource doesn\'t exist.' });
// 			} else if (error.status === 500) {
// 				res.send({ error: 'Purchase Failed' });
// 			}
// 		});

// });
// router.post('/tickets/tntsp/3', (req, res) => {
// 	let token = req.body.id;
// 	let email = req.body.email;
// 	let name = req.body.card.name;

// 	return stripe.customers.create({
// 		source: token,
// 		email: email,
// 	}).then((customer) => {
// 		stripe.charges.create({
// 			amount: 36000,
// 			currency: 'usd',
// 			description: 'For PMM Weekend - 3 tent spaces',
// 			customer: customer.id,
// 			receipt_email: customer.email,
// 		});
// 	}).then((charge) => {
// 		res.send(charge);

// 		// let mailOption = {
// 		// 	from: 'fenderson.joseph@gmail.com',
// 		// 	to: `${name} <${email}>`,
// 		// 	subject: 'PMM Weekend Purchase',
// 		// 	text: 'Thank you for you Payment..See you at PMM Weekend!'
// 		// };

// 		// transporter.sendMail(mailOption, (error, res) => {
// 		// 	if (error) {
// 		// 		return new Error(error);
// 		// 	} else {
// 		// 		res.sendStatus(201).send(`email sent to ${email}!`);
// 		// 	}
// 		// 	transporter.close();
// 		// });
// 	})
// 		.catch(function onError(error) {
// 			if (error.status === 400) {
// 				res.send({ error: 'Bad request, often due to missing a required parameter.' });
// 			} else if (error.status === 401) {
// 				res.send({ error: 'No valid API key provided.' });
// 			} else if (error.status === 404) {
// 				res.send({ error: 'The requested resource doesn\'t exist.' });
// 			} else if (error.status === 500) {
// 				res.send({ error: 'Purchase Failed' });
// 			}
// 		});
// });

// router.post('/tickets/pmmtotal', (req, res) => {
// 	let token = req.body.id;
// 	let email = req.body.email;
// 	let name = req.body.card.name;

// 	return stripe.customers.create({
// 		source: token,
// 		email: email,
// 	}).then((customer) => {
// 		stripe.charges.create({
// 			amount: 36000,
// 			currency: 'usd',
// 			description: 'For PMM Weekend - 3 tent spaces',
// 			customer: customer.id,
// 			receipt_email: customer.email,
// 		});
// 	}).then((charge) => {
// 		res.send(charge);

// 		// let mailOption = {
// 		// 	from: 'fenderson.joseph@gmail.com',
// 		// 	to: `${name} <${email}>`,
// 		// 	subject: 'PMM Weekend Purchase',
// 		// 	text: 'Thank you for you Payment..See you at PMM Weekend!'
// 		// };

// 		// transporter.sendMail(mailOption, (error, res) => {
// 		// 	if (error) {
// 		// 		return new Error(error);
// 		// 	} else {
// 		// 		res.sendStatus(201).send(`email sent to ${email}!`);
// 		// 	}
// 		// 	transporter.close();
// 		// });
// 	})
// 		.catch(function onError(error) {
// 			if (error.status === 400) {
// 				res.send({ error: 'Bad request, often due to missing a required parameter.' });
// 			} else if (error.status === 401) {
// 				res.send({ error: 'No valid API key provided.' });
// 			} else if (error.status === 404) {
// 				res.send({ error: 'The requested resource doesn\'t exist.' });
// 			} else if (error.status === 500) {
// 				res.send({ error: 'Purchase Failed' });
// 			}
// 		});
// });

export default router;

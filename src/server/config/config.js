const braintree = require('braintree');

module.exports = {
  port: 5000,
  fireBasePrivateKeyPath: "../../../pmmweekend2020ServiceAccountKey'",
  firebaseStorageBucketURL: "gs://pmmweekend2020.appspot.com",
  firebaseDatabaseURL: "https://pmmweekend2020.firebaseio.com",
  gateway: braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCH_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY
  })
};


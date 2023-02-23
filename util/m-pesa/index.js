const Mpesa = require('mpesa-node');
const MGangie = new Mpesa({
  consumerKey: process.env.CONSUMER_KEY,
  consumerSecret: process.env.CONSUMER_SECRET,
  environment: process.env.ENVIRONMENT,
  shortCode: process.env.SHORT_CODE,
  initiatorName: process.env.INITIATOR_NAME,
  lipaNaMpesaShortCode: process.env.LIPA_NA_MPESA_SHORT_CODE,
  lipaNaMpesaShortPass: process.env.LIPA_NA_MPESA_SHORT_PASS,
  securityCredential: process.env.SECURITY_CREDENTIAL,
  //certPath: path.resolve(process.env.CERT_PATH)
});

export default MGangie;


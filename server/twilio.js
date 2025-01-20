require('dotenv').config();


const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;
const toNumber = '+918840110024';  // Replace with the actual recipient phone number


const client = new twilio(accountSid, authToken);

client.messages
  .create({
    body: 'Hello, this is a message sent using Twilio!',
    from: fromNumber,
    to: toNumber,
  })
  .then((message) => console.log('Message sent with SID:', message.sid))
  .catch((error) => console.error('Error sending message:', error));

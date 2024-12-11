require('dotenv').config();
const express = require('express');
const twilio = require('twilio');
const app = express();
app.use(express.json());

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const twilioClient = twilio(accountSid, authToken);

const registerParcel = (parcelData) => {
  console.log('Parcel data:', parcelData); 
  return true;
};
app.post('/registerParcel', async (req, res) => {
  const parcelData = req.body;

  try {
    const success = registerParcel(parcelData);
    if (!success) {
      throw new Error('Failed to register parcel');
    }

    const senderPhone = "+918840110024";
    const message = `Parcel with ID: ${parcelData.parcelId} has been registered successfully.`;

    const response = await twilioClient.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: senderPhone,
    });
    
    console.log('Twilio response:', response.sid);
    res.status(200).json({ message: 'Parcel registered successfully and message sent.' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to register parcel or send message.' });
  }
});

app.listen(8000, () => {
  console.log('Server is running on port 8000');
});

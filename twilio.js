const twilio = require('twilio');

// Twilio SMS Configuration
const twilioClient = twilio('AC8d2f09b199b9ab2224cf3bd5d48c5cfc', 'c78db7e3d9729a45b8ff331855e67840');

function sendTestSMS() {
    console.log("Attempting to send SMS...");

    twilioClient.messages.create({
        body: 'Test SMS from Twilio',
        from: '+12185208337', // Replace with your Twilio phone number
        to: '+919176012603' // Replace with the recipient's phone number, including country code (+91 for India)
    })
    .then((message) => {
        console.log('SMS sent successfully.');
        console.log(`Message SID: ${message.sid}`);
    })
    .catch((err) => {
        console.error('Error sending SMS:', err.message);
        console.log('Error details:', err);
    });
}

sendTestSMS();

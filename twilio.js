const twilio = require('twilio');

// Twilio SMS Configuration
const twilioClient = twilio('', '');//set your own secret key

function sendTestSMS() {
    console.log("Attempting to send SMS...");

    twilioClient.messages.create({
        body: 'Test SMS from Twilio',
        from: '', // Replace with your Twilio phone number
        to: '' // Replace with the recipient's phone number, including country code (+91 for India)
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

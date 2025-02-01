const nodemailer = require('nodemailer');
const fs = require('fs');
const chokidar = require('chokidar');
const twilio = require('twilio');

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail', // Change if using a different email service
    auth: {
        user: 'mk458557@gmail.com', // Your admin email
        pass: 'ylyb cuyt cqvd zfst' // Your email password or app-specific password
    }
});

// Twilio SMS Configuration
const twilioClient = twilio('AC8d2f09b199b9ab2224cf3bd5d48c5cfc', 'c78db7e3d9729a45b8ff331855e67840');

// Watch Cowrie log file
const logFilePath = 'C:\\Users\\manoj\\OneDrive\\Desktop\\final honeypot ver 33\\cowrie\\var\\log\\cowrie\\cowrie.json';

// Function to send SMS alert
function sendSMSAlert(message) {
    console.log("Attempting to send SMS..."); // Log the attempt

    twilioClient.messages.create({
        body: message,
        from: '+12185208337', // Replace with your Twilio phone number
        to: '+919176012603' // Replace with the recipient's phone number, including country code (+91 for India)
    })
    .then((message) => {
        console.log(`SMS alert sent: ${message.sid}`);
    })
    .catch((err) => {
        // Log the error if the SMS fails
        console.error('Error sending SMS:', err.message);
        console.log('Error details:', err); // Log complete error details
    });
}

// Function to send HTML email with formatted UI
function sendEmailAlert(emailData) {
    const mailOptions = {
        from: '"Cowrie Honeypot" <admin_email@example.com>',
        to: 'manojk82580@gmail.com', // Admin email address
        subject: 'SSH Honeypot Alert: Unauthorized Access Attempt',
        html: `
            <html>
                <body style="font-family: Arial, sans-serif; background-color: #f4f4f9; padding: 20px;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: white; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                        <h2 style="color: #ff4444; text-align: center;">Alert! Unauthorized SSH Access Attempt</h2>
                        <p><strong>IP:</strong> ${emailData.ip}</p>
                        <p><strong>Port:</strong> ${emailData.port}</p>
                        <p><strong>Time:</strong> ${emailData.time}</p>
                        <p><strong>Message:</strong> ${emailData.message}</p>
                        <hr>
                        <p style="color: #777; text-align: center;">This is an automated alert from your Cowrie Honeypot.</p>
                    </div>
                </body>
            </html>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.error('Error sending email:', error);
        }
        console.log('Alert email sent:', info.response);
    });
}

// Watch for changes in the log file with polling every 3 seconds
chokidar.watch(logFilePath, {
    persistent: true,
    usePolling: true,
    interval: 3000 // Check every 3 seconds
}).on('change', (path) => {
    console.log(`Log file updated: ${path}`);
    
    // Read the latest entry in the log file
    fs.readFile(logFilePath, 'utf8', (err, data) => {
        if (err) {
            return console.error('Error reading log file:', err);
        }
        
        // Split the log file by line and filter out empty lines
        const logs = data.split('\n').filter(Boolean).map(line => {
            try {
                return JSON.parse(line); // Try parsing each line as JSON
            } catch (parseError) {
                console.error('Error parsing log line:', parseError);
                return null;
            }
        }).filter(Boolean); // Remove any null values from the map
        
        // If there are logs to process
        if (logs.length > 0) {
            const lastLog = logs[logs.length - 1];
            console.log('Last log:', lastLog);
            
            if (lastLog && (lastLog.eventid === 'cowrie.session.connect' || lastLog.eventid === 'cowrie.session.closed')) {
                const emailData = {
                    ip: lastLog.src_ip,
                    port: lastLog.src_port || 'N/A',
                    time: lastLog.timestamp,
                    message: lastLog.message || 'No message provided'
                };

                console.log('Sending alert:', emailData);
                
                // Send email alert without severity levels
                sendEmailAlert(emailData);

                // Send SMS alert for session connection events
                if (lastLog.eventid === 'cowrie.session.connect') {
                    const smsMessage = `Alert: Unauthorized SSH access attempt from IP: ${lastLog.src_ip}`;
                    sendSMSAlert(smsMessage);
                }
            } else {
                console.log('No relevant event detected.');
            }
        } else {
            console.log('No valid logs found.');
        }
    });
});

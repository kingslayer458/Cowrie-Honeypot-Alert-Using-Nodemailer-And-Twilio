const nodemailer = require('nodemailer');
const fs = require('fs');
const chokidar = require('chokidar');
const twilio = require('twilio');

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail', // Change if using a different email service
    auth: {
        user: '', // Your admin email
        pass: '' // Your email password or app-specific password
    }
});

// Twilio SMS Configuration
const twilioClient = twilio('', '');//set your own secret key

// Watch Cowrie log file
const logFilePath = '';//set your own path

// To track the last session ID that was alerted
let lastSessionID = '';

// Function to send SMS alert
function sendSMSAlert(message) {
    twilioClient.messages.create({
        body: message,
        from: '', // Replace with your Twilio phone number
        to: '' // Replace with the recipient's phone number, including country code (+91 for India)
    })
    .then(message => {
        console.log(`SMS alert sent: ${message.sid}`);
    })
    .catch(err => {
        console.error('Error sending SMS:', err.message); // Log the error message
    });
}

// Function to send HTML email with formatted UI
function sendEmailAlert(emailData) {
    const mailOptions = {
        from: '"Cowrie Honeypot" <admin_email@example.com>',
        to: '', // Admin email address
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
                // Avoid sending duplicate alerts for the same session ID
                if (lastLog.session === lastSessionID) {
                    return; // Skip processing if this session has already been alerted
                }
                lastSessionID = lastLog.session; // Update last session ID
                
                const emailData = {
                    ip: lastLog.src_ip,
                    port: lastLog.src_port || 'N/A',
                    time: lastLog.timestamp,
                    message: lastLog.message || 'No message provided'
                };

                console.log('Sending alert:', emailData);
                
                // Send email alert
                sendEmailAlert(emailData);

                // Send SMS alert for both session connect and session closed events
                const smsMessage = `Alert: SSH event ${lastLog.eventid} from IP: ${lastLog.src_ip}`;
                sendSMSAlert(smsMessage);
            } else {
                console.log('No relevant event detected.');
            }
        } else {
            console.log('No valid logs found.');
        }
    });
});

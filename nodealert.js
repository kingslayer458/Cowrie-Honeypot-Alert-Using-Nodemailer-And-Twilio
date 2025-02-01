const nodemailer = require('nodemailer');
const fs = require('fs');
const chokidar = require('chokidar');

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail', // Change if using a different email service
    auth: {
        user: '', // Your admin email
        pass: '' // Your email password or app-specific password
    }
});

// Watch Cowrie log file
const logFilePath = 'C:\set your own path\\cowrie\\var\\log\\cowrie\\cowrie.json';

// Function to send email
function sendAlert(emailData) {
    const mailOptions = {
        from: '"Cowrie Honeypot" <admin_email@example.com>', // Sender address
        to: 'manojk82580@gmail.com', // Admin email address
        subject: 'SSH Honeypot Alert: Unauthorized Access Attempt',
        text: `Alert! An unauthorized SSH access attempt was detected.\n\nDetails:\n${emailData}`,
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
    usePolling: true, // Enable polling
    interval: 3000 // Check every 3 seconds
}).on('change', (path) => {
    console.log(`Log file updated: ${path}`);
    
    // Read the latest entry in the log file
    fs.readFile(logFilePath, 'utf8', (err, data) => {
        if (err) {
            return console.error('Error reading log file:', err);
        }
        
        // Debugging: Check the raw log data
        console.log('Raw log data:', data);
        
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
            
            // Check for both connect and closed events
            if (lastLog && (lastLog.eventid === 'cowrie.session.connect' || lastLog.eventid === 'cowrie.session.closed')) {
                const port = lastLog.src_port ? lastLog.src_port : 'Port not available';

                const alertData = `IP: ${lastLog.src_ip}\nPort: ${port}\nTime: ${lastLog.timestamp}\nMessage: ${lastLog.message}`;
                console.log('Sending alert for:', alertData);
                sendAlert(alertData);
            } else {
                console.log('No relevant event detected.');
            }
        } else {
            console.log('No valid logs found.');
        }
    });
});

//pm2 start nodealert.js

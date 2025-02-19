# Cowrie-Honeypot-Alert-Using-Nodemailer-And-Twilio

---
# 🛡️ Cowrie Honeypot Alert System

## 📌 Overview
This project is a **Cowrie SSH Honeypot Alert System** that monitors unauthorized access attempts and sends **email and SMS alerts** using **Nodemailer and Twilio**.

🚀 **Key Features:**
- **Monitors** Cowrie honeypot logs in real-time
- **Sends email alerts** for SSH connection attempts
- **Sends SMS alerts** for unauthorized access
- **Uses Chokidar** to watch log file updates
- **Formatted UI** in email notifications

## 🎯 Why Use This?
If you're running a Cowrie honeypot, this script helps you:
✅ Detect unauthorized access attempts
✅ Get instant notifications via Email & SMS
✅ Take quick action against attackers
✅ Improve security monitoring

---

## 🛠️ Setup Guide
Follow these steps to set up and run the Cowrie Honeypot Alert System.

### 1️⃣ Install Required Dependencies
Ensure **Node.js** is installed on your system, then run:
```sh
npm install nodemailer chokidar twilio fs
```

### 2️⃣ Configure the Script
Edit the **index.js** file and update the following:

#### 🔹 Email Configuration
Replace these placeholders with your **Gmail** credentials:
```js
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-app-password'
    }
});
```
**Note:** If using **Gmail**, enable "Less Secure Apps" or generate an **App Password**.

#### 🔹 Twilio SMS Configuration
Create a Twilio account and get **Account SID & Auth Token**. Then update:
```js
const twilioClient = twilio('YOUR_TWILIO_SID', 'YOUR_TWILIO_AUTH_TOKEN');
```
Set the **Twilio sender number** and your **phone number**:
```js
twilioClient.messages.create({
    from: 'YOUR_TWILIO_PHONE_NUMBER',
    to: 'YOUR_PHONE_NUMBER',
    body: 'Alert Message'
});
```

#### 🔹 Cowrie Log File Path
Set the correct path for your **Cowrie log file**:
```js
const logFilePath = '/path/to/cowrie/log.json';
```

### 3️⃣ Run the Script
Start the script with:
```sh
node nodealert.js
```
It will continuously watch the **Cowrie log file** and send alerts whenever unauthorized access is detected.

---

## 📩 Email Alert UI
The email alert comes with a **well-structured HTML format** for easy readability.

### 📧 Sample Email UI
🔹 **Subject:** SSH Honeypot Alert: Unauthorized Access Attempt

![Email UI](https://via.placeholder.com/600x300?text=Email+Alert+UI)

🔹 **Email Body:**
```html
<div style="max-width: 600px; background: #fff; padding: 20px; border-radius: 8px;">
    <h2 style="color: #ff4444;">⚠️ Alert! Unauthorized SSH Access Attempt</h2>
    <p><strong>IP:</strong> 192.168.1.100</p>
    <p><strong>Port:</strong> 22</p>
    <p><strong>Time:</strong> 2024-01-01 12:34:56</p>
    <p><strong>Message:</strong> SSH login attempt detected.</p>
</div>
```

---

## 📱 SMS Alert
You'll receive a **real-time SMS** alert like this:
```
Alert: SSH event cowrie.session.connect from IP: 192.168.1.100
```

---

## 🔥 Enhancements & Future Updates
✅ Web dashboard for log monitoring
✅ Integration with Telegram alerts
✅ Auto-blocking of malicious IPs

---

## ⚠️ Disclaimer
This script is for **security monitoring only**. Ensure you have the **necessary permissions** before running a honeypot.

🚀 **Secure your network and stay ahead of attackers!**


```md

# 🚀 Running `nodealert3.js` with PM2

PM2 is a process manager for Node.js applications that allows you to keep your script running in the background, restart it automatically on failures, and manage logs efficiently.

---

## 📌 Prerequisites
Make sure you have **Node.js** and **npm** installed. If not, download them from [nodejs.org](https://nodejs.org/).

You also need to have **PM2** installed globally:

```sh
npm install -g pm2
```

---

## ▶️ Start the Script with PM2

To run `nodealert3.js` in the background, use:

```sh
pm2 start nodealert3.js
```

This will start the script and keep it running in the background.

---

## 🔍 Useful PM2 Commands

Here are some common PM2 commands you might need:

| Command | Description |
|---------|------------|
| `pm2 list` | View all running processes |
| `pm2 logs nodealert3` | View logs for `nodealert3.js` |
| `pm2 restart nodealert3` | Restart the process |
| `pm2 stop nodealert3` | Stop the process |
| `pm2 delete nodealert3` | Remove the process from PM2 |

---

## 🔄 Auto Restart on System Reboot

To ensure `nodealert3.js` starts automatically after a system reboot, run:

```sh
pm2 startup
pm2 save
```

---

## 📖 More Information

For more details, visit the [PM2 documentation](https://pm2.keymetrics.io/).

---



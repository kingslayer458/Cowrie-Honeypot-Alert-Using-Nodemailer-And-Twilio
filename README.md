# Cowrie-Honeypot-Alert-Using-Nodemailer-And-Twilio

## Guide to set up this project will be available soon!!

---

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



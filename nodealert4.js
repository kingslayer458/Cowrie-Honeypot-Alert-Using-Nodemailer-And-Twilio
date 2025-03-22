const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const chokidar = require('chokidar');
const geoip = require('geoip-lite');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const logFilePath = 'C:\\Users\\manoj\\OneDrive\\Desktop\\final honeypot ver 33\\cowrie\\var\\log\\cowrie\\cowrie.json';

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Watch the log file for real-time updates
chokidar.watch(logFilePath, { persistent: true, usePolling: true, interval: 2000 })
    .on('change', () => {
        fs.readFile(logFilePath, 'utf8', (err, data) => {
            if (err) return console.error('Error reading log file:', err);
            
            const logs = data.split('\n').filter(Boolean).map(line => {
                try {
                    return JSON.parse(line);
                } catch (e) {
                    return null;
                }
            }).filter(Boolean);
            
            if (logs.length > 0) {
                const lastLog = logs[logs.length - 1];
                if (lastLog.eventid === 'cowrie.session.connect' || lastLog.eventid === 'cowrie.session.closed') {
                    const geo = geoip.lookup(lastLog.src_ip) || {};
                    io.emit('new_log', {
                        ip: lastLog.src_ip,
                        port: lastLog.src_port || 'N/A',
                        time: lastLog.timestamp,
                        event: lastLog.eventid,
                        country: geo.country || 'Unknown',
                        city: geo.city || 'Unknown'
                    });
                }
            }
        });
    });

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

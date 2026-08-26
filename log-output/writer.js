const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const filePath = '/usr/src/app/files/log.txt';
const storedHash = crypto.randomUUID();

const dir = path.dirname(filePath);
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

const writeLog = () => {
    const timestamp = new Date().toISOString();
    const logLine = `${timestamp}: ${storedHash}\n`;

    fs.appendFile(filePath, logLine, (err) => {
        if (err) console.error('Error writing to file:', err);
    });

    console.log(logLine.trim());
};

writeLog();
setInterval(writeLog, 5000);
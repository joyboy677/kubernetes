const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const filePath = path.join('/usr/src/app/files', 'log.txt');
const uuid = crypto.randomUUID();

setInterval(() => {
    const logLine = `${new Date().toISOString()}: ${uuid}`;
    fs.writeFileSync(filePath, logLine);
}, 5000);
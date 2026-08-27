const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const logPath = path.join('/usr/src/app/files', 'log.txt');
const pingPath = path.join('/usr/src/app/files', 'pingpong.txt');

app.get('/', (req, res) => {
    let logData = 'No log data yet';
    if (fs.existsSync(logPath)) {
        logData = fs.readFileSync(logPath, 'utf8').trim();
    }

    let pingCount = 0;
    if (fs.existsSync(pingPath)) {
        pingCount = fs.readFileSync(pingPath, 'utf8').trim();
    }

    res.setHeader('Content-Type', 'text/plain');
    res.send(`${logData}\nPing / Pongs: ${pingCount}`);
});

app.listen(port, () => {
    console.log(`Log reader server listening on port ${port}`);
});
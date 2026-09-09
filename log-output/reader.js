const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const logPath = path.join('/usr/src/app/files', 'log.txt');
const configFilePath = path.join('/usr/src/app/config', 'information.txt');
const pingUrl = `http://ping-pong-svc:${port}/`;
const pingHealthUrl = `http://ping-pong-svc:${port}/healthz`;
app.get('/', async (req, res) => {
    let fileContent = '';
    if (fs.existsSync(configFilePath)) {
        fileContent = fs.readFileSync(configFilePath, 'utf8').trim();
    }

    const envMessage = process.env.MESSAGE || '';

    let logData = 'No log data yet';
    if (fs.existsSync(logPath)) {
        logData = fs.readFileSync(logPath, 'utf8').trim();
    }

    let pingCount = '0';
    try {
        const response = await fetch(pingUrl);
        pingCount = await response.text();
    } catch (error) {
        console.error('Failed to fetch pongs:', error.message);
    }

    res.setHeader('Content-Type', 'text/plain');
    res.send(`file content: ${fileContent}\nenv variable: MESSAGE=${envMessage}\n${logData}\nPing / Pongs: ${pingCount}`);
});
app.get('/healthz', async (req, res) => {
    try {
        const response = await fetch(pingHealthUrl);
        if (response.ok) {
            return res.status(200).send('OK');
        }
        return res.status(500).send('Ping-pong service is not ready');
    } catch (error) {
        console.error('Failed to reach ping-pong service:', error.message);
        return res.status(500).send('Ping-pong service unreachable');
    }
});
app.listen(port, () => {
    console.log(`Log reader server listening on port ${port}`);
});
const express = require('express');
const crypto = require('crypto');

const app = express();
const port = process.env.PORT || 3000;
const storedHash = crypto.randomUUID();

app.get('/', (req, res) => {
    const timestamp = new Date().toISOString();
    res.send(`${timestamp}: ${storedHash}`);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

const logHash = () => {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp}: ${storedHash}`);
};

logHash();
setInterval(logHash, 5000);
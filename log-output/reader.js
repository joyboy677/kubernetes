const express = require('express');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;
const filePath = '/usr/src/app/files/log.txt';

app.get('/', (req, res) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(404).send('Log file not found yet');
        }
        res.type('text/plain').send(data);
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const filePath = path.join('/usr/src/app/files', 'pingpong.txt');

let counter = 0;

app.get('/pingpong', (req, res) => {
    counter++;

    fs.writeFileSync(filePath, counter.toString());

    res.send(`pong ${counter}`);
});

app.listen(port, () => {
    console.log(`Ping-pong app listening on port ${port}`);
});
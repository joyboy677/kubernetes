const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

let counter = 0;

app.get('/pingpong', (req, res) => {
    counter++;
    res.send(counter.toString());
});
app.listen(port, () => {
    console.log(`Ping-pong app listening on port ${port}`);
});
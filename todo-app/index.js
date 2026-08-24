const express = require('express');
const app = express();

const PORT = process.env.PORT;

app.get('/', (req, res) => {
    res.send('<h1>Hello, World! Express server is up and running.</h1>');
});

app.listen(PORT, () => {
    console.log(`Server started in port ${PORT}`);
});
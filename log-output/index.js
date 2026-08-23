const crypto = require('crypto');

const storedHash = crypto.randomUUID();

const logHash = () => {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp}: ${storedHash}`);
};

logHash();
setInterval(logHash, 5000);
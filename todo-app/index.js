const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

const directory = path.join(__dirname, 'files');
const imagePath = path.join(directory, 'image.jpg');
const timestampPath = path.join(directory, 'image_timestamp.txt');

if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
}

const TEN_MINUTES_MS = 10 * 60 * 1000;
let refreshing = false;

const fetchNewImage = async () => {
    try {
        const response = await axios.get('https://picsum.photos/1200', {
            responseType: 'arraybuffer',
        });
        fs.writeFileSync(imagePath, response.data);
        fs.writeFileSync(timestampPath, Date.now().toString());
        console.log('New image fetched and cached.');
    } catch (err) {
        console.error('Failed to fetch image:', err.message);
    }
};

const ensureValidImage = async () => {
    const exists = fs.existsSync(imagePath) && fs.existsSync(timestampPath);

    if (!exists) {
        await fetchNewImage();
        return;
    }

    const lastFetch = parseInt(fs.readFileSync(timestampPath, 'utf8'), 10);
    const isStale = Date.now() - lastFetch > TEN_MINUTES_MS;

    if (isStale && !refreshing) {
        console.log('Image is older than 10 minutes. Refreshing in background...');
        refreshing = true;
        fetchNewImage().finally(() => {
            refreshing = false;
        });
    }
};

app.get('/image.jpg', async (req, res) => {
    await ensureValidImage();
    res.sendFile(imagePath);
});

app.get('/', async (req, res) => {
    await ensureValidImage();
    res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Todo App</title>
        <style>
          body { font-family: sans-serif; margin: 2rem; }
          img { max-width: 400px; height: auto; border-radius: 8px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <h1>Todo App</h1>
        <div><img src="/image.jpg" alt="Picsum Hourly Image" /></div>
        <p>DevOps with Kubernetes 2026</p>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
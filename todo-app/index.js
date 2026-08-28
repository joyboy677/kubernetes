const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const TODO_BACKEND_URL = process.env.TODO_BACKEND_URL || 'http://localhost:3001';

app.use(express.urlencoded({ extended: true }));

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

app.post('/todos', async (req, res) => {
  const todo = req.body.todo;
  if (todo) {
    try {
      await axios.post(`${TODO_BACKEND_URL}/todos`, { todo });
    } catch (err) {
      console.error('Failed to send todo to backend:', err.message);
    }
  }
  res.redirect('/');
});

app.get('/', async (req, res) => {
  await ensureValidImage();

  let todos = [];
  try {
    const response = await axios.get(`${TODO_BACKEND_URL}/todos`);
    todos = response.data;
  } catch (err) {
    console.error('Failed to fetch todos from backend:', err.message);
  }

  const todoItems = todos
    .map(todo => `<li class="todo-item">${todo}</li>`)
    .join('\n');

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Todo App</title>
        <style>
          * { box-sizing: border-box; }

          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 2rem;
            background: #ffffff;
            color: #333;
          }

          .container {
            max-width: 600px;
            margin: 0 auto;
          }

          h1 {
            text-align: center;
            font-size: 2rem;
            margin-bottom: 1.5rem;
          }

          .image-wrapper {
            display: flex;
            justify-content: center;
            margin-bottom: 1.5rem;
          }

          .image-wrapper img {
            width: 180px;
            height: 180px;
            object-fit: cover;
            border-radius: 8px;
          }

          #todo-form {
            display: flex;
            gap: 0.75rem;
            margin-bottom: 2rem;
          }

          #todo-input {
            flex: 1;
            padding: 0.65rem 1rem;
            font-size: 0.95rem;
            border: 1px solid #4caf50;
            border-radius: 6px;
            outline: none;
          }

          #todo-input:focus {
            box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
          }

          button {
            padding: 0.65rem 1.5rem;
            font-size: 0.95rem;
            font-weight: 600;
            color: #fff;
            background: #4caf50;
            border: none;
            border-radius: 6px;
            cursor: pointer;
          }

          button:hover {
            background: #439a46;
          }

          h2 {
            text-align: center;
            font-size: 1.5rem;
            margin-bottom: 1rem;
          }

          #todo-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .todo-item {
            background: #fafafa;
            border-left: 4px solid #4caf50;
            padding: 0.9rem 1rem;
            margin-bottom: 0.6rem;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Todo App</h1>

          <div class="image-wrapper">
            <img src="/image.jpg" alt="Picsum Hourly Image" />
          </div>

          <form id="todo-form" action="/todos" method="POST">
            <input
              type="text"
              id="todo-input"
              name="todo"
              maxlength="140"
              placeholder="Enter a new todo (max 140 characters)"
              required
            />
            <button type="submit">Send</button>
          </form>

          <h2>Todos</h2>
          <ul id="todo-list">
            ${todoItems}
          </ul>
        </div>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
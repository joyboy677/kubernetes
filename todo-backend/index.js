const express = require('express');
const morgan = require('morgan');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;
const MAX_TODO_LENGTH = parseInt(process.env.MAX_TODO_LENGTH, 10) || 140;
let isHealthy = true;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const initDb = async () => {
    try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        text TEXT NOT NULL,
        done BOOLEAN NOT NULL DEFAULT false
      );
    `);

        await pool.query('ALTER TABLE todos ADD COLUMN IF NOT EXISTS done BOOLEAN NOT NULL DEFAULT false');

        const res = await pool.query('SELECT COUNT(*) FROM todos');
        if (parseInt(res.rows[0].count, 10) === 0) {
            await pool.query("INSERT INTO todos (text) VALUES ('Learn Kubernetes basics'), ('Deploy application to cluster'), ('Configure persistent volumes')");
        }
    } catch (err) {
        console.error(err);
    }
};
initDb();

app.get('/', (req, res) => {
    res.status(200).send('OK');
});

app.get('/healthz', async (req, res) => {
    if (!isHealthy) {
        return res.status(500).json({ status: 'unhealthy' });
    }

    try {
        await pool.query('SELECT 1');
        return res.status(200).json({ status: 'ok' });
    } catch (err) {
        console.error('Health check failed:', err.message);
        return res.status(500).json({ status: 'unhealthy' });
    }
});

app.post('/break', (req, res) => {
    isHealthy = false;
    res.status(200).json({ status: 'unhealthy' });
});

app.get('/todos', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, text, done FROM todos ORDER BY id');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/todos', async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: 'Missing or unparseable request body' });
    }

    const todoText = req.body.todo || req.body.text;

    if (!todoText || typeof todoText !== 'string' || todoText.trim() === '') {
        console.log(`REJECTED: Empty todo payload`);
        return res.status(400).json({ error: 'Todo item text is required' });
    }

    if (todoText.length > MAX_TODO_LENGTH) {
        console.log(`REJECTED: Todo length ${todoText.length} exceeds max ${MAX_TODO_LENGTH} - "${todoText}"`);
        return res.status(400).json({ error: `Todo item exceeds maximum ${MAX_TODO_LENGTH} characters` });
    }

    const newTodo = todoText.trim();

    try {
        const result = await pool.query(
            'INSERT INTO todos (text) VALUES ($1) RETURNING id, text, done',
            [newTodo]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/todos/:id', async (req, res) => {
    const id = Number.parseInt(req.params.id, 10);
    const { done } = req.body;

    if (!Number.isInteger(id) || typeof done !== 'boolean') {
        return res.status(400).json({ error: 'Todo id and boolean done value are required' });
    }

    try {
        const result = await pool.query(
            'UPDATE todos SET done = $1 WHERE id = $2 RETURNING id, text, done',
            [done, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        return res.json(result.rows[0]);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Todo Backend running on port ${PORT}`);
});

const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;
const MAX_TODO_LENGTH = parseInt(process.env.MAX_TODO_LENGTH, 10) || 140;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

app.use(express.json());

const initDb = async () => {
    try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        text TEXT NOT NULL
      );
    `);

        const res = await pool.query('SELECT COUNT(*) FROM todos');
        if (parseInt(res.rows[0].count, 10) === 0) {
            await pool.query("INSERT INTO todos (text) VALUES ('Learn Kubernetes basics'), ('Deploy application to cluster'), ('Configure persistent volumes')");
        }
    } catch (err) {
        console.error(err);
    }
};
initDb();

app.get('/todos', async (req, res) => {
    try {
        const result = await pool.query('SELECT text FROM todos');
        res.json(result.rows.map(row => row.text));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/todos', async (req, res) => {
    const todoText = req.body.todo || req.body.text;

    if (!todoText || typeof todoText !== 'string' || todoText.trim() === '') {
        return res.status(400).json({ error: 'Todo item text is required' });
    }

    if (todoText.length > MAX_TODO_LENGTH) {
        return res.status(400).json({ error: `Todo item exceeds maximum ${MAX_TODO_LENGTH} characters` });
    }

    const newTodo = todoText.trim();

    try {
        await pool.query('INSERT INTO todos (text) VALUES ($1)', [newTodo]);
        res.status(201).json(newTodo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Todo Backend running on port ${PORT}`);
});
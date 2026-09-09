const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

pool.query(`
  CREATE TABLE IF NOT EXISTS pings (id INT PRIMARY KEY, counter INT);
  INSERT INTO pings (id, counter) VALUES (1, 0) ON CONFLICT DO NOTHING;
`);

app.get('/', async (req, res) => {
    const result = await pool.query(
        'UPDATE pings SET counter = counter + 1 WHERE id = 1 RETURNING counter'
    );
    res.send(result.rows[0].counter.toString());
});

app.get('/healthz', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.status(200).send('OK');
    } catch (err) {
        console.error('Database connection failed:', err.message);
        res.status(500).send('Database connection failed');
    }
});
app.listen(port, () => {
    console.log(`Ping-pong app listening on port ${port}`);
});
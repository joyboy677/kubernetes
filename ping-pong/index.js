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

app.get('/pingpong', async (req, res) => {
    const result = await pool.query(
        'UPDATE pings SET counter = counter + 1 WHERE id = 1 RETURNING counter'
    );
    res.send(result.rows[0].counter.toString());
});

app.listen(port, () => {
    console.log(`Ping-pong app listening on port ${port}`);
});
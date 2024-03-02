const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

app.use(cors());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'customers',
  password: '12345',
  port: 5432,
});

app.get('/api/customers', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM customer');
    const customers = result.rows;
    client.release();
    res.json(customers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
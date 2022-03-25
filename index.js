// Environment
require('dotenv').config();

// Express 
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
const port = 3000;

// Postgres
const Pool = require('pg').Pool;

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASS,
  port: process.env.PG_PORT,
});

const get_rows = (req, res, query, params) => {
  console.dir([query, params]);
  pool.query(query, params, (err, rows) => {
    if (err) { res.status(400).json({'error': err }); }
    res.status(200).json({'rows': rows.rows});
  });
};

app.get('/builds', (req, res) => {
  get_rows(req, res, 'SELECT * from builds', []);
});

app.post('/builds-by-user', (req, res) => {
  const user_id = req.body.user_id;
  get_rows(req, res, 'SELECT * from builds WHERE user_id = $1 limit 100', [user_id]);
});

app.get('/averages', (req, res) => {
  get_rows(req, res, 'SELECT avg(duration), user_id from builds group by user_id', []);
});

app.listen(port, () => console.log(`xcmetrics-dashboard-api started on port ${port}`));

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
  const excluded_configuration = ["AND schema <> 'Clean Trainline' AND build_status = 'succeeded'"]
  get_rows(req, res, `SELECT day, schema, build_status, duration, user_id, category, was_suspended from builds WHERE was_suspended=False ${excluded_configuration}`, []);
});

app.get('/schemas', (req, res) => {
  const excluded_configuration = ["AND schema <> 'Clean Trainline' AND build_status = 'succeeded'"]
  get_rows(req, res, `SELECT DISTINCT schema from builds WHERE was_suspended=False ${excluded_configuration}`, []);
});

app.get('/user_id', (req, res) => {
  const excluded_configuration = ["AND schema <> 'Clean Trainline' AND build_status = 'succeeded'"]
  get_rows(req, res, `SELECT DISTINCT user_id from builds WHERE was_suspended=False ${excluded_configuration}`, []);
});

app.get('/categories', (req, res) => {
  const excluded_configuration = ["AND schema <> 'Clean Trainline' AND build_status = 'succeeded'"]
  get_rows(req, res, `SELECT DISTINCT category from builds WHERE was_suspended=False ${excluded_configuration}`, []);
});


app.get('/groupschema', (req, res) => {
  const excluded_configuration = ["AND schema <> 'Clean Trainline' AND build_status = 'succeeded'"]
  get_rows(req, res,
   `SELECT DISTINCT ON (schema)
      schema, 
      array_agg(id) as ids, 
      array_agg(day) as days, 
      array_agg(build_status) as build_statuses, 
      array_agg(duration) as durations, 
      array_agg(user_id) as user_ids, 
      array_agg(category) as categories, 
      array_agg(was_suspended) as was_suspended
    FROM builds 
    WHERE was_suspended=False ${excluded_configuration} 
    GROUP BY schema`, []);
  });
 
app.listen(port, () => console.log(`xcmetrics-dashboard-api started on port ${port}`));

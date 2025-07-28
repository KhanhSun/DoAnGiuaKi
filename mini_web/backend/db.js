// db.js
const { Pool } = require("pg");

const pool = new Pool({
  user: 'dka12345',
  host: 'dpg-d21lobfdiees73dvsclg-a.oregon-postgres.render.com',
  database: 'dbmid',
  password: '5NkYg6smATwV7OBLapeSEyrm0w6EYoPb',
  port: 5432,
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;

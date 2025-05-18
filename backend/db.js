const { Pool } = require('pg');

const pool = new Pool({
  host: 'db',
  user: 'admin',
  password: 'password',
  database: 'commandes_db',
  port: 5432
});

module.exports = pool;

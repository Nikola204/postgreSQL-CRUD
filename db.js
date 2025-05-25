const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'tecajevi',
  password: 'k1u1c1a1', // zamijeni svojom lozinkom
  port: 5432,
});

module.exports = pool;

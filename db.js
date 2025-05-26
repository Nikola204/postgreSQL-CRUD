const { Pool } = require('pg');

const pool = new Pool({
  user: 'user2',
  host: 'localhost',
  database: 'Courses',
  password: 'lozinka2', // zamijeni svojom lozinkom
  port: 5432,
});

module.exports = pool;

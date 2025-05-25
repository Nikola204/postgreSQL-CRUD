const express = require('express');
const router = express.Router();
const pool = require('../db');

// Prikaz svih korisnika
router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM users ORDER BY id');
  res.render('users', { users: result.rows });
});

// Dodaj korisnika
router.post('/add', async (req, res) => {
  const { first_name, last_name, email, password, role } = req.body;
  await pool.query(
    'INSERT INTO users (first_name, last_name, email, password, role) VALUES ($1, $2, $3, $4, $5)',
    [first_name, last_name, email, password, role]
  );
  res.redirect('/users');
});

// Uredi korisnika
router.post('/edit/:id', async (req, res) => {
  const { first_name, last_name, email, password, role } = req.body;
  await pool.query(
    'UPDATE users SET first_name=$1, last_name=$2, email=$3, password=$4, role=$5 WHERE id=$6',
    [first_name, last_name, email, password, role, req.params.id]
  );
  res.redirect('/users');
});

// Obriši korisnika
router.post('/delete/:id', async (req, res) => {
  await pool.query('DELETE FROM users WHERE id=$1', [req.params.id]);
  res.redirect('/users');
});

module.exports = router;

const express = require('express');
const router = express.Router();
const pool = require('../db');

// Prikaz svih paketa korisnika
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT up.*, u.first_name, u.last_name, p.name AS package_name
      FROM users_packages up
      JOIN users u ON up.user_id = u.id
      JOIN package p ON up.package_id = p.id
      ORDER BY up.user_id
    `);
    res.render('usersPackages/index', { usersPackages: result.rows });
  } catch (err) {
    console.error(err);
    res.send('Greška kod dohvaćanja podataka.');
  }
});

// Forma za dodavanje
router.get('/new', async (req, res) => {
  try {
    const users = await pool.query('SELECT id, first_name, last_name FROM users');
    const packages = await pool.query('SELECT id, name, duration FROM package');
    res.render('usersPackages/new', {
      users: users.rows,
      packages: packages.rows
    });
  } catch (err) {
    console.error(err);
    res.send('Greška kod prikaza forme.');
  }
});

// Dodavanje novog paketa korisniku
router.post('/', async (req, res) => {
  const { user_id, package_id, date } = req.body;
  try {
    // Trajanje paketa
    const pkg = await pool.query('SELECT duration FROM package WHERE id = $1', [package_id]);
    const duration = pkg.rows[0].duration;

    // Izračun expiry_date
    const expiryDate = new Date(date);
    expiryDate.setDate(expiryDate.getDate() + duration);

    await pool.query(
      'INSERT INTO users_packages (user_id, package_id, date, expiry_date) VALUES ($1, $2, $3, $4)',
      [user_id, package_id, date, expiryDate]
    );
    res.redirect('/users-packages');
  } catch (err) {
    console.error(err);
    res.send('Greška kod dodavanja.');
  }
});

// Brisanje
router.post('/delete/:user_id/:package_id', async (req, res) => {
  const { user_id, package_id } = req.params;
  try {
    await pool.query(
      'DELETE FROM users_packages WHERE user_id = $1 AND package_id = $2',
      [user_id, package_id]
    );
    res.redirect('/users-packages');
  } catch (err) {
    console.error(err);
    res.send('Greška kod brisanja.');
  }
});

module.exports = router;

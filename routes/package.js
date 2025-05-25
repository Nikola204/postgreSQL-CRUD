const express = require('express');
const router = express.Router();
const pool = require('../db'); // konekcija na bazu

// Prikaz svih paketa
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM package ORDER BY id');
    res.render('package/index', { packages: result.rows });
  } catch (err) {
    console.error(err.message);
    res.send('Greška kod dohvaćanja paketa');
  }
});

// Forma za novi paket
router.get('/new', (req, res) => {
  res.render('package/new');
});

// Dodavanje novog paketa
router.post('/', async (req, res) => {
  const { name, description, price_discount, duration } = req.body;
  try {
    await pool.query(
      'INSERT INTO package (name, description, price_discount, duration) VALUES ($1, $2, $3, $4)',
      [name, description, price_discount, duration]
    );
    res.redirect('/package');
  } catch (err) {
    console.error(err.message);
    res.send('Greška kod dodavanja paketa');
  }
});

// Forma za uređivanje
router.get('/edit/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM package WHERE id = $1', [id]);
    res.render('package/edit', { package: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.send('Greška kod dohvaćanja paketa');
  }
});

// Ažuriranje paketa
router.post('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price_discount, duration } = req.body;
  try {
    await pool.query(
      'UPDATE package SET name = $1, description = $2, price_discount = $3, duration = $4 WHERE id = $5',
      [name, description, price_discount, duration, id]
    );
    res.redirect('/package');
  } catch (err) {
    console.error(err.message);
    res.send('Greška kod ažuriranja paketa');
  }
});

// Brisanje paketa
router.post('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM package WHERE id = $1', [id]);
    res.redirect('/package');
  } catch (err) {
    console.error(err.message);
    res.send('Greška kod brisanja paketa');
  }
});

module.exports = router;

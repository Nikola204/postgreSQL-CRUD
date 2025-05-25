const express = require('express');
const router = express.Router();
const pool = require('../db'); // veza s bazom

// Prikaz svih tečajeva
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM course ORDER BY id');
    res.render('courses/index', { courses: result.rows });
  } catch (err) {
    console.error(err.message);
    res.send('Greška kod dohvaćanja tečajeva');
  }
});

// Forma za dodavanje tečaja
router.get('/new', (req, res) => {
  res.render('courses/new');
});

// Dodavanje novog tečaja
router.post('/', async (req, res) => {
  const { name, duration, level, price } = req.body;
  try {
    await pool.query(
      'INSERT INTO course (name, duration, level, price) VALUES ($1, $2, $3, $4)',
      [name, duration, level, price]
    );
    res.redirect('/courses');
  } catch (err) {
    console.error(err.message);
    res.send('Greška kod unosa');
  }
});

// Forma za uređivanje
router.get('/edit/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM course WHERE id = $1', [id]);
    res.render('courses/edit', { course: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.send('Greška kod dohvaćanja tečaja');
  }
});

// Ažuriranje
router.post('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { name, duration, level, price } = req.body;
  try {
    await pool.query(
      'UPDATE course SET name = $1, duration = $2, level = $3, price = $4 WHERE id = $5',
      [name, duration, level, price, id]
    );
    res.redirect('/courses');
  } catch (err) {
    console.error(err.message);
    res.send('Greška kod ažuriranja');
  }
});

// Brisanje
router.post('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM course WHERE id = $1', [id]);
    res.redirect('/courses');
  } catch (err) {
    console.error(err.message);
    res.send('Greška kod brisanja');
  }
});

module.exports = router;

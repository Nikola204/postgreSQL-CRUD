const express = require('express');
const router = express.Router();
const pool = require('../db');

// Prikaz svih sadržaja
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT content.*, course.name AS course_name
      FROM content
      JOIN course ON content.course_id = course.id
      ORDER BY content.id
    `);
    res.render('content/index', { contents: result.rows });
  } catch (err) {
    console.error(err.message);
    res.send('Greška kod dohvaćanja sadržaja');
  }
});

// Forma za novi sadržaj
router.get('/new', async (req, res) => {
  try {
    const courses = await pool.query('SELECT id, name FROM course');
    res.render('content/new', { courses: courses.rows });
  } catch (err) {
    console.error(err.message);
    res.send('Greška kod učitavanja formi');
  }
});

// Dodavanje sadržaja
router.post('/', async (req, res) => {
  const { video, description, course_id } = req.body;
  try {
    await pool.query(
      'INSERT INTO content (video, description, course_id) VALUES ($1, $2, $3)',
      [video, description, course_id]
    );
    res.redirect('/content');
  } catch (err) {
    console.error(err.message);
    res.send('Greška kod dodavanja sadržaja');
  }
});

// Forma za uređivanje
router.get('/edit/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const contentResult = await pool.query('SELECT * FROM content WHERE id = $1', [id]);
    const courses = await pool.query('SELECT id, name FROM course');
    res.render('content/edit', { content: contentResult.rows[0], courses: courses.rows });
  } catch (err) {
    console.error(err.message);
    res.send('Greška kod dohvaćanja sadržaja');
  }
});

// Ažuriranje sadržaja
router.post('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { video, description, course_id } = req.body;
  try {
    await pool.query(
      'UPDATE content SET video = $1, description = $2, course_id = $3 WHERE id = $4',
      [video, description, course_id, id]
    );
    res.redirect('/content');
  } catch (err) {
    console.error(err.message);
    res.send('Greška kod ažuriranja sadržaja');
  }
});

// Brisanje
router.post('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM content WHERE id = $1', [id]);
    res.redirect('/content');
  } catch (err) {
    console.error(err.message);
    res.send('Greška kod brisanja sadržaja');
  }
});

module.exports = router;

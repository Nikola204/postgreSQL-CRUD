const express = require('express');
const router = express.Router();
const pool = require('../db');

// Dohvaćanje svih certifikata
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT cert.*, u.first_name, u.last_name, c.name AS course_name
      FROM certificates cert
      JOIN users u ON cert.user_id = u.id
      JOIN course c ON cert.course_id = c.id
      ORDER BY issue_date DESC
    `);
    res.render('certificates/index', { certificates: result.rows });
  } catch (err) {
    console.error(err);
    res.send('Greška pri dohvaćanju certifikata.');
  }
});

// Forma za dodavanje certifikata
router.get('/new', async (req, res) => {
  try {
    const users = await pool.query('SELECT id, first_name, last_name FROM users');
    const courses = await pool.query('SELECT id, name FROM course');
    res.render('certificates/new', {
      users: users.rows,
      courses: courses.rows
    });
  } catch (err) {
    console.error(err);
    res.send('Greška kod prikaza forme.');
  }
});

// Dodavanje certifikata
router.post('/', async (req, res) => {
  const { user_id, course_id, issue_date } = req.body;
  try {
    await pool.query(
      `INSERT INTO certificates (user_id, course_id, issue_date)
       VALUES ($1, $2, $3)`,
      [user_id, course_id, issue_date]
    );
    res.redirect('/certificates');
  } catch (err) {
    console.error(err);
    res.send('Greška kod dodavanja certifikata.');
  }
});

// Brisanje certifikata
router.post('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM certificates WHERE id = $1', [id]);
    res.redirect('/certificates');
  } catch (err) {
    console.error(err);
    res.send('Greška kod brisanja.');
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const pool = require('../db');

// Prikaz svih veza korisnika i tečajeva
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT cu.*, u.first_name, u.last_name, c.name AS course_name
      FROM course_users cu
      JOIN users u ON cu.user_id = u.id
      JOIN course c ON cu.course_id = c.id
      ORDER BY cu.enrolled_at DESC
    `);
    res.render('courseUsers/index', { courseUsers: result.rows });
  } catch (err) {
    console.error(err);
    res.send('Greška kod dohvaćanja podataka.');
  }
});

// Forma za dodavanje
router.get('/new', async (req, res) => {
  try {
    const users = await pool.query('SELECT id, first_name, last_name FROM users');
    const courses = await pool.query('SELECT id, name FROM course');
    res.render('courseUsers/new', {
      users: users.rows,
      courses: courses.rows
    });
  } catch (err) {
    console.error(err);
    res.send('Greška kod prikaza forme.');
  }
});

// Dodavanje
router.post('/', async (req, res) => {
  const { user_id, course_id, enrolled_at, status, progress, comment } = req.body;
  try {
    await pool.query(
      `INSERT INTO course_users (user_id, course_id, enrolled_at, status, progress, comment)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [user_id, course_id, enrolled_at, status, progress, comment]
    );
    res.redirect('/course-users');
  } catch (err) {
    console.error(err);
    res.send('Greška kod dodavanja.');
  }
});

// Brisanje
router.post('/delete/:user_id/:course_id', async (req, res) => {
  const { user_id, course_id } = req.params;
  try {
    await pool.query(
      'DELETE FROM course_users WHERE user_id = $1 AND course_id = $2',
      [user_id, course_id]
    );
    res.redirect('/course-users');
  } catch (err) {
    console.error(err);
    res.send('Greška kod brisanja.');
  }
});

module.exports = router;

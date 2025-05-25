const express = require('express');
const router = express.Router();
const pool = require('../db');

// Dohvati sve povezane instruktore s tečajevima
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT ci.user_id, ci.course_id, u.first_name, u.last_name, c.name AS course_name
      FROM course_instructors ci
      JOIN users u ON ci.user_id = u.id
      JOIN course c ON ci.course_id = c.id
    `);
    res.render('courseInstructors/index', { instructors: result.rows });
  } catch (err) {
    console.error(err);
    res.send('Greška pri dohvaćanju instruktora.');
  }
});

// Forma za dodavanje veze korisnik-tečaj
router.get('/new', async (req, res) => {
  try {
    const users = await pool.query(`SELECT id, first_name, last_name FROM users WHERE role = 'instruktor'`);
    const courses = await pool.query('SELECT id, name FROM course');
    res.render('courseInstructors/new', {
      users: users.rows,
      courses: courses.rows
    });
  } catch (err) {
    console.error(err);
    res.send('Greška kod prikaza forme.');
  }
});

// Dodavanje instruktora na tečaj
router.post('/', async (req, res) => {
  const { user_id, course_id } = req.body;
  try {
    await pool.query(
      `INSERT INTO course_instructors (user_id, course_id) VALUES ($1, $2)`,
      [user_id, course_id]
    );
    res.redirect('/course-instructors');
  } catch (err) {
    console.error(err);
    res.send('Greška kod dodavanja.');
  }
});

// Brisanje veze instruktor-tečaj
router.post('/delete', async (req, res) => {
  const { user_id, course_id } = req.body;
  try {
    await pool.query(
      `DELETE FROM course_instructors WHERE user_id = $1 AND course_id = $2`,
      [user_id, course_id]
    );
    res.redirect('/course-instructors');
  } catch (err) {
    console.error(err);
    res.send('Greška kod brisanja.');
  }
});

module.exports = router;

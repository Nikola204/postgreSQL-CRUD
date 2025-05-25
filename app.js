const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const userRoutes = require('./routes/users');
app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.redirect('/users');
});

const courseRoutes = require('./routes/courses');
app.use('/courses', courseRoutes);

const packageRoutes = require('./routes/package');
app.use('/package', packageRoutes);

const contentRoutes = require('./routes/content');
app.use('/content', contentRoutes);

const usersPackagesRoutes = require('./routes/usersPackages');
app.use('/users-packages', usersPackagesRoutes);

const courseUsersRoutes = require('./routes/courseUsers');
app.use('/course-users', courseUsersRoutes);

const certificateRoutes = require('./routes/certificates');
app.use('/certificates', certificateRoutes);

const courseInstructorRoutes = require('./routes/courseInstructors');
app.use('/course-instructors', courseInstructorRoutes);


app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

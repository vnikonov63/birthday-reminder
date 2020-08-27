const express = require('express');
const cookieParser = require('cookie-parser');
const Student = require('../models/students');
const router = express.Router();
const session = require('express-sessions');
const dayjs = require('dayjs');
// function checkAuth(req, res, next) {
//   if (req.session.user) next();
//   else res.redirect('/admin/login');
// }

router.get('/', async (req, res) => {
  const students = await Student.find({});
  res.render('admin', { students });
});

router.delete('/delete', async (req, res) => {
  const id = req.body.id;
  let deletedStudent = await Student.findByIdAndRemove(id);
  let students = await Student.find({});
  res.json({ deletedStudent, students });
});

router.get('/edit/:id', async (req, res) => {
  const id = req.params.id;
  const student = await Student.findById(id);
  res.render('edit', { student });
});

router.patch('/edit/:id', async (req, res) => {
  const id = req.params.id;
  const { firstName, lastName, birthday, city } = req.body;
  const dateOfBirth = new Date(dayjs.utc(birthday).format());
  let student = await Student.findByIdAndUpdate(id, {
    firstName,
    lastName,
    dateOfBirth,
    typeBootCamp: city,
    prettyDate: dateOfBirth.toLocaleDateString('en-US')
  });
  // res.json({ success: true, student });
  res.redirect('/admin');
});

router.get('/login', async (req, res) => {});

module.exports = router;

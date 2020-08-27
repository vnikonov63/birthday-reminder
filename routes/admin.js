const express = require('express');
const cookieParser = require('cookie-parser');
const Student = require('../models/students');
const router = express.Router();
const dayjs = require('dayjs');
const Admin = require('../models/admin');

function checkAuth(req, res, next) {
  if (req.session.user) next();
  else res.redirect('/admin/login');
}

router.get('/login', async (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  const { login, password } = req.body;
  const user = await auth(login, password);
  if (user) {
    req.session.user = user;
    console.log(req.session.user);
    return res.redirect('/admin');
  }
  const fail = true;
  console.log('Ошибка аутентификации, попробуйте снова');
  return res.render('login', { fail });
});

router.get('/', checkAuth, async (req, res) => {
  const students = await Student.find({});
  res.render('admin', { students });
});

router.delete('/delete', checkAuth, async (req, res) => {
  const id = req.body.id;
  let deletedStudent = await Student.findByIdAndRemove(id);
  let students = await Student.find({});
  res.json({ deletedStudent, students });
});

router.get('/edit/:id', checkAuth, async (req, res) => {
  const id = req.params.id;
  const student = await Student.findById(id);
  res.render('edit', { student });
});

router.patch('/edit/:id', checkAuth, async (req, res) => {
  const id = req.params.id;
  const { firstName, lastName, birthday, city } = req.body;
  const dateOfBirth = new Date(dayjs.utc(birthday).format());
  let student = await Student.findByIdAndUpdate(id, {
    firstName,
    lastName,
    dateOfBirth,
    typeBootCamp: city,
    prettyDate: dateOfBirth.toLocaleDateString('en-US'),
  });
  // res.json({ success: true, student });
  res.redirect('/admin');
});

async function auth(login, password) {
  const user = await Admin.findOne({ login });
  if (user && user.password === password) return user;
  return false;
}

module.exports = router;

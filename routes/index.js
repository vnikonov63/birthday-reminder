const express = require('express');
const mongoose = require('mongoose');
const app = express();

// adding the necessary elements to work with the dates
const dayjs = require('dayjs');
let utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

const Student = require('../models/students');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
});

router.post('/new', async (req, res) => {
  const { name, lastname, birthday, city } = req.body;
  const birthdayDate = new Date(dayjs.utc(birthday).format());
  let student = await new Student({
    firstName: name,
    lastName: lastname,
    dateOfBirth: birthdayDate,
    typeBootCamp: city,
  });
  const date = await student.dateOfBirth.toLocaleDateString('en-US').split('/');
  let prettydate = await date
    .map((elem) => {
      if (elem.length === 1) {
        return `0${elem}`;
      }
      return elem;
    })
    .reverse()
    .join('-');
  student.prettyDate = prettydate;
  await student.save();
  res.redirect('/success');
});

router.get('/success', (req, res) => {
  res.render('success');
});

module.exports = router;

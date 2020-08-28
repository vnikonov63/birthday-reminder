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


router.post('/', async (req, res) => {

  const fail = true;
  const invalidYear = true;
  let userIp = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const ip = await new Ip({
    ip: userIp,
  }).save();
  if (typeof req.session.submit === "undefined") {
    const { name, lastname, birthday, city, animal } = req.body;
    if (isOldEnough(birthday)) {
      req.session.submit = "submit";
      const birthdayDate = new Date(dayjs.utc(birthday).format());
      let student = await new Student({
        firstName: name,
        lastName: lastname,
        dateOfBirth: birthdayDate,
        typeBootCamp: city,
        prettyDate: birthday,
        groupName: animal,
      }).save();

      res.render('success', { student });

    } else {
      res.render("index", { invalidYear, student: req.body });
    }
  } else {
    res.render("index", { fail });
  }
});

function isOldEnough(date) {
  const checkingDate = new Date(dayjs.utc(date).format());
  const today = new Date();
  const checkingDateUTC = checkingDate.getTime();
  const todayMS = today.getTime();
  if (todayMS - checkingDateUTC < 31536000000 * 18) return false;
  return true;
}

module.exports = router;

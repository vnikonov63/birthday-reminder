const express = require('express');
const mongoose = require('mongoose');
const app = express();

// adding the necessary elements to work with the dates
const dayjs = require('dayjs');
let utc = require('dayjs/plugin/utc');
dayjs.extend(utc);
const Student = require('../models/students');
const Ip = require('../models/ip');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
});

router.post('/', async (req, res) => {
  const fail = true;
  const invalidData = true;
  let userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const ip = await new Ip({
    ip: userIp,
  }).save();
  if (typeof req.session.submit === 'undefined') {
    const { name, lastname, birthday, city, animal } = req.body;
    console.log(req.body);
    if (
      isValidAge(birthday) &&
      isValidNameAndLastname(name, lastname) &&
      isValidGroup(animal) &&
      isValidCity(city)
    ) {
      console.log(name, lastname, birthday, city, animal);
      console.log(
        isValidCity(city),
        isValidGroup(animal),
        isValidNameAndLastname(name, lastname),
        isValidAge(birthday)
      );
      req.session.submit = 'submit';
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
      res.render('index', { invalidData, student: req.body });
    }
  } else {
    res.render('index', { fail });
  }
});

function isValidAge(date) {
  const checkingDate = new Date(dayjs.utc(date).format());
  const today = new Date();
  const checkingDateUTC = checkingDate.getTime();
  const todayMS = today.getTime();
  const template = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/gm;
  if (!template.test(date)) return false;
  if (
    todayMS - checkingDateUTC < 31536000000 * 18 ||
    todayMS - checkingDateUTC > 31536000000 * 80
  ) {
    console.log('НЕ ПРОШЛО НА СТРОКЕ 81');
    return false;
  }
  return true;
}

function isValidNameAndLastname(name, lastname) {
  const template = /[А-Я|Ё]{1}[а-я|ё]*/;
  console.log(
    'TEMPL TEST',
    template.test(name),
    template.test(lastname),
    name,
    [lastname]
  );
  if (!name || !lastname) {
    console.log('НЕ ПРОШЛО НА СТРОКЕ 90');
    return false;
  }
  if (template.test(name) && template.test(lastname)) return true;
  console.log('НЕ ПРОШЛО НА СТРОКЕ 95');
  return false;
}

function isValidGroup(groupName) {
  const templates = [
    'Волки',
    'Еноты',
    'Ежи',
    'Пчёлы',
    'Медведи',
    'Орлы',
    'Совы',
    'Бобры',
    'Лисы',
  ];
  if (!templates.includes(groupName)) {
    console.log('НЕ ПРОШЛО НА СТРОКЕ 111');
  }
  return templates.includes(groupName);
}

function isValidCity(city) {
  const templates = ['Москва', 'Санкт-Петербург', 'Онлайн'];
  return templates.includes(city);
}
module.exports = router;

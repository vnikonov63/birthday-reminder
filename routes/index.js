const express = require('express');
const mongoose = require('mongoose');
const app = express();

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
});

router.post('/new', (req, res) => {
  res.send(`Красавчик, ${req.body.name}`);
});
module.exports = router;

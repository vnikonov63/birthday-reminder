const express = require('express');
const mongoose = require('mongoose');
const app = express();
const indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin');
const methodOverride = require('method-override');
const session = require('express-session');
const bot = require('./bot/index');
require('dotenv').config();

db = mongoose.connect(process.env.MONGO_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
    },
  })
);

app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      const method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

app.use('/', indexRouter);
app.use('/admin', adminRouter);

bot();

module.exports = app;

const mongoose = require('mongoose');
const Admin = require('./models/admin');

let db = mongoose.connect('mongodb://localhost:27017/elbrusBirthday', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Just for the sake of checking whether the database is structured properly
const { connection } = require('mongoose');

const Student = require('./models/students');

db.then(async ({ connection }) => {
  // await connection.db.dropDatabase();
  const admin = new Admin({
    login: 'admin',
    password: 'admin',
  }).save();
});

module.exports = db;

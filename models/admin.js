const { Schema, model } = require('mongoose');

const adminSchema = new Schema({
  login: String,
  password: String,
});

module.exports = model('Admin', adminSchema);

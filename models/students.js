const { Schema, model } = require('mongoose');

const studentSchema = new Schema({
  firstName: String,
  lastName: String,
  dateOfBirth: Date,
  typeBootCamp: String,
  prettyDate: String,
  groupName: String,
});

module.exports = model('Student', studentSchema);

const { Schema, model } = require("mongoose");

const studentSchema = new Schema({
  firstName: String,
  lastName: String,
  dateOfBirth: Date,
});

module.exports = model("Student", studentSchema);

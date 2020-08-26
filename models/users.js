const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  dateOfBirth: Date,
});

module.exports = model("User", userSchema);

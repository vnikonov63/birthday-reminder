const { Schema, model } = require("mongoose");

const ipSchema = new Schema({
  ip: String,
});

module.exports = model("Ip", ipSchema);

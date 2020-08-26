const express = require("express");
const mongoose = require("mongoose");
const app = express();
const indexRouter = require("./routes/index");

mongoose.connect("mongodb://localhost:27017/elbrusBirthday", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set("view engine", "hbs");
app.set("views", "views");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.use("/", indexRouter);

module.exports = app;

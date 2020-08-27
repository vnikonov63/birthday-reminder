const mongoose = require("mongoose");
let db = mongoose.connect("mongodb://localhost:27017/elbrusBirthday", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Just for the sake of checking whether the database is structured properly
const { connection } = require("mongoose");

const Student = require("./models/students");

db.then(async ({ connection }) => {
  await connection.db.dropDatabase();
  await Student.create({
    firstName: "Artem1",
    lastName: "Nikonov1",
    dateOfBirth: new Date(Date.UTC(2000, 3, 27)),
    typeBootCamp: "online",
  });

  await Student.create({
    firstName: "Artem2",
    lastName: "Nikonov2",
    dateOfBirth: new Date(Date.UTC(2000, 7, 27)),
    typeBootCamp: "online",
  });

  await Student.create({
    firstName: "Artem3",
    lastName: "Nikonov3",
    dateOfBirth: new Date(Date.UTC(2000, 7, 28)),
    typeBootCamp: "online",
  });

  await Student.create({
    firstName: "Artem4",
    lastName: "Nikonov4",
    dateOfBirth: new Date(Date.UTC(2000, 7, 26)),
    typeBootCamp: "online",
  });

  await Student.create({
    firstName: "Artem5",
    lastName: "Nikonov5",
    dateOfBirth: new Date(Date.UTC(2000, 3, 29)),
    typeBootCamp: "online",
  });
  connection.close();
});

module.exports = db;

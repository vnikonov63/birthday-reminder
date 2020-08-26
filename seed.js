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
    firstName: "Vasilii",
    lastName: "Nikonov",
    dateOfBirth: new Date(Date.UTC(2000, 3, 27)),
  });
  connection.close();
});

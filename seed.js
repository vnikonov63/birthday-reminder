const mongoose = require("mongoose");
let db = mongoose.connect("mongodb://localhost:27017/elbrusBirthday", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Just for the sake of checking whether the database is structured properly
const { connection } = require("mongoose");

const User = require("./models/users");

db.then(async ({ connection }) => {
  await connection.db.dropDatabase();
  await User.create({
    firstName: "Vasilii",
    lastName: "Nikonov",
    dateOfBirth: new Date("April 27 2000"),
  });
  connection.close();
});

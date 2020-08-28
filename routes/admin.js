const express = require("express");
const cookieParser = require("cookie-parser");
const Student = require("../models/students");
const router = express.Router();
const dayjs = require("dayjs");
const Admin = require("../models/admin");
const Ip = require("../models/ip");

function checkAuth(req, res, next) {
  if (req.session.user) next();
  else res.redirect("/admin/login");
}

router.get("/login", async (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  const { login, password } = req.body;
  const user = await auth(login, password);
  if (user) {
    req.session.user = user;
    return res.redirect("/admin");
  }
  const fail = true;
  console.log("Ошибка аутентификации, попробуйте снова");
  return res.render("login", { fail });
});

const todayYear = new Date().toDateString().split(" ")[3];
const todayDateMilli = Date.parse(new Date().toDateString());
function findMilli(element) {
  let userDateOfBirth = element.dateOfBirth;
  let userDateArray = userDateOfBirth.toDateString().split(" ");
  userDateArray[3] = todayYear;
  let userThisYearBirthdayMilli = Date.parse(userDateArray.join(" "));
  let delta = userThisYearBirthdayMilli - todayDateMilli;
  if (delta < 0) {
    delta = 1000 * 60 * 60 * 24 * 365 + delta;
  }
  return delta;
}

function sortName(element) {
  return element.lastName.charCodeAt(0);
}

function sortFirstName(element) {
  return element.firstName.charCodeAt(0);
}

router.get("/", checkAuth, async (req, res) => {
  const students = await Student.find({});
  res.render("admin", { students });
});

router.get("/sort", checkAuth, (req, res) => {
  res.redirect("/admin");
});

router.post("/sort", checkAuth, async (req, res) => {
  const students = await Student.find({});
  if (req.body.select === "upcoming") {
    const studentsSorted = [...students];
    res.render("admin", {
      students: studentsSorted.sort(function (a, b) {
        return findMilli(a) - findMilli(b);
      }),
    });
  }

  if (req.body.select === "name") {
    const studentsSorted = [...students];
    res.render("admin", {
      students: studentsSorted.sort(function (a, b) {
        return sortName(a) - sortName(b);
      }),
    });
  }

  if (req.body.select === "default") {
    res.render("admin", { students });
  }

  if (req.body.select === "firstName") {
    const studentsSorted = [...students];
    res.render("admin", {
      students: studentsSorted.sort(function (a, b) {
        return sortFirstName(a) - sortFirstName(b);
      }),
    });
  }
});

router.delete("/delete", checkAuth, async (req, res) => {
  const id = req.body.id;
  let deletedStudent = await Student.findByIdAndRemove(id);
  let students = await Student.find({});
  res.json({ deletedStudent, students });
});

router.get("/edit/:id", checkAuth, async (req, res) => {
  const id = req.params.id;
  const student = await Student.findById(id);
  res.render("edit", { student });
});

router.patch("/edit/:id", checkAuth, async (req, res) => {
  const id = req.params.id;
  const { firstName, lastName, birthday, city, animal } = req.body;
  const dateOfBirth = new Date(dayjs.utc(birthday).format());
  await Student.findByIdAndUpdate(id, {
    firstName,
    lastName,
    dateOfBirth,
    typeBootCamp: city,
    prettyDate: birthday,
    groupName: animal,
  });
  res.redirect("/admin");
});

async function auth(login, password) {
  const user = await Admin.findOne({ login });
  if (user && user.password === password) return user;
  return false;
}

module.exports = router;

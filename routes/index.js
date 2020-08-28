const express = require("express");
const mongoose = require("mongoose");
const app = express();

// adding the necessary elements to work with the dates
const dayjs = require("dayjs");
let utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

const Student = require("../models/students");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("index");
});

router.post("/", async (req, res) => {
  if (typeof req.session.submit === "undefined") {
    const { name, lastname, birthday, city } = req.body;
    req.session.submit = "submit";
    const birthdayDate = new Date(dayjs.utc(birthday).format());
    let student = await new Student({
      firstName: name,
      lastName: lastname,
      dateOfBirth: birthdayDate,
      typeBootCamp: city,
      prettyDate: birthday,
    }).save();
    res.redirect("/success");
  } else {
    const fail = true;
    res.render("index", { fail });
  }
});

router.get("/success", (req, res) => {
  res.render("success");
});

module.exports = router;

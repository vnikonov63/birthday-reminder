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

router.post("/new", async (req, res) => {
  const { name, lastname, birthday } = req.body;
  const birthdayDate = new Date(dayjs.utc(birthday).format());
  await Student.create({
    firstName: name,
    lastName: lastname,
    dateOfBirth: birthdayDate,
  });
  res.redirect("/success");
});

router.get("/success", (req, res) => {
  res.send("ok");
});

module.exports = router;

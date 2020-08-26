const { Telegraf } = require("telegraf");
const Student = require("../models/students");
const mongoose = require("mongoose");
const bot = new Telegraf("986785690:AAH5awaR1tJANp-oGS4t_2vNJPJztioCkdI");

const { CronJob } = require("cron");

mongoose.connect("mongodb://localhost:27017/elbrusBirthday", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// bot.start((ctx) => ctx.reply("che prishel? idi naher!"));

bot.help((ctx) => ctx.reply("Send me a sticker"));
bot.start((ctx) => {
  const job = new CronJob(
    "20 * * * * *",
    async function () {
      ctx.reply(new Date());
    },
    null,
    true,
    "Europe/Moscow"
  );
  job.start();
});

bot.hears("today", async (ctx) => {
  let today = new Date().toDateString().split(" ");
  [todayMonth, todayDay] = [today[1], today[2]];
  let students = await Student.find();
  let studentsToday = students.filter((student) => {
    let studentDate = student.dateOfBirth.toDateString().split(" ");
    [StudenttodayMonth, StudenttodayDay] = [studentDate[1], studentDate[2]];
    return todayMonth === StudenttodayMonth && todayDay === StudenttodayDay;
  });
  studentsToday.forEach((element) => {
    ctx.reply(
      `У студента ${element.firstName} ${element.lastName} сегодня день рождения`
    );
  });
});

bot.on("sticker", (ctx) => ctx.reply("👍"));

bot.launch();

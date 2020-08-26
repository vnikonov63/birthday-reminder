const { Telegraf } = require("telegraf");
const Student = require("../models/students");
const mongoose = require("mongoose");
const bot = new Telegraf("986785690:AAH5awaR1tJANp-oGS4t_2vNJPJztioCkdI");

const { CronJob } = require("cron");

// console.log("Before job instantiation");
// const job = new CronJob("* * * * * *", function () {
//   const d = new Date();
//   console.log("Every second:", d);
// });
// console.log("After job instantiation");
// job.start();

mongoose.connect("mongodb://localhost:27017/elbrusBirthday", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// async function returnPersonWithSuchDate() {
// }

// bot.start((ctx) => ctx.reply("che prishel? idi naher!"));
bot.help((ctx) => ctx.reply("Send me a sticker"));
bot.start((ctx) => {
  const job = new CronJob(
    "30 34 20 * * *",
    async function () {
      let today = new Date().toDateString().split(" ");
      [todayMonth, todayDay] = [today[1], today[2]];
      let a = await Student.find();
      let result = [];
      a.forEach((student) => {
        let studentDate = student.dateOfBirth.toDateString().split(" ");
        [StudenttodayMonth, StudenttodayDay] = [studentDate[1], studentDate[2]];
        if (todayMonth === StudenttodayMonth && todayDay === StudenttodayDay) {
          ctx.reply(
            `${student.firstName} ${student.lastName} has birthday today`
          );
        }
      });
    },
    null,
    true,
    "Europe/Moscow"
  );
  job.start();
});
bot.on("sticker", (ctx) => ctx.reply("👍"));
bot.on("text", async (ctx) => {
  let result = await Student.findOne({ firstName: "Artem" });
  await ctx.reply(result.firstName);
});

bot.launch();
// bot.startPolling();

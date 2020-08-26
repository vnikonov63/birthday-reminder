const { Telegraf } = require("telegraf");
const Student = require("../models/students");
const mongoose = require("mongoose");
const bot = new Telegraf("986785690:AAH5awaR1tJANp-oGS4t_2vNJPJztioCkdI");

const { CronJob } = require("cron");

mongoose.connect("mongodb://localhost:27017/elbrusBirthday", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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
  if (studentsToday.length) {
  studentsToday.forEach((element) => {
    ctx.reply(
      `У студента ${element.firstName} ${element.lastName} сегодня день рождения. Локация: ${element.typeBootCamp === 'moscow' ? 'Москва' : element.typeBootCamp === 'spb' ? 'Санкт-Петербург' : 'Онлайн'}.`
    );
  })} else {
    await ctx.reply('Сегодня ни у кого нет дня рождения')
  }
});

bot.hears("tomorrow", async (ctx) => {
  let today = new Date().toDateString().split(" ")
  let newMonthTomorrow = false;
  // Проверка на конец месяца

  console.log(today[1], today[2], newMonthTomorrow)
  if (today[1] === 'Feb' && today[3] % 4 === 0 && today[2] === '29') {
    newMonthTomorrow = true;
    console.log('Это из-за строки 52')
  } else if (today[1] === 'Sep' || today[1] === 'Apr' || today[1] === 'Jun' || today[1] === 'Nov' && Number(today[2]) === 30) {
    newMonthTomorrow = true
    console.log('Это из-за строки 55')
  } else if (today[2] === '31') {
    newMonthTomorrow = true
    console.log('Это из-за строки 58')
  } else if (today[1] === 'Feb' && today[2] === '28') {
    newMonthTomorrow = true
    console.log('Это из-за строки 61')
  }
// Если завтра - не новый месяц...
  if (!newMonthTomorrow) {
    // Кладем в tomorrow текущий месяц и завтрашний день
    let tomorrow = [today[1], Number(today[2]) + 1];
    let [tomorrowMonth, tomorrowDay] = [tomorrow[0], tomorrow[1]]
    let students = await Student.find();
    let studentsToday = students.filter((student) => {
      let studentDate = student.dateOfBirth.toDateString().split(" ");
      [StudenttodayMonth, StudenttodayDay] = [studentDate[1], studentDate[2]];
      console.log(StudenttodayMonth, StudenttodayDay);
      return tomorrowMonth === StudenttodayMonth && tomorrowDay === Number(StudenttodayDay) + 1;
    });

    if (studentsToday.length) {
      studentsToday.forEach((element) => {
        ctx.reply(
          `У студента ${element.firstName} ${element.lastName} завтра день рождения. Локация: ${element.typeBootCamp === 'moscow' ? 'Москва' : element.typeBootCamp === 'spb' ? 'Санкт-Петербург' : 'Онлайн'}.`
        );
      })} else {
      await ctx.reply('Завтра ни у кого нет дня рождения')
    }
  } else {
    // Нужно изменение месяца
    // *************************************
    console.log("ЭТО НАДО БУДЕТ ДОПИСАТЬ")
    await ctx.reply('Сори, пока не работает')
    // *************************************
  }
})

bot.on("sticker", (ctx) => ctx.reply("👍"));

bot.launch();

function bot() {
  const { Telegraf } = require('telegraf');
  const Student = require('../models/students');
  const mongoose = require('mongoose');
  const bot = new Telegraf(process.env.BOT_TOKEN);
  require('dotenv').config();

  const { CronJob } = require('cron');
  const { setMaxListeners } = require('../app');

  let globalCtx;
  let jobMorning = new CronJob(
    '35 * * * * *',
    async function () {
      today().then((data) => {
        if (data.length) {
          data.forEach((element) => {
            if (!globalCtx) {
              return;
            }
            globalCtx.reply(
              `У студента ${element.firstName} ${
                element.lastName
              } сегодня день рождения. Локация: ${
                element.typeBootCamp === 'moscow'
                  ? 'Москва'
                  : element.typeBootCamp === 'spb'
                  ? 'Санкт-Петербург'
                  : 'Онлайн'
              }.`
            );
          });
        } else {
          globalCtx.reply('Сегодня ни у кого нет дня рождения');
        }
      });
    },
    null,
    true,
    'Europe/Moscow'
  );

  let jobEvening = new CronJob(
    '50 * * * * *',
    async function () {
      tomorrow().then((data) => {
        if (data.length) {
          data.forEach((element) => {
            globalCtx.reply(
              `У студента ${element.firstName} ${
                element.lastName
              } завтра день рождения. Локация: ${
                element.typeBootCamp === 'moscow'
                  ? 'Москва'
                  : element.typeBootCamp === 'spb'
                  ? 'Санкт-Петербург'
                  : 'Онлайн'
              }.`
            );
          });
        } else {
          globalCtx.reply('Сегодня ни у кого нет дня рождения');
        }
      });
    },
    null,
    true,
    'Europe/Moscow'
  );

  mongoose.connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const inlineKeyboardNotifications = Telegraf.Markup.inlineKeyboard([
    Telegraf.Markup.callbackButton('Да 💃', 'notify'),
    Telegraf.Markup.callbackButton('Нет 🙅‍♂️', 'nonotify'),
  ]).extra();

  bot.action('notify', async (ctx) => {
    globalCtx = ctx;
    await ctx.reply('Хорошо\n');
    await ctx.reply(
      'Теперь каждый день в 9 часов утра тебе будет приходить уведомление о днях рождениях сегодня'
    );
    await ctx.reply(
      'Так же каждый день в 9 часов вечера тебе будет приходить уведомление о днях рождениях завтра'
    );
    jobMorning.start();
    jobEvening.start();
  });

  bot.action('nonotify', (ctx) => {
    globalCtx = ctx;
    ctx.reply('Хорошо, мы не будем присылать тебе уведомления');
  });

  bot.start(async (ctx) => {
    await ctx.telegram.sendMessage(
      ctx.from.id,
      'Привет, Маша! Ты хочешь получать уведомления?',
      inlineKeyboardNotifications
    );
    await ctx.reply(
      'Нажми /help для того, чтобы узнать про возможности нашего бота. Не забудь выбрать вариант уведомлений из предыдущего сообщения',
      Telegraf.Markup.keyboard([
        ['Сегодня', 'Завтра'],
        ['Остановить уведомления', 'Включить уведомления'],
        ['Проверить включены ли уведомления'],
        ['Ссылка на отправление формы ученикам'],
      ])
        .oneTime()
        .resize()
        .extra()
    );
  });

  bot.hears('Проверить включены ли уведомления', (ctx) => {
    if (jobMorning.running === true) {
      ctx.reply('Уведомления включены');
    } else {
      ctx.reply('Уведомления выключены');
    }
  });

  bot.hears('Отправить ссылку на информацию студенту', (ctx) => {
    ctx.reply('Button is working');
  });

  bot.hears('Остановить уведомления', (ctx) => {
    if ((jobMorning.running === true) & (jobEvening.running === true)) {
      jobMorning.stop();
      jobEvening.stop();
    }
  });

  bot.hears('Включить уведомления', (ctx) => {
    if ((jobMorning.running === false) & (jobEvening.running === false)) {
      jobMorning.start();
      jobEvening.start();
    }
  });

  async function today() {
    let today = new Date().toDateString().split(' ');
    [todayMonth, todayDay] = [today[1], today[2]];
    let students = await Student.find();
    let studentsToday = await Promise.all(
      students.filter((student) => {
        let studentDate = student.dateOfBirth.toDateString().split(' ');
        [StudenttodayMonth, StudenttodayDay] = [studentDate[1], studentDate[2]];
        return todayMonth === StudenttodayMonth && todayDay === StudenttodayDay;
      })
    );
    return studentsToday;
  }

  async function tomorrow() {
    let tomorrow = new Date(
      Date.now() + 1000 * 60 * 60 * 24 + 1000 * 60 * 60 * 3
    )
      .toDateString()
      .split(' ');
    [tomorrowMonth, tomorrowDay] = [tomorrow[1], tomorrow[2]];
    let students = await Student.find();
    let studentsTomorrow = students.filter((student) => {
      let studentDate = student.dateOfBirth.toDateString().split(' ');
      [StudentTomorrowMonth, StudentTomorrowDay] = [
        studentDate[1],
        studentDate[2],
      ];
      return (
        tomorrowMonth === StudentTomorrowMonth &&
        tomorrowDay === StudentTomorrowDay
      );
    });
    return studentsTomorrow;
  }

  bot.help((ctx) =>
    ctx.reply(
      'Маша, привет! Этот телеграм бот создан для того' +
        ' чтобы напоминать тебе о днях рождениях всех учеников' +
        ' эльбруса!\nНажми today, чтобы узнать у кого день рождения' +
        ' сегодня.\nНажми tomorrow, чтоб узнать у кого день рождения завтра \n' +
        'Также один раз при регистрации необходимо написать комманду /start для того,' +
        ' чтобы тебе приходили уведомления два раза в день'
    )
  );

  bot.hears('Сегодня', async (ctx) => {
    let today = new Date().toDateString().split(' ');
    [todayMonth, todayDay] = [today[1], today[2]];
    let students = await Student.find();
    let studentsToday = students.filter((student) => {
      let studentDate = student.dateOfBirth.toDateString().split(' ');
      [StudenttodayMonth, StudenttodayDay] = [studentDate[1], studentDate[2]];
      return todayMonth === StudenttodayMonth && todayDay === StudenttodayDay;
    });
    if (studentsToday.length) {
      studentsToday.forEach((element) => {
        ctx.reply(
          `У студента ${element.firstName} ${
            element.lastName
          } сегодня день рождения. Локация: ${
            element.typeBootCamp === 'moscow'
              ? 'Москва'
              : element.typeBootCamp === 'spb'
              ? 'Санкт-Петербург'
              : 'Онлайн'
          }.`
        );
      });
    } else {
      await ctx.reply('Сегодня ни у кого нет дня рождения');
    }
  });

  bot.hears('Завтра', async (ctx) => {
    let tomorrow = new Date(
      Date.now() + 1000 * 60 * 60 * 24 + 1000 * 60 * 60 * 3
    )
      .toDateString()
      .split(' ');
    [tomorrowMonth, tomorrowDay] = [tomorrow[1], tomorrow[2]];
    let students = await Student.find();
    let studentsTomorrow = students.filter((student) => {
      let studentDate = student.dateOfBirth.toDateString().split(' ');
      [StudentTomorrowMonth, StudentTomorrowDay] = [
        studentDate[1],
        studentDate[2],
      ];
      return (
        tomorrowMonth === StudentTomorrowMonth &&
        tomorrowDay === StudentTomorrowDay
      );
    });
    if (studentsTomorrow.length) {
      studentsTomorrow.forEach((element) => {
        ctx.reply(
          `У студента ${element.firstName} ${
            element.lastName
          } Завтра день рождения \n Локация: ${
            element.typeBootCamp === 'moscow'
              ? 'Москва'
              : element.typeBootCamp === 'spb'
              ? 'Санкт-Петербург'
              : 'Онлайн'
          }.`
        );
      });
    } else {
      await ctx.reply('Завтра ни у кого нет дня рождения');
    }
  });

  bot.on('sticker', (ctx) => ctx.reply('Очень классный стикер'));

  bot.launch();
}

module.exports = bot;

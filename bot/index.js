const { Telegraf } = require('telegraf');
const Student = require('../models/students');
const mongoose = require('mongoose');
const bot = new Telegraf('1270977997:AAF5SnLOh3bnznqKiuMvoiu9JGPvpD3Ecyk');

mongoose.connect('mongodb://localhost:27017/elbrusBirthday', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// async function today() {
//   console.log(user);
//   return user;
// }

bot.start((ctx) => ctx.reply('che prishel? idi naher!'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.command('today', async (ctx) => {
  const date = new Date();
  const today = date.getDate();
  const currentMonth = date.getMonth() + 1;
  await ctx.reply(`${today} ${currentMonth}`);
});

bot.command('tomorrow', async (ctx) => {});

bot.launch();
// bot.startPolling();

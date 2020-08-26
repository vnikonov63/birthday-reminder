const { Telegraf } = require('telegraf');
const Student = require('../models/students');
const mongoose = require('mongoose');
const db = require('../seed');
const bot = new Telegraf('1270977997:AAF5SnLOh3bnznqKiuMvoiu9JGPvpD3Ecyk');

async function today() {
  console.log(user);
  return user;
}

bot.start((ctx) => ctx.reply('che prishel? idi naher!'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.on('text', async (ctx) => {
  const user = await Student.findOne({ firstName: 'Artem' });
  console.log(user);
  ctx.reply(user);
});

bot.launch();

// bot.startPolling();

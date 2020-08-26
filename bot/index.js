const { Telegraf } = require('telegraf');
const Student = require('../models/students');

const bot = new Telegraf('1270977997:AAF5SnLOh3bnznqKiuMvoiu9JGPvpD3Ecyk');

bot.start((ctx) => ctx.reply('che prishel? idi naher!'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.hears('today', async (ctx) => {
  const user = await today();
  ctx.reply(`${user}`);
});

bot.launch();

async function today() {
  const user = await Student.findOne({ firstName: 'Artem' });
  console.log(user);
  return user;
}



// bot.startPolling();

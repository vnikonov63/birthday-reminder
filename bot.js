const { Telegraf } = require("telegraf");
const bot = new Telegraf("986785690:AAH5awaR1tJANp-oGS4t_2vNJPJztioCkdI");

bot.start((ctx) => ctx.reply("Welcome!"));
bot.help((ctx) => ctx.reply("Send me a sticker"));
bot.on("sticker", (ctx) => ctx.reply("👍"));
bot.hears("hi", (ctx) => ctx.reply("Hey there"));
bot.launch();

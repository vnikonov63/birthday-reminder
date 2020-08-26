const { Telegraf } = require("telegraf");
const Student = require("../models/students");
const mongoose = require("mongoose");
const bot = new Telegraf("986785690:AAH5awaR1tJANp-oGS4t_2vNJPJztioCkdI");

mongoose.connect("mongodb://localhost:27017/elbrusBirthday", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// async function today() {
//   console.log(user);
//   return user;
// }

bot.start((ctx) => ctx.reply("che prishel? idi naher!"));
bot.help((ctx) => ctx.reply("Send me a sticker"));
bot.on("sticker", (ctx) => ctx.reply("👍"));
bot.on("text", async (ctx) => {
  // let user = await Student.findOne({ firstName: "Artem" });
  // console.log(user);
  // async function a() {
  //   let result = await Student.findOne({ firstName: "Artem" });
  //   console.log(result);
  //   return result;
  // }
  // const reult = await a();
  // // await ctx.reply("123");
  let result = await Student.findOne({ firstName: "Artem" });
  await ctx.reply(result.firstName);
});

bot.launch();
// bot.startPolling();

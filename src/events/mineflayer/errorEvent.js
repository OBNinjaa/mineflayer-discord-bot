const mineflayer = require("mineflayer");
const colors = require("colors");

/**
 * @param {mineflayer.Bot} bot
 */

module.exports = (bot) => {
  bot.on("error", (err) => {
    console.clear();
    console.log(err.message.red);
    process.exit(1);
  });
};

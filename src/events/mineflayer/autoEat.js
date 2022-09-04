const mineflayer = require("mineflayer");
const autoeat = require("mineflayer-auto-eat");
const colors = require("colors");

const config = require("../../config.json");
const { ownername } = config;

/**
 * @param {mineflayer.Bot} bot
 */

module.exports = (bot) => {
  bot.loadPlugin(autoeat);

  bot.once("spawn", () => {
    bot.autoEat.options = {
      priority: "foodPoints",
      startAt: 14,
      bannedFood: ["rotten_flesh"],
    };
  });

  bot.on("autoeat_started", () => {
    console.log(`[${new Date().toLocaleTimeString().gray}] [${bot.username.yellow}] ${`Automatic eating commenced`.green}`);
  });

  bot.on("autoeat_stopped", () => {
    console.log(`[${new Date().toLocaleTimeString().gray}] [${bot.username.yellow}] ${`Finished eating`.green}`);
  });

  bot.on("health", () => {
    if (bot.food === 20) bot.autoEat.disable();
    else bot.autoEat.enable();
  });
};

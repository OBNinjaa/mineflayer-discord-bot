const mineflayer = require("mineflayer");
const colors = require("colors");

/**
 * @param {mineflayer.Bot} bot
 */

module.exports = (bot) => {
  let isEating = false;

  function eatFood(foodNames) {
    const food = bot.inventory.items().find((item) => {
      return foodNames.includes(item.name);
    });
    if (food) {
      if (bot.food < 20) {
        isEating = true;
        bot.equip(food, "hand");
        bot.activateItem();
        return console.log(`[${new Date().toLocaleTimeString().gray}] [${bot.username.brightYellow}] ${`Eating ${food.name}`.brightGreen}`);
      } else {
        return;
      }
    } else {
      return console.log(`[${new Date().toLocaleTimeString().gray}] [${bot.username.brightYellow}] ${`[Auto Eat] No food to eat...`.brightGreen}`);
    }
  }

  const foodNames = [
    "golden_apple",
    "apple",
    "cooked_beef",
    "enchanted_golden_apple",
    "cooked_porkchop",
    "sweet_berries",
    "glow_berries",
    "pumpkin_pie",
    "melon_slice",
    "cooked_mutton",
    "rabbit_stew",
    "mushroom_stew",
    "cooked_chicken",
  ];

  bot.once("spawn", () => {
    bot.on("health", () => {
      if (bot.food === 20) {
        isEating = false;
        return;
      }
      if (bot.food <= 19 && !isEating) {
        eatFood(foodNames);
      }
    });
  });
};

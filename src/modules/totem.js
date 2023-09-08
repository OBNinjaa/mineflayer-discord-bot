const mineflayer = require("mineflayer");

/**
 * @param {mineflayer.Bot} bot
 */

module.exports = (bot) => {
  bot.on("chat", (username, message) => {
    if (message === "$totem") {
      bot.status.isTotem = true;
      bot.on("physicsTick", () => {
        const totem = bot.inventory.items().find((item) => item.name === "totem_of_undying");
        if (!totem) {
          return;
        }
        const offHandSlot = bot.inventory.slots[45];
        if (offHandSlot && offHandSlot.name === "totem_of_undying") {
          return;
        }

        bot.equip(totem, "off-hand");
      });
    }
  });
};

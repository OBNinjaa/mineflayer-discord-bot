const mineflayer = require("mineflayer");

/**
 * @param {mineflayer.Bot} bot
 */

module.exports = (bot) => {
  let lastAttacker = null;
  let lastHealth;

  bot.on("physicsTick", () => {
    lastHealth = bot.health;
  });

  bot.on("entitySwingArm", (entity) => {
    if (entity.type === "player") {
      lastAttacker = entity.username;
    }
  });

  bot.on("health", () => {
    if (lastAttacker && bot.health < lastHealth) {
      const playerEntity = bot.players[lastAttacker]?.entity;
      if (playerEntity) {
        bot.pvp.attack(playerEntity);
      }
    }
  });

  bot.on("chat", (username, message) => {
    if (message === "$stop") {
      bot.pvp.stop();
    }
  });
};

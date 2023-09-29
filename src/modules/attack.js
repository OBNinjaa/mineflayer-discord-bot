const mineflayer = require("mineflayer");
const Vec3 = require("vec3");
const path = require("path");
const fs = require("fs");

const playerLogStatus = {};

/**
 * @param {mineflayer.Bot} bot
 */
module.exports = (bot) => {
  function processEntityMoved(entity) {
    if (entity.type === "player") {
      const playerPosition = entity.position;
      const playerUsername = entity.username;

      const jsonFilePath = path.join(__dirname, "..", "data", "homes.json");

      try {
        const homesData = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));

        for (const address in homesData.homes) {
          const serverHomes = homesData.homes[address];
          for (const homeName in serverHomes) {
            const homeData = serverHomes[homeName];
            const homePosition = new Vec3(homeData.x, homeData.y, homeData.z);

            const botDistance = bot.entity.position.distanceTo(homePosition);
            const playerDistance = playerPosition.distanceTo(homePosition);

            const isBlacklisted = homeData.blacklist && homeData.blacklist.includes(playerUsername);
            const isPlayerLogged = playerLogStatus[playerUsername];

            if (botDistance <= 50 && playerDistance <= 50 && isBlacklisted && !isPlayerLogged) {
              bot.chat(`Player ${playerUsername} (blacklisted) is within 50 blocks of home "${homeName}" at X:${homeData.x}, Y:${homeData.y}, Z:${homeData.z}`);
              playerLogStatus[playerUsername] = true;
              bot.pvp.attack(entity);
            } else if (playerDistance > 50 && isPlayerLogged) {
              playerLogStatus[playerUsername] = false;
              bot.pvp.stop();
            }
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
  }

  bot.on("chat", (username, message) => {
    if (message === "$guard" || message === "$protect") {
      if (!bot.status.isGuarding) {
        bot.status.isGuarding = true;
        bot.chat(`Guard Status ${bot.status.isGuarding ? "Enabled" : "Disabled"}`);
        bot.on("entityMoved", processEntityMoved);
      }
    } else if (message === "$unprotect" || message === "$unguard") {
      if (bot.status.isGuarding) {
        bot.pvp.stop();
        bot.status.isGuarding = false;
        bot.chat(`Guard Status ${bot.status.isGuarding ? "Enabled" : "Disabled"}`);
        bot.off("entityMoved", processEntityMoved);
      }
    }
  });
};

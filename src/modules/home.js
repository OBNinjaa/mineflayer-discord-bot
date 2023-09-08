const mineflayer = require("mineflayer");
const path = require("path");

const pathfinder = require("mineflayer-pathfinder").pathfinder;
const Movements = require("mineflayer-pathfinder").Movements;
const { GoalNear } = require("mineflayer-pathfinder").goals;
const fs = require("fs");

/**
 * @param {mineflayer.Bot} bot
 */
module.exports = (bot) => {
  bot.on("chat", (username, message) => {
    if (username === bot.username) return;

    const args = message.split(" ");
    const command = args[0].toLowerCase();

    if (command === "$gethome" && args.length === 2) {
      const homeName = args[1];
      const address = bot._client.socket._host.toLowerCase();

      const filePath = path.join(__dirname, "..", "data", "homes.json");
      const homesData = JSON.parse(fs.readFileSync(filePath, "utf8")).homes[address.toLowerCase()];

      if (homesData && homesData[homeName]) {
        const homeData = homesData[homeName];
        const { x, y, z, blacklist } = homeData;

        let blacklistStr = "No one is blacklisted.";
        if (blacklist && blacklist.length > 0) {
          blacklistStr = `Blacklisted: ${blacklist.join(", ")}`;
        }

        bot.chat(`Home "${homeName}" info - X: ${x}, Y: ${y}, Z: ${z}, ${blacklistStr}`);
      } else {
        bot.chat(`Home "${homeName}" not found on this server.`);
      }
    } else if (command === "$listhomes") {
      const address = bot._client.socket._host.toLowerCase();

      const filePath = path.join(__dirname, "..", "data", "homes.json");
      const homesData = JSON.parse(fs.readFileSync(filePath, "utf8")).homes[address.toLowerCase()];

      if (homesData) {
        const homeNames = Object.keys(homesData);
        bot.chat(`Homes saved on this server: ${homeNames.join(", ")}`);
      } else {
        bot.chat("No homes saved on this server.");
      }
    } else if (command === "$gohome" && args.length === 2) {
      const homeName = args[1];
      const address = bot._client.socket._host.toLowerCase();

      const filePath = path.join(__dirname, "..", "data", "homes.json");
      const homesData = JSON.parse(fs.readFileSync(filePath, "utf8")).homes[address.toLowerCase()];

      if (homesData && homesData[homeName]) {
        const homeData = homesData[homeName];
        const { x, y, z } = homeData;

        bot.chat(`Coordinates for home "${homeName}" - X: ${x}, Y: ${y}, Z: ${z}`);
        const defaultMove = new Movements(bot);
        bot.pathfinder.setMovements(defaultMove);
        bot.pathfinder.setGoal(new GoalNear(x, y, z, 1));
      } else {
        bot.chat(`Home "${homeName}" not found on this server.`);
      }
    }
  });
};

const mineflayer = require("mineflayer");
const fs = require("fs");
const path = require("path");
const Vec3 = require("vec3");

/**
 * @param {mineflayer.Bot} bot
 */
module.exports = (bot) => {
  bot.on("chat", (username, message) => {
    if (username === bot.username || !message.startsWith("$sethome")) return;

    const args = message.split(" ");
    const command = args[0].toLowerCase();
    const homeName = args[1];
    const x = parseFloat(args[2]);
    const y = parseFloat(args[3]);
    const z = parseFloat(args[4]);
    const blacklist = args.slice(5);

    if (command === "$sethome" && homeName && !isNaN(x) && !isNaN(y) && !isNaN(z)) {
      const address = bot._client.socket._host.toLowerCase();

      let homes = {};
      const jsonFilePath = path.join(__dirname, "..", "data", "homes.json");

      fs.readFile(jsonFilePath, "utf8", (err, data) => {
        if (err) {
          console.error(err.message);
          bot.chat("Failed to read the JSON file.");
          return;
        }

        try {
          homes = JSON.parse(data);
        } catch (parseErr) {
          console.error(parseErr);
          bot.chat("Failed to parse the JSON file.");
          return;
        }

        if (!homes.homes) {
          homes.homes = {};
        }

        if (!homes.homes[address]) {
          homes.homes[address] = {};
        }

        homes.homes[address][homeName] = {
          x: x,
          y: y,
          z: z,
          blacklist: blacklist || [],
        };

        fs.writeFile(jsonFilePath, JSON.stringify(homes, null, 2), (writeErr) => {
          if (writeErr) {
            console.error(writeErr);
            bot.chat("Failed to save the home to the JSON file.");
          } else {
            bot.chat(`Home "${homeName}" saved at x:${x}, y:${y}, z:${z}`);
            // getRadius(bot, x, y, z);
          }
        });
      });
    } else {
      bot.chat("Invalid command. Usage: !sethome <homeName> <x> <y> <z> [<blacklist>]");
    }
  });

  /**
   * @param {mineflayer.Bot} bot
   * @param {number} centerX - X coordinate of the center point
   * @param {number} centerY - Y coordinate of the center point
   * @param {number} centerZ - Z coordinate of the center point
   */

  function getRadius(bot, centerX, centerY, centerZ) {
    const radius = 50;
    const minX = centerX - radius;
    const minY = centerY - radius;
    const minZ = centerZ - radius;
    const maxX = centerX + radius;
    const maxY = centerY + radius;
    const maxZ = centerZ + radius;

    for (let x = minX; x <= maxX; x++) {
      for (let z = minZ; z <= maxZ; z++) {
        const block = bot.blockAt(new Vec3(x, centerY, z));
        if (block.name !== "air") {
          console.log(`Block at (${x}, ${centerY}, ${z}): ${block.name}`);
          bot.chat(`/fill ${x} ${centerY} ${z} ${x} ${centerY} ${z} grass_block`);
        }
      }
    }
  }
};

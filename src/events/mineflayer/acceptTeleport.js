const mineflayer = require("mineflayer");
const colors = require("colors");

const config = require("../../config.json");
const { ownername } = config;

/**
 * @param {mineflayer.Bot} bot
 */

module.exports = (bot) => {
  var regexTeleport = /([0-9a-zA-Z_]{1,16}) has requested (?:that you|to) teleport to (you|them)\./;

  var whitelist = [ownername];
  bot.on("messagestr", async function (message) {
    var match = regexTeleport.exec(message);
    if (!match) return;
    var username = match[1];
    var type = match[2] == "you" ? "to you" : "to them";
    console.log(`[${new Date().toLocaleTimeString().gray}] [${username.green}] ${`has requested a teleport`.yellow} ${type.yellow}`);
    if (!whitelist.includes(username)) return;
    bot.chat("/tpaccept");
  });
};

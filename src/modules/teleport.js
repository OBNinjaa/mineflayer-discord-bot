const mineflayer = require("mineflayer");
const colors = require("colors");

/**
 * @param {mineflayer.Bot} bot
 */

module.exports = (bot) => {
  var regexTeleport = /([0-9a-zA-Z_]{1,16}) has requested (?:that you|to) teleport to (you|them)\./;

  var whitelist = ["OBNinjaa"];

  bot.on("messagestr", async function (message) {
    if (!whitelist.includes(username)) return;
    var match = regexTeleport.exec(message);
    if (!match) return;
    var username = match[1];
    var type = match[2] == "you" ? "to you" : "to them";
    console.log(`[${new Date().toLocaleTimeString().gray}] [${username.brightGreen}] ${`has requested a teleport`.brightYellow} ${type.brightYellow}`);

    return bot.chat("/tpaccept");
  });
};

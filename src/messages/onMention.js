/**
 * @file Default Bot Mention Command
 * @author OBNinjaa
 * @since 3.0.0
 */

const { prefix } = require("../config.json");

module.exports = {
  /**
   * @description Executes when the bot is pinged.
   * @author OBNinjaa
   * @param {Object} message The Message Object of the command.
   */

  async execute(message) {
    return message.channel.send(`Hi ${message.author}! My prefix is \`${prefix}\`, get help by entering \`${prefix}help\``);
  },
};

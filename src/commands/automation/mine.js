/**
 * @file Mine command
 * @author OBNinjaa
 * @since 1.0.0
 */

const bot = require(`../../index`);
const { prefix, successColor, errorColor, infoColor } = require("./../../config.json");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "mine",
  description: "Make the bot mine blocks for you.",
  aliases: ["collect", "gather"],
  usage: "diamond_ore",
  cooldown: 5,
  args: true,
  category: "automation",

  /**
   * @description Executes when the command is called by command handler.
   * @author OBNinjaa
   * @param {Object} message The Message Object of the command.
   * @param {String[]} args The Message Content of the received message seperated by spaces (' ') in an array, this excludes prefix and command/alias itself.
   */

  async execute(message, args) {
    // Will add when I can be bothered :)
  },
};

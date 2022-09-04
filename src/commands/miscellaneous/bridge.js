/**
 * @file Dynamic help command
 * @author OBNinjaa
 * @since 1.0.0
 */

const bot = require(`../../index`);
const { prefix } = require("./../../config.json");
const { MessageEmbed } = require("discord.js");

const config = require("../../config.json");
const { ownername } = config;

module.exports = {
  name: "send",
  description: "List all commands of bot or info about a specific command.",
  aliases: ["msg", "say"],
  usage: "[my message]",
  cooldown: 10,
  category: "miscellaneous",

  /**
   * @description Executes when the command is called by command handler.
   * @author OBNinjaa
   * @param {Object} message The Message Object of the command.
   * @param {String[]} args The Message Content of the received message seperated by spaces (' ') in an array, this excludes prefix and command/alias itself.
   */

  execute(message, args) {
    if (message.author.bot) return;
    if (!message.guild) return;

    if (args.length === 0) {
      return message.reply(`Please enter a message to send.`);
    }

    if (args[0].startsWith("/")) {
      return message.reply(`You are unable to execute commands.`);
    }

    let customMessage = args.join(" ");
    bot.chat(customMessage);
    message.react("👍");
  },
};

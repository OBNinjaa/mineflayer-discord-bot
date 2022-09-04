/**
 * @file Status Command
 * @author OBNinjaa
 * @since 1.0.0
 */

const bot = require(`../../index`);
const { prefix, successColor, errorColor, infoColor } = require("./../../config.json");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "status",
  description: "Get the current bot status. Health, hunger, etc.",
  aliases: ["stats", "info"],
  usage: "",
  cooldown: 5,
  args: false,

  /**
   * @description Executes when the command is called by command handler.
   * @author OBNinjaa
   * @param {Object} message The Message Object of the command.
   * @param {String[]} args The Message Content of the received message seperated by spaces (' ') in an array, this excludes prefix and command/alias itself.
   */

  async execute(message, args) {
    const statusEmbed = new MessageEmbed();
    statusEmbed.setColor(infoColor);
    statusEmbed.setTitle(`${bot.username}'s Status`);
    statusEmbed.setDescription(`Health: ${bot.health}\nFood: ${bot.food}\nXP: ${bot.experience.level}`);
    statusEmbed.setThumbnail(`https://crafatar.com/renders/head/${bot.player.uuid}?overlay`);
    statusEmbed.setTimestamp();
    return message.channel.send({ embeds: [statusEmbed] }).catch((error) => {
      message.reply({ content: error.message });
    });
  },
};

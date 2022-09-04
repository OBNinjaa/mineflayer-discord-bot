/**
 * @file Location command
 * @author OBNinjaa
 * @since 1.0.0
 */

const bot = require(`../../index`);
const { prefix, successColor, errorColor } = require("./../../config.json");
const { MessageEmbed } = require("discord.js");

const { pathfinder, Movements } = require("mineflayer-pathfinder");
const { GoalBlock } = require("mineflayer-pathfinder").goals;

bot.loadPlugin(pathfinder);

module.exports = {
  name: "location",
  description: "This commands shows the current location of the bot.",
  aliases: ["location", "coords"],
  usage: "location",
  cooldown: 5,
  args: false,
  category: "information",

  /**
   * @description Executes when the command is called by command handler.
   * @author OBNinjaa
   * @param {Object} message The Message Object of the command.
   */

  async execute(message) {
    const X = bot.entity.position.x.toFixed(1);
    const Y = bot.entity.position.y.toFixed(1);
    const Z = bot.entity.position.z.toFixed(1);

    let locationEmbed = new MessageEmbed();
    locationEmbed.setColor(successColor);
    locationEmbed.setTitle(`**${bot.username}** Location`);
    locationEmbed.addField(`The current location for **${bot.username}**:`, `\n**X:** ${X}\n**Y:** ${Y}\n**Z:** ${Z}`);

    return message.channel.send({ embeds: [locationEmbed] });
  },
};

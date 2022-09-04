/**
 * @file teleport command
 * @author OBNinjaa
 * @since 1.0.0
 */

const bot = require(`../../index`);
const { prefix, successColor, errorColor, infoColor } = require("./../../config.json");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "teleport",
  description: "This command allows you to teleport the bot to a player.",
  aliases: ["tp"],
  usage: "<player>",
  cooldown: 5,
  args: true,
  category: "miscellaneous",

  /**
   * @description Executes when the command is called by command handler.
   * @author OBNinjaa
   * @param {Object} message The Message Object of the command.
   * @param {String[]} args The Message Content of the received message seperated by spaces (' ') in an array, this excludes prefix and command/alias itself.
   */

  async execute(message, args) {
    const userTo = args.join(" ").split(" ");
    if (userTo.length !== 1) {
      return message.reply(`Please enter 1 argument, the name of the user you want to teleport to.`);
    }
    let userToEmbed = new MessageEmbed();
    userToEmbed.setColor(successColor);
    userToEmbed.setTitle("Teleporting Started!");
    userToEmbed
      .setDescription(
        `**${bot.username}** has sent a teleport request to **${userTo}**.\nYou can use \`${prefix}location\` to check the current location.`
      )
      .addField(`User currently set:`, `\n**User:** **${userTo[0]}**`);
    message.channel.send({ embeds: [userToEmbed] });
    bot.chat(`/tpa ${userTo[0]}`);
  },
};

/**
 * @file Attck Command
 * @author OBNinjaa
 * @since 1.0.0
 */

const bot = require(`../../index`);
const { prefix, successColor, errorColor, infoColor } = require("./../../config.json");
const { MessageEmbed } = require("discord.js");

const { pathfinder, Movements, goals } = require("mineflayer-pathfinder");
const pvp = require("mineflayer-pvp").plugin;

bot.loadPlugin(pathfinder);
bot.loadPlugin(pvp);

module.exports = {
  name: "attack",
  description: "This command allows you to attack a player.",
  aliases: ["pvp", "hunt"],
  usage: "OBNinjaa",
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
    const player = bot.players[args[0]];
    if (!player) {
      const errorEmbed = new MessageEmbed();
      errorEmbed.setColor(errorColor);
      errorEmbed.setTitle(`**Invalid Username**`);
      errorEmbed.addField("Player not found!", `\nPlease check the player's name and try again.`);
      return message.channel.send({ embeds: [errorEmbed] });
    }
    bot.on("stoppedAttacking", () => {
      const successEmbed = new MessageEmbed();
      successEmbed.setColor(successColor);
      successEmbed.setThumbnail(`https://crafatar.com/renders/head/${player.entity.uuid}?overlay`);
      successEmbed.setTitle(`**Attack Stopped!**`);
      successEmbed.addField(
        `**${bot.username}** has stopped attacking **${player.username}**!`,
        `\nYou can enter ${prefix}stats to check the bots health and other basic information.`
      );
      return message.channel.send({ embeds: [successEmbed] });
    });
    bot.pvp
      .attack(player.entity, (speed = 1))
      .then(() => {
        const successEmbed = new MessageEmbed();
        successEmbed.setColor(successColor);
        successEmbed.setThumbnail(`https://crafatar.com/renders/head/${player.entity.uuid}?overlay`);
        successEmbed.setTitle(`**Attack Commenced!**`);
        successEmbed.addField(
          `**${bot.username}** is now attacking **${player.username}**!`,
          `\nYou will be notified when **${player.username}** is dead.`
        );
        return message.channel.send({ embeds: [successEmbed] });
      })
      .catch((error) => {
        const errorEmbed = new MessageEmbed();
        errorEmbed.setColor(errorColor);
        errorEmbed.setTitle(`**There was an error!**`);
        errorEmbed.addField("An error occurred", `\n${error}`);
        return message.channel.send({ embeds: [errorEmbed] });
      });
  },
};

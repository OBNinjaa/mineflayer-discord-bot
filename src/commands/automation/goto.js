/**
 * @file Goto command
 * @author OBNinjaa
 * @since 1.0.0
 */

const bot = require(`../../index`);
const { prefix, successColor, errorColor, infoColor } = require("./../../config.json");
const { MessageEmbed } = require("discord.js");

const { pathfinder, Movements } = require("mineflayer-pathfinder");
const { GoalBlock } = require("mineflayer-pathfinder").goals;

bot.loadPlugin(pathfinder);

module.exports = {
  name: "goto",
  description: "This commands allows you to move the bot to a different location.",
  aliases: ["path", "move"],
  usage: "-150 50 -2400",
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
    const myPath = args.join(" ").split(" ");
    if (myPath.length !== 3) {
      return message.reply(`Please enter 3 arguments, the first being the x axis, the second being the y axis, and the third being the z axis.`);
    }
    let pathEmbed = new MessageEmbed();
    pathEmbed;
    pathEmbed.setColor(successColor);
    pathEmbed.setTitle("Pathfinding Started!");
    pathEmbed
      .setDescription(
        `**${bot.username}** is now moving to the location that you specified.\nYou can use \`${prefix}location\` to check the current path.`
      )
      .addField(`Path currently set:`, `\n**X:** ${myPath[0]} \n**Y:** ${myPath[1]} \n**Z:** ${myPath[2]}`);

    const mcData = require("minecraft-data")(bot.version);
    const defaultMove = new Movements(bot, mcData);
    defaultMove.canDig = true;
    defaultMove.allowFreeMotion = true;
    defaultMove.scafoldingBlocks.push(mcData.itemsByName["dirt"].id);
    bot.pathfinder.setMovements(defaultMove);
    bot.pathfinder.setGoal(new GoalBlock(myPath[0], myPath[1], myPath[2]));

    return message.channel.send({ embeds: [pathEmbed] }).then(() => {
      bot.on("goal_reached", () => {
        let successEmbed = new MessageEmbed();
        successEmbed.setColor(successColor);
        successEmbed.setTitle("Pathfinding Completed!");
        successEmbed.setColor(successColor);
        successEmbed.setDescription(
          `**${bot.username}** has reached the location that you specified.\nYou can use \`${prefix}location\` to check if the location the bot is at is correct.`
        );
        return message.channel.send({ embeds: [successEmbed] });
      });
    });
  },
};

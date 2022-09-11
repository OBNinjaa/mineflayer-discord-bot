/**
 * @file Guard Command
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
  name: "guard",
  description: "The bot will guard the surrounding area from mobs and other players.",
  aliases: ["protect"],
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
    let guardPos = null;

    function guardArea(pos) {
      guardPos = pos;

      if (!bot.pvp.target) {
        moveToGuardPos();
      }
    }

    function stopGuarding() {
      guardPos = null;
      bot.pvp.stop();
      bot.pathfinder.setGoal(null);
    }

    function moveToGuardPos() {
      const mcData = require("minecraft-data")(bot.version);
      bot.pathfinder.setMovements(new Movements(bot, mcData));
      bot.pathfinder.setGoal(new goals.GoalBlock(guardPos.x, guardPos.y, guardPos.z));
    }

    bot.on("stoppedAttacking", () => {
      if (guardPos) {
        moveToGuardPos();
      }
    });

    bot.on("physicsTick", () => {
      if (!guardPos) return;

      const filter = (e) => e.type === "mob" && e.position.distanceTo(bot.entity.position) < 16 && e.mobType !== "Armor Stand";

      const entity = bot.nearestEntity(filter);
      if (entity) {
        bot.pvp.attack(entity);
      }
    });

    bot.on("chat", (username, message) => {
      if (message === "guard") {
        const player = bot.players[username];

        if (!player) {
          message.channel.send("I can't see you.");
          return;
        }

        message.channel.send("I will guard that location.");
        guardArea(player.entity.position);
      }

      bot.once("death", () => {
        message.channel.send(`I have died and am no longer guarding!`);
        stopGuarding();
      });
    });
  },
};

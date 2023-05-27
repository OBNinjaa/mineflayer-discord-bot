const { SlashCommandBuilder } = require("discord.js");
const bot = require("../bot");

let movementEnabled = false;
let movementInterval = null;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("afk")
    .setDescription("Toggle anti AFK on or off.")
    .addBooleanOption((option) => option.setName("toggle").setDescription("Toggle on or off.")),
  async execute(interaction) {
    const toggle = interaction.options.getBoolean("toggle");

    if (toggle === null) {
      if (movementEnabled) {
        return interaction.reply("Anti AFK is currently **enabled**.");
      } else {
        return interaction.reply("Anti AFK is currently **disabled**.");
      }
    } else {
      if (toggle) {
        if (movementEnabled) {
          return interaction.reply("Anti AFK is already **enabled**.");
        } else {
          movementEnabled = true;
          startRandomMovement();
          return interaction.reply("Anti AFK is now **enabled**. Bot will move in random directions every 10 seconds.");
        }
      } else {
        if (!movementEnabled) {
          return interaction.reply("Anti AFK is already **disabled**.");
        } else {
          movementEnabled = false;
          stopRandomMovement();
          return interaction.reply("Anti AFK is now **disabled**.");
        }
      }
    }
  },
};

function startRandomMovement() {
  movementInterval = setInterval(moveRandomly, 10000);
}

function stopRandomMovement() {
  clearInterval(movementInterval);
  movementInterval = null;
  bot.clearControlStates();
}

function moveRandomly() {
  const directions = ["forward", "back", "left", "right"];
  const randomDirection = directions[Math.floor(Math.random() * directions.length)];
  bot.setControlState(randomDirection, true);
  setTimeout(() => bot.clearControlStates(), 1000);
}

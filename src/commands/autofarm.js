const { SlashCommandBuilder } = require("discord.js");
const bot = require("../bot");

let farmingEnabled = false;
let farmingInterval = null;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("autofarm")
    .setDescription("Toggle automatic farming on or off.")
    .addBooleanOption((option) => option.setName("toggle").setDescription("Toggle automatic farming on or off.")),
  async execute(interaction) {
    const toggle = interaction.options.getBoolean("toggle");

    if (toggle === null) {
      if (farmingEnabled) {
        return interaction.reply("Automatic farming is currently **enabled**.");
      } else {
        return interaction.reply("Automatic farming is currently **disabled**.");
      }
    } else {
      if (toggle) {
        if (farmingEnabled) {
          return interaction.reply("Automatic farming is already **enabled**.");
        } else {
          farmingEnabled = true;
          startAutomaticFarming();
          return interaction.reply("Automatic farming is now **enabled**. Bot will start farming automatically.");
        }
      } else {
        if (!farmingEnabled) {
          return interaction.reply("Automatic farming is already **disabled**.");
        } else {
          farmingEnabled = false;
          stopAutomaticFarming();
          return interaction.reply("Automatic farming is now **disabled**.");
        }
      }
    }
  },
};

function startAutomaticFarming() {
  farmingInterval = setInterval(farmAutomatically, 5000);
}

function stopAutomaticFarming() {
  clearInterval(farmingInterval);
  farmingInterval = null;
  //
}

function farmAutomatically() {
  //
}

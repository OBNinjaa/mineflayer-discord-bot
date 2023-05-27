const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const bot = require("../bot");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("chat")
    .setDescription("Have the bot send a message to the server.")
    .addStringOption((option) => option.setName("message").setDescription("The message to send to the server")),
  async execute(interaction) {
    const value = interaction.options.getString("message");

    if (value && !value.startsWith("/")) {
      bot.chat(value);
      return interaction.reply({ content: `Sent: ${value}` });
    }

    return interaction.reply("You did not input a valid message to send!");
  },
};

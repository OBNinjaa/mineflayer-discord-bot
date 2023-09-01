const { SlashCommandBuilder } = require("discord.js");
const { Embed } = require("../../classes/Embed");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("chat")
    .setDescription("Have the bot send messages.")
    .addStringOption((option) => option.setName("message").setDescription("The message you want to send.").setRequired(true)),
  async execute(interaction, bot) {
    if (!interaction.member.roles.cache.some((role) => role.name === "chat-enabled")) {
      const perm = new Embed(bot).setTitle("Improper Permissions").setDescription(`You do not have permission to use this command. You need the \`chat-enabled\` role to use this command.`);
      return interaction.reply({ embeds: [perm], ephemeral: true });
    }

    const message = interaction.options.getString("message");

    if (message.startsWith("/")) {
      const cmd = new Embed(bot).setTitle("Something Went Wrong").setDescription("Sorry, you cannot send messages that start with `/`");
      return interaction.reply({ embeds: [cmd], ephemeral: true });
    }

    await bot.chat(message);

    const sent = new Embed(bot).setTitle("Message Has Been Sent").setDescription("Your message has now been sent to the server.");
    await interaction.reply({ embeds: [sent] });
  },
};

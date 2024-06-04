const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  cooldown: 10,
  data: new SlashCommandBuilder()
    .setName("message")
    .setDescription("Allows you to send messages as the bot to the minecraft server.")
    .addStringOption((option) => option.setName("message").setDescription("The message you want to send.").setRequired(true)),
  async execute(interaction, bot) {
    const role = interaction.guild.roles.cache.find((role) => role.name === "chat-enabled");
    if (!role) {
      return interaction.reply({ content: "Could not find the `chat-enabled` role. Please make sure it exists and that the bot has the necessary permissions to read roles.", ephemeral: true });
    }
    if (!interaction.member.roles.cache.has(role.id)) {
      return interaction.reply({ content: `You do not have permission to use this command. You need to have the <@&${role.id}> role to use this command.`, ephemeral: true });
    }

    const message = interaction.options.getString("message");

    if (message.startsWith("/")) {
      return interaction.reply({ content: "Sorry, you cannot send messages that start with `/` This is so users can't abuse certain ingame commands e.g teleportation.", ephemeral: true });
    }

    bot.chat(message);

    return interaction.reply({ content: "Your message has now been sent to the server." });
  },
};

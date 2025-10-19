const { SlashCommandBuilder, PermissionsBitField, MessageFlags } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Clean messages from your chat room.')
    .addIntegerOption((option) =>
      option.setName('amount').setDescription('The amount of messages to clear (2-100).').setRequired(true).setMinValue(2).setMaxValue(100),
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages),

  /**
   * @param {import('mineflayer').Bot} bot
   */
  async execute(interaction, bot) {
    const amount = interaction.options.getInteger('amount');

    try {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });

      const channel = interaction.channel ?? (await interaction.client.channels.fetch(interaction.channelId));

      const { size } = await channel.bulkDelete(amount, false);
      await interaction.editReply({
        content: `Successfully purged ${size} messages.`,
      });
    } catch (error) {
      await interaction.editReply({
        content: 'I can only delete messages that are under 14 days old.',
      });
    }
  },
};

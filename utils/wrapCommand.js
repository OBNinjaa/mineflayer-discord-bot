module.exports = function wrapCommand(command, options = {}) {
  const allowWhenBusy = options.allowWhenBusy !== false;

  return async function wrappedCommand(interaction, bot) {
    if (bot.config.is_busy && !allowWhenBusy) {
      await interaction.reply({
        content: 'I am currently busy executing a task. Try again later.',
        ephemeral: true,
      });
      return;
    }

    try {
      await command(interaction, bot);
    } catch (error) {
      console.error(`Error in ${interaction.commandName}:`, error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: 'There was an error while executing this command!',
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: 'There was an error while executing this command!',
          ephemeral: true,
        });
      }
    }
  };
};

const { SlashCommandBuilder, ButtonStyle } = require("discord.js");
const { Embed } = require("../../classes/Embed");

const Movements = require("mineflayer-pathfinder").Movements;
const { GoalNear } = require("mineflayer-pathfinder").goals;

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("follow")
    .setDescription("Have the bot move to a specified users location.")
    .addStringOption((option) => option.setName("username").setDescription("The player's username.").setRequired(true)),
  async execute(interaction, bot) {
    const name = interaction.options.getString("username");

    const player = bot.players[name];
    if (!player) {
      await interaction.reply({ content: "Player not found.", ephemeral: true });
      return;
    }

    const botPosition = bot.entity.position;
    const playerPosition = player.entity.position;
    const distance = botPosition.distanceTo(playerPosition);

    if (distance > 100) {
      await interaction.reply({ content: "Player is too far away.", ephemeral: true });
      return;
    }

    const movements = new Movements(bot, bot.entity);
    movements.allow1by1towers = false;
    movements.scafoldingBlocks.push(bot.registry.itemsByName.dirt.id);
    movements.allowFreeMotion = true;
    movements.canDig = true;

    bot.pathfinder.setMovements(movements);
    bot.pathfinder.setGoal(new GoalNear(playerPosition.x, playerPosition.y, playerPosition.z, 1));

    const embed = new Embed(bot).setTitle("Following Player").setDescription(`Now moving towards player: ${name}`);

    await interaction.reply({ embeds: [embed] });
  },
};

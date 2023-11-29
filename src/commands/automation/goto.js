const { SlashCommandBuilder } = require("discord.js");
const { Embed } = require("../../classes/Embed");

const Movements = require("mineflayer-pathfinder").Movements;
const { GoalNear } = require("mineflayer-pathfinder").goals;

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("goto")
    .setDescription("Have the bot move to specific coordinates.")
    .addStringOption((option) => option.setName("x").setDescription("The X coordinate.").setRequired(true))
    .addStringOption((option) => option.setName("y").setDescription("The Y coordinate.").setRequired(true))
    .addStringOption((option) => option.setName("z").setDescription("The Z coordinate.").setRequired(true)),
  async execute(interaction, bot) {
    const x = interaction.options.getString("x");
    const y = interaction.options.getString("y");
    const z = interaction.options.getString("z");

    const position = bot.entity.position;
    const roundedX = Math.floor(position.x);
    const roundedY = Math.floor(position.y);
    const roundedZ = Math.floor(position.z);

    const initialize = new Embed(bot).setTitle("Pathfinding Has Initialized").setDescription(`pathfinding to the specified coordinates: \`${x} ${y} ${z}\`\nYou will be notified when the path has been reached.`);
    await interaction.reply({ embeds: [initialize] });

    const defaultMove = new Movements(bot);
    bot.pathfinder.setMovements(defaultMove);
    bot.pathfinder.setGoal(new GoalNear(x, y, z, 1));

    bot.on("path_update", (path) => {
      if (path.status === "noPath") {
        const noPath = new Embed(bot).setTitle("Unable To Reach Path").setDescription(`The bot is unable to reach the path: \`${roundedX}, ${roundedY}, ${roundedZ}\`\nMake sure the bot has enough meterial to build!`);
        return interaction.editReply({ embeds: [noPath] });
      }
    });

    bot.once("goal_reached", () => {
      const stopped = new Embed(bot).setTitle("Pathfinding Has Stopped").setDescription(`The coordinates have been reached. The bots current path is as follows: \`${roundedX}, ${roundedY}, ${roundedZ}\``);
      return interaction.followUp({ embeds: [stopped] });
    });
  },
};

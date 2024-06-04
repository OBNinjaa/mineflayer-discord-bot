const { SlashCommandBuilder } = require("discord.js");
const { Embed } = require("../../classes/Embed");

const Movements = require("mineflayer-pathfinder").Movements;
const { GoalNear } = require("mineflayer-pathfinder").goals;

module.exports = {
  cooldown: 15,
  data: new SlashCommandBuilder()
    .setName("pathfinder")
    .setDescription("This command allows the bot move towards specific coordinates within the minecraft world.")
    .addStringOption((option) => option.setName("x").setDescription("The X coordinate.").setRequired(true))
    .addStringOption((option) => option.setName("y").setDescription("The Y coordinate.").setRequired(true))
    .addStringOption((option) => option.setName("z").setDescription("The Z coordinate.").setRequired(true)),
  async execute(interaction, bot) {
    const x = interaction.options.getString("x");
    const y = interaction.options.getString("y");
    const z = interaction.options.getString("z");

    const defaultMove = new Movements(bot);
    bot.pathfinder.setMovements(defaultMove);
    bot.pathfinder.setGoal(new GoalNear(x, y, z, 1));

    const position = bot.entity.position;
    const roundedX = Math.floor(position.x);
    const roundedY = Math.floor(position.y);
    const roundedZ = Math.floor(position.z);

    const embed = new Embed(bot).setTitle("Pathfinding has initiated").setFields({ name: "Current goal", value: `${x}, ${y}, ${z}` });
    await interaction.reply({ embeds: [embed] });

    bot.on("path_update", (path) => {
      if (path.status === "noPath") {
        const { cX, cY, cZ } = bot.entity.position;

        const embed = new Embed(bot).setTitle("Pathfinding has failed").setFields({ name: "Current position", value: `${cX}, ${cY}, ${cZ}` }, { name: "Current goal", value: `${x}, ${y}, ${z}` });
        interaction.followUp({ embeds: [embed] });
      }
    });

    bot.once("goal_reached", () => {
      const { x, y, z } = bot.entity.position;

      const embed = new Embed(bot).setTitle("Pathfinding has completed").setFields({ name: "Current position", value: `${roundedX}, ${roundedY}, ${roundedZ}` });
      interaction.followUp({ embeds: [embed] });
    });
  },
};

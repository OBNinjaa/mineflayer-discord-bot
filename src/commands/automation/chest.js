const { SlashCommandBuilder } = require("discord.js");
const { Embed } = require("../../classes/Embed");
const Vec3 = require("vec3");

const Movements = require("mineflayer-pathfinder").Movements;
const { GoalNear } = require("mineflayer-pathfinder").goals;

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("chest")
    .setDescription("Have the bot open a chest and deposit or withdraw items.")
    .addStringOption((option) => option.setName("x").setDescription("The X coordinate.").setRequired(true))
    .addStringOption((option) => option.setName("y").setDescription("The Y coordinate.").setRequired(true))
    .addStringOption((option) => option.setName("z").setDescription("The Z coordinate.").setRequired(true))
    .addStringOption((option) => option.setName("item").setDescription("The item name.").setRequired(true))
    .addStringOption((option) => option.setName("amount").setDescription("The amount to items to deposit or withdraw.").setRequired(true))
    .addBooleanOption((option) => option.setName("deposit").setDescription("Should I deposit items?").setRequired(true)),

  async execute(interaction, bot) {
    const x = interaction.options.getString("x");
    const y = interaction.options.getString("y");
    const z = interaction.options.getString("z");
    const item = interaction.options.getString("item");
    const amount = interaction.options.getString("amount") ? interaction.options.getString("amount") : 1;
    const deposit = interaction.options.getBoolean("deposit");

    const defaultMove = new Movements(bot);
    bot.pathfinder.setMovements(defaultMove);
    bot.pathfinder.setGoal(new GoalNear(x, y, z, 1));

    bot.once("goal_reached", async () => {
      const position = bot.entity.position;
      const roundedX = Math.floor(position.x);
      const roundedY = Math.floor(position.y);
      const roundedZ = Math.floor(position.z);

      const chestPos = new Vec3(x, y, z);
      const chest = await bot.openContainer(bot.blockAt(chestPos));

      if (deposit) {
        await chest.deposit(bot.registry.itemsByName[item].id, 0, amount);
      } else {
        await chest.withdraw(bot.registry.itemsByName[item].id, 0, amount);
      }

      chest.close();

      const operation = deposit ? "Depositing" : "Withdrawing";
      const stopped = new Embed(bot).setTitle(`${operation} ${amount} ${item}`).setDescription(`${operation} items at: \`${roundedX}, ${roundedY}, ${roundedZ}\``);
      return interaction.reply({ embeds: [stopped] });
    });
  },
};

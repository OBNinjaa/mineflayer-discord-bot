const mineflayer = require("mineflayer");
const Vec3 = require("vec3");

/**
 * @param {mineflayer.Bot} bot
 */

module.exports = (bot) => {
  bot.on("chat", async (username, message) => {
    if (message === "e") {
      try {
        const block = bot.findBlock({
          matching: (block) => block.name === "enchanting_table",
          maxDistance: 64,
        });

        if (block) {
          let table = await bot.openEnchantmentTable(block);
          await table.putLapis(table.findInventoryItem("lapis_lazuli"));
          await table.putTargetItem(table.findInventoryItem("diamond_sword"));
          table.once("ready", async () => {
            try {
              table.enchant(2);
              table.takeTargetItem();

              const chestPos = new Vec3(15, -60, -193);
              const chest = await bot.openContainer(bot.blockAt(chestPos));
              await chest.deposit(797, 0, 1);
              chest.close();
              bot.chat("Enchanted & deposited into chest!");
            } catch (error) {
              bot.chat("An error occurred while enchanting and depositing into the chest.");
              console.error(error);
            }
          });
        } else {
          bot.chat("Could not find an enchanting table.");
        }
      } catch (error) {
        bot.chat("An error occurred while finding the enchanting table.");
        console.error(error);
      }
    }
  });
};

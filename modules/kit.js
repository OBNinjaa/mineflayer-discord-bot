const mineflayer = require('mineflayer');
const { Vec3 } = require('vec3');
const fs = require('fs');
const path = require('path');

/**
 * @param {mineflayer.Bot} bot
 */
module.exports = function (bot) {
  return {
    name: 'kit',
    busy: true,
    cooldown: 1800,
    /**
     * @param {mineflayer.Bot} bot
     * @param {string} sender
     * @param {string[]} args
     */
    async execute(bot, sender, args) {
      let SHOP_CLOSED = false;

      if (SHOP_CLOSED) {
        bot.chat('The shop is currently closed. Please try again later.');
        return;
      }

      const storagePath = path.resolve(__dirname, '../data/storage.json');
      const storageData = JSON.parse(fs.readFileSync(storagePath, 'utf8'));

      if (!Array.isArray(storageData) || storageData.length === 0) {
        console.error('No storage positions found in storage.json');
        return;
      }

      const nearbyStorage = storageData.find((storage) => {
        const storagePos = new Vec3(storage.x, storage.y, storage.z);
        return bot.entity.position.distanceTo(storagePos) <= 4;
      });

      if (!nearbyStorage) {
        bot.chat('I am not near my storage area please try again later.');

        bot.chat('/home');

        bot.once('forcedMove', () => {
          bot.chat('The shop is open again.');
        });

        return;
      }

      bot.config.is_busy = true;

      const randomIndex = Math.floor(Math.random() * storageData.length);
      const randomChest = storageData[randomIndex];
      const chestPos = new Vec3(randomChest.x, randomChest.y, randomChest.z);
      const chestBlock = bot.blockAt(chestPos);

      if (!chestBlock) {
        console.error(`Chest not found at ${chestPos}`);
        return;
      }

      try {
        const chest = await bot.openContainer(chestBlock);

        const boxTypes = [
          'shulker_box',
          'white_shulker_box',
          'light_gray_shulker_box',
          'gray_shulker_box',
          'black_shulker_box',
          'brown_shulker_box',
          'red_shulker_box',
          'orange_shulker_box',
          'yellow_shulker_box',
          'lime_shulker_box',
          'green_shulker_box',
          'cyan_shulker_box',
          'blue_shulker_box',
          'purple_shulker_box',
          'magenta_shulker_box',
          'pink_shulker_box',
        ];

        const shulkerBoxes = chest.containerItems().filter((item) => boxTypes.includes(item.name));

        if (shulkerBoxes.length === 0) {
          console.error('No more shulkers found in storage.');
          bot.chat('I am out of stock please wait for a refill.');
          chest.close();
          bot.config.is_busy = false;
          SHOP_CLOSED = true;
          console.log('\x1b[38;5;208mThe shop has been closed.\x1b[0m');
          return;
        }

        console.log(`Found ${shulkerBoxes.length} shulker boxes in chest at ${chestPos}`);

        await chest.withdraw(shulkerBoxes[0].type, null, 1);
        chest.close();

        bot.chat(`/tp ${sender}`);

        bot.once('forcedMove', () => {
          bot.chat('/kill');
        });

        bot.once('death', () => {
          bot.config.is_busy = false;
        });
      } catch (err) {
        console.error(`Error interacting with chest at ${chestPos}:`, err);
      }
    },
  };
};

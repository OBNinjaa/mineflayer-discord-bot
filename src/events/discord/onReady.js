/**
 * @file Ready Event File.
 * @author OBNinjaa
 * @since 1.0.0
 */

const bot = require(`../../index`);
const colors = require("colors");

module.exports = {
  name: "ready",
  once: true,

  /**
   * @description Executes the block of code when client is ready (bot initialization)
   * @param {Object} client Main Application Client
   */
  execute(client) {
    console.log(`[${new Date().toLocaleTimeString().gray}] [${client.user.tag.yellow}] ${`Discord bot ready!`.green}`);
    const statuses = [`Created by OBNinjaa`, `dsc.gg/mineflayer`];
    setInterval(() => {
      client.user.setActivity(statuses[Math.floor(Math.random() * statuses.length)], {
        type: "STREAMING",
        url: "https://www.youtube.com/watch?v=oHg5SJYRHA0&t=31s",
      });
    }, 10000);
  },
};

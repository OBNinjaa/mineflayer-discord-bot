const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

class Embed extends EmbedBuilder {
  constructor(bot, username = bot.username) {
    super();

    this.setThumbnail(`https://mineskin.eu/armor/bust/${username}/100.png`);
    this.setColor('#fc574c');
    this.setTimestamp();
    this.setFooter({ text: 'Mineflayer Discord Bot' });

    this.bot = bot;
  }
}

module.exports = {
  Embed,
};

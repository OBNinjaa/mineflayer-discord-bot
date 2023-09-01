const { EmbedBuilder } = require("discord.js");

class Embed extends EmbedBuilder {
  constructor(bot) {
    super();

    this.setThumbnail(`https://crafatar.com/renders/head/${bot.player.uuid}`);
    this.setColor("#995e2a");
    this.setTimestamp();
    this.setFooter({ text: "Mineflayer Discord Bot" });

    this.bot = bot;
  }
}

module.exports = {
  Embed,
};

const { EmbedBuilder } = require("discord.js");

class Embed extends EmbedBuilder {
  constructor(bot, username = bot.username) {
    super();

    this.setThumbnail(`https://mineskin.eu/armor/bust/${username}/100.png`);
    this.setColor("#fc574c");
    this.setTimestamp();
    this.setFooter({ text: "Mineflayer Discord Bot" });

    this.bot = bot;
  }
}

class WebhookEmbed {
  constructor(title, description, username, thumbnail = `https://mineskin.eu/armor/bust/${username}/100.png`) {
    this.embed = {
      title,
      description,
      color: 16537420,
      thumbnail: { url: thumbnail },
      footer: { text: "Mineflayer Discord Bot" },
    };
  }
}

module.exports = {
  Embed,
  WebhookEmbed,
};

/**
 * @file Dynamic help command
 * @author OBNinjaa
 * @since 1.0.0
 */

const { prefix, successColor, errorColor, infoColor } = require("./../../config.json");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "help",
  description: "List all commands of bot or info about a specific command.",
  aliases: ["commands"],
  usage: "[command name]",
  cooldown: 5,
  category: "information",

  /**
   * @description Executes when the command is called by command handler.
   * @author OBNinjaa
   * @param {Object} message The Message Object of the command.
   * @param {String[]} args The Message Content of the received message seperated by spaces (' ') in an array, this excludes prefix and command/alias itself.
   */

  execute(message, args) {
    const { commands } = message.client;

    if (!args.length) {
      /**
       * @type {Object}
       * @description Help command embed object
       */

      let helpEmbed = new MessageEmbed();
      helpEmbed.setColor(infoColor);
      helpEmbed.setThumbnail(message.client.user.displayAvatarURL());
      helpEmbed.setURL(process.env.URL);
      helpEmbed.setTitle("List of all my commands");
      helpEmbed.setDescription("`" + commands.map((command) => command.name).join("`, `") + "`");

      helpEmbed.addField("Usage", `\nYou can send \`${prefix}help [command name]\` for info on a specific command!`);
      helpEmbed.addField("Quick Links", `\n[**Support Server**](https://discord.gg/NysD9gyx7R) \n[**GitHub**](https://github.com/OBNinjaa/)`);
      return message.channel.send({ embeds: [helpEmbed] });
    }

    /**
     * @type {String}
     * @description First argument in lower case
     */

    const name = args[0].toLowerCase();

    /**
     * @type {Object}
     * @description The command object
     */

    const command = commands.get(name) || commands.find((c) => c.aliases && c.aliases.includes(name));

    if (!command) {
      return message.reply({ content: "That's not a valid command!" });
    }

    /**
     * @type {Object}
     * @description Embed of Help command for a specific command.
     */

    let commandEmbed = new MessageEmbed().setColor(infoColor).setTitle(`Command: ${command.name}`);

    if (command.description) commandEmbed.setDescription(`${command.description}`);

    if (command.aliases)
      commandEmbed.addField("Aliases", `\`${command.aliases.join(", ")}\``, true).addField("Cooldown", `${command.cooldown || 3} second(s)`, true);
    if (command.usage) commandEmbed.addField("Usage", `\`${prefix}${command.name} ${command.usage}\``, true);

    message.channel.send({ embeds: [commandEmbed] });
  },
};

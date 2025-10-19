const mineflayer = require('mineflayer');
const commander = require('./commander.js');
const pathfinder = require('mineflayer-pathfinder').pathfinder;
const Movements = require('mineflayer-pathfinder').Movements;
const customPVP = require('@nxg-org/mineflayer-custom-pvp').default;
const { Client, GatewayIntentBits, Events, Collection, MessageFlags, WebhookClient } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const wrapCommand = require('./utils/wrapCommand.js');

let bot;

const {
  username,
  host,
  port,
  version,
  auth,
  token,
  managers,
  prefix,
  webhook,
  can_send_messages,
  can_run_commands,
  show_coordinates,
} = require('./settings.json');

function initialize() {
  bot = mineflayer.createBot({
    username,
    host,
    port,
    version,
    auth,
  });

  bot.config = {
    is_busy: false,
    can_send_messages: can_send_messages,
    can_run_commands: can_run_commands,
    guarding: false,
    show_coordinates: show_coordinates,
    managers: managers || [],
    prefix: prefix || '$',
    webhook,
  };

  bot.sendWebhook = sendWebhook;
  bot.loadPlugin(customPVP);
  bot.loadPlugin(pathfinder);

  function sendWebhook(message, sender) {
    const webhook = new WebhookClient({
      url: bot.config.webhook,
    });

    webhook.send({
      content: message,
      username: sender,
      avatarURL: `https://mineskin.eu/armor/bust/${sender}/100.png`,
    });
  }

  let comms = null;

  bot.once('spawn', () => {
    console.log(
      'Minecraft ready: \x1b[38;5;208m' + bot.username + '\x1b[0m' + ' | In game prefix: \x1b[38;5;208m' + (bot.config.prefix || '$') + '\x1b[0m',
    );

    const defaultMove = new Movements(bot);
    defaultMove.allowFreeMotion = true;
    defaultMove.allowParkour = true;
    defaultMove.allow1by1towers = false;
    bot.pathfinder.setMovements(defaultMove);

    const originalChat = bot.chat.bind(bot);

    bot.chat = function (message) {
      if (message.startsWith('/')) {
        return originalChat(message);
      }

      if (!this.config.can_send_messages) {
        console.log(`(\x1b[38;5;208msilent mode\x1b[0m) ${message}`);
        return;
      }

      return originalChat(message);
    };

    comms = commander(bot);
    comms.set();
  });

  bot.on('chat', function (username, message) {
    comms.run(username, message);
  });

  bot.on('error', (err) => {
    console.log(err.name, err.cause);
  });
  bot.on('end', () => {
    console.log(`\x1b[38;5;208m${bot.username} \x1b[0mhas been disconnected, restarting...`);
    setTimeout(() => {
      initialize();
    }, 5000);
  });
}

initialize();

const discordClient = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

discordClient.once('clientReady', () => {
  console.log('Discord ready: \x1b[38;5;208m' + discordClient.user.username + '\x1b[0m');

  discordClient.user.setPresence({
    activities: [
      {
        name: 'Minecraft',
        type: 0,
      },
    ],
    status: 'online',
  });
});

discordClient.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
      const wrappedExecute = wrapCommand(command.execute, command.options || {});
      discordClient.commands.set(command.data.name, {
        data: command.data,
        execute: wrappedExecute,
      });
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing "data" or "execute".`);
    }
  }
}

discordClient.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = discordClient.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  await command.execute(interaction, bot);
});

discordClient.login(token);

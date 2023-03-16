const mineflayer = require("mineflayer");
const fs = require("fs");
const path = require("path");
const colors = require("colors");

const options = require("./config.json");
const { username, password, auth, host, port, version, viewDistance, hideErrors, logErrors } = options;

const settings = {
  username: username,
  password: password | "",
  auth: auth,
  host: host,
  port: port,
  version: version,
  viewDistance: viewDistance,
  hideErrors: hideErrors,
  logErrors: logErrors,
};

function injectModules(bot) {
  const MODULES_DIRECTORY = path.join(__dirname, "modules");
  const modules = fs
    .readdirSync(MODULES_DIRECTORY)
    .filter((x) => x.endsWith(".js"))
    .map((pluginName) => require(path.join(MODULES_DIRECTORY, pluginName)));

  bot.loadPlugins(modules);
}

function initialize() {
  const bot = mineflayer.createBot(settings);
  injectModules(bot);
  module.exports = bot;

  bot.once("spawn", function () {
    console.log(`[${new Date().toLocaleTimeString().gray}]`, colors.brightYellow(`minecraft bot ready: ${bot.username.green}`));
  });

  bot.on("error", (err) => {
    console.clear();
    console.log(`[${new Date().toLocaleTimeString().bgBrightRed}]`, colors.brightRed(err));
  });

  bot.on("end", () => {
    setTimeout(() => {
      console.log(`[${new Date().toLocaleTimeString().bgBrightRed}]`, colors.brightRed(`Disconnected from server reconnecting...`));
      initialize();
    }, 1000);
  });
}

initialize();

# Command Bot

A powerful and flexible bot that bridges Discord and Minecraft, allowing you to control a `mineflayer` bot from a Discord server.

## Features

- **Discord Integration:** Control the bot using slash commands.
- **In-Game Commands:** Manage the bot directly from Minecraft using chat commands.
- **Modular Command System:** Easily extend the bot's functionality by adding new command modules.
- **Pathfinding & PvP:** Uses `mineflayer-pathfinder` and `@nxg-org/mineflayer-custom-pvp` for movement and combat.
- **Chat Relay:** Relays in-game chat to a Discord channel using a webhook.

## Getting Started

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd command-bot
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Installing fonts**
    - Make sure to install the font at [data/mineglyph-faithful.ttf](data/mineglyph-faithful.ttf)

### Configuration

1.  Create a `settings.json` file in the root directory of the project.

2.  Add the following configuration options to `settings.json` for example:

    ```json
    {
      "username": "MineBot",
      "host": "localhost",
      "port": 25565,
      "version": "1.20.4",
      "auth": "microsoft",
      "token": "MzA4MjkzNjAzNTMxMjkyNjcy.DN9r_A.brcD2xRAqjAGTuMcGPwy4TWVQdg",
      "managers": ["OBNinjaa", "Pix3lPirat3"],
      "prefix": "$",
      "webhook": "https://discord.com/api/webhooks/1429455926922055720/WVNbCPJnjgDZVA-XQmgSdgO0AL5cc8gX1spMkF3DRavrGmeBB6R5zrgw",
      "can_send_messages": true,
      "can_run_commands": true,
      "show_coordinates": true
    }
    ```

    - **`username`**: The Minecraft username for the bot.
    - **`host`**: The IP address of the Minecraft server (e.g., `localhost`).
    - **`port`**: The port of the Minecraft server (e.g., `25565`).
    - **`version`**: The Minecraft version of the server.
    - **`auth`**: The authentication method ('microsoft' or 'offline').
    - **`token`**: Your Discord bot's token.
    - **`managers`**: An array of Minecraft usernames that are allowed to control the bot in-game.
    - **`prefix`**: The prefix for in-game commands (e.g., `$`).
    - **`webhook`**: The URL of the Discord webhook for chat relay.
    - **`can_send_messages`**: If `true`, the bot can send messages in Minecraft chat.
    - **`can_run_commands`**: If `true`, the bot can execute Minecraft commands (e.g., `/gamemode`).
    - **`show_coordinates`**: If `true`, the bot's coordinates will be shown in certain commands.

### Running the Bot

1.  **Register Discord Commands:**
    Before the first run, you need to register the slash commands with Discord's API. Then refresh your Discord client in order to see the commands.

    ```bash
    npm run register
    ```

2.  **Start the Bot:**
    ```bash
    npm start
    ```

## Command System

### Discord Commands

- Discord slash commands are located in the `commands/` directory.
- Each subdirectory in `commands/` represents a command category.

### Minecraft Commands

- In-game commands are located in the `modules/` directory.
- These commands can be executed by `managers` in the Minecraft chat using the configured `prefix`.

### Delivery Command

- The bot has a [delivery command](modules/kit.js) used in mostly anarchy server.
- You can configure the chest positions in [data/storage](data/storage).
- You must make sure the bot has a bed near the chests so it can access them once it spawns.

  ```json
  [
    { "x": 6, "y": -60, "z": -6 },
    { "x": 5, "y": -60, "z": -6 },
    { "x": 4, "y": -60, "z": -6 },
    { "x": 3, "y": -60, "z": -6 },
    { "x": 2, "y": -60, "z": -6 }
  ]
  ```

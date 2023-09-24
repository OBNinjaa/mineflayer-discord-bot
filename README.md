# Mineflayer Discord Bot

## Example Config

- src/settings.json

```json
{
  "token": "MTE0Njg3MjEwMjk0Mzc0MDA2Ng.GrXYfb.PHG0dPDci72e80GXecW9r4sM0PXUk-RsAWvD-s",
  "clientID": "1146872102943740066",
  "messages": "https://discord.com/api/webhooks/1147156671131562024/tz65Nl0pT_iLpmwvLsXe1ixwruT-7Zg3nvY_SUqqg9I5Cm5nnPlpDb9vwsLWvOUvLj90",
  "events": "https://discord.com/api/webhooks/1147156706544078910/AZaEf-hyQ9ydFy43-6ElTElLoIMcR8r33DvzuMsqzC1hj9pFZqSifn358h0QkCfmJ_tY",
  "username": "OBNinjaa",
  "address": "hypixel.net",
  "port": 25565,
  "auth": "microsoft",
  "showCoordinates": false
}
```

- src/data/homes.json

```json
{
  "homes": {}
}
```

## Registering Slash Commands

To register slash commands in your server, you will need to grant the necessary permissions to your bot.

1. Go to the Discord Developer Portal and select your application.
2. Go to the "OAuth2" tab.
3. In the "Scopes" section, select the "bot" scope.
4. In the "Bot Permissions" section, select the "applications.commands" permission.
5. Copy the generated invite URL and use it to invite your bot to the server where you want to register the slash commands.
6. Run npm run dev to register commands to your discord server

![Scopes](https://imgur.com/Y0Mqsch.png)
![URL](https://imgur.com/rnPcwLX.png)

![Preview](https://imgur.com/Jg5oTky.png)

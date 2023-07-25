# Mineflayer Discord Bot

## Example Config

```json
{
  "token": "MTAzMzUxNzU4Mjg2NDYyMTU5OA.GSUDdJ.V3fhAVoHVCYIXSx5oytbGd_kOkQiQL7xwvZ4hM",
  "webhook": "https://ptb.discord.com/api/webhooks/1085971359756206131/XygnwBaT5LX2J_5qvxkN0ZnbwQKCNCqV11JIwxoCaaTmLF2jxhEjN_Fg4O55rt64mxNB",
  "username": "OBNinjaa",
  "password": "",
  "auth": "offline",
  "host": "sus.shhnowisnottheti.me",
  "port": 25565,
  "version": "1.19.2",
  "viewDistance": "tiny",
  "hideErrors": true,
  "logErrors": false,
  "clientID": "817614688027410452",
  "serverID": "883397209306038272"
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

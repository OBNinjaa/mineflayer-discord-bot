# Mineflayer Discord Bot

## Example Config

- src/settings.json

```json
{
  "token": "NTIzNDU2Nzg5MDEyMzQ1Njc4.XYZ123.aBcDeFgHiJkLmNoPqRsTuVwXyZ012345",
  "clientID": "817614688027410452",
  "host": "0.0.0.0",
  "port": 25565,
  "version": "1.20.4",
  "username": "Kaveah",
  "auth": "microsoft",
  "prefix": ">",
  "silent": false,
  "guarding": false,
  "showCoordinates": true,
  "logging": true,
  "master": ["OBNinjaa"],
  "messages": "1246163933853778030/FGPCU2zvpatCGW2ekix2_ffmOUOmASExmLMOo0ForrTj9YCLKn4zBnTl9srBG8SdXsRx",
  "events": "1246164053047377962/Z8s7eNai3W3jpRzZbl3aky5Q_iSbb7a74zgwcLUnnVkOLA_l1-ec2cvv8Gm000sPJnlb"
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

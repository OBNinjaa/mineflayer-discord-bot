@echo off

echo Enter your Discord bot Token
set /p token=Token: 
cls

echo Enter your Discord bots client ID
set /p clientID=clientID: 
cls

echo Enter your Minecraft server IP
set /p host=clientID: 
cls

echo Enter your Minecraft server PORT
set /p port=Port: 
cls

echo Enter your Minecraft server version
set /p version=Version: 
cls

echo Enter your Minecraft bots username
set /p username=Username: 
cls

echo Enter your bots authentication which can be microsoft or offline
set /p auth=Authentication: 
cls

echo Enter your bots command prefix for ingame commands
set /p prefix=Prefix: 
cls

echo Should the bot send messages in chat true or false
set /p silent=Silent: 
cls

echo Should coordinates be visible to users in Discord true or false
set /p coords=Coordinates: 
cls

echo Should the bot log ingame messages into Discord true or false
set /p logging=Loggin: 
cls

echo Enter your bot masters username
set /p master=Master: 
cls

echo Enter discord webhook you want messages to be send to
echo DO NOT INCLUDE THE https://discord.com/api/webhooks/ PART
set /p messages=Messages: 
cls

echo Enter discord webhook you want events to be send to
echo DO NOT INCLUDE THE https://discord.com/api/webhooks/ PART
set /p events=Event: 
cls

(
echo {
echo "token": "%token%",
echo "clientID": "%clientID%",
echo "host": "%host%",
echo "port": %port%,
echo "version": "%version%",
echo "username": "%username%",
echo "auth": "%auth%",
echo "prefix": "%prefix%",
echo "silent": %silent%,
echo "guarding": false,
echo "showCoordinates": %coords%,
echo "logging": %logging%,
echo "master": ["%master%"],
echo "messages": "%messages%",
echo "events": "%events%"
echo }
) > src/settings.json

cls
echo Saved settings to settings.json
echo You can now install the bot's dependencies by running "npm install".
echo Make sure to enter "npm run register" in order to register commands to your Discord bot.
echo Start the bot by running "npm start" or "node ."

cmd /k

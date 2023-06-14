@echo off

set /p TOKEN=Enter your Discord token: 
set /p WEBHOOK=Enter your Discord chat logs webhook URL: 
set /p EVENTSHOOK=Enter your Discord events webhook URL (Death events etc): 
set /p USERNAME=Enter your Minecraft email or username: 
set /p PASSWORD=Enter your Minecraft password leave blank for cracked: 
set /p AUTH=Enter your Minecraft authentication type: 
set /p HOST=Enter the Minecraft server host: 
set /p PORT=Enter the Minecraft server port: 
set /p VERSION=Enter the Minecraft version: 
set /p VIEWDISTANCE=Enter the Minecraft view distance (far, normal, short or tiny): 
set /p HIDEERRORS=Enter "true" to hide errors or "false" to show errors: 
set /p LOGERRORS=Enter "true" to log errors or "false" to not log errors: 
set /p CLIENTID=Enter your Discord client ID: 
set /p SERVERID=Enter your Discord server ID: 

(
  echo {
  echo   "token": "%TOKEN%",
  echo   "webhook": "%WEBHOOK%",
  echo   "eventshook": "%EVENTSHOOK%",
  echo   "username": "%USERNAME%",
  echo   "password": "%PASSWORD%",
  echo   "auth": "%AUTH%",
  echo   "host": "%HOST%",
  echo   "port": %PORT%,
  echo   "version": "%VERSION%",
  echo   "viewDistance": "%VIEWDISTANCE%",
  echo   "hideErrors": %HIDEERRORS%,
  echo   "logErrors": %LOGERRORS%,
  echo   "clientsID": "%CLIENTID%",
  echo   "serverID": "%SERVERID%"
  echo }
) > src/config.json

echo Configuration saved to config.json.
echo Registering commands to your Discord server
npm run dev &
echo Registering commands to your Discord server
npm run dev
echo You can now launch the bot by double starting start_bot.bat
(
  echo @echo off
  echo node src/client.js
) > start_bot.bat

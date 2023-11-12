@echo off

echo Make sure your Discord bot has the correct scopes before continuing
echo.
echo Enter the Discord bot token.
set /p token=Token: 
cls

echo Enter the Discord bots ID
set /p clientID=Client ID: 
cls

echo Enter the messages webhook https://discord.com/api/webhooks/XXXX/XXXX
set /p messages=Messages: 
cls

echo Enter the events webhook https://discord.com/api/webhooks/XXXX/XXXX
set /p events=Events: 
cls

echo Enter the bots username
set /p username=Username: 
cls

echo Enter the server IP
set /p address=Address: 
cls

echo Enter the server PORT
set /p port=Port: 
cls

echo Enter the server VERSION
set /p version=Version: 
cls

echo Enter either microsoft or offline
set /p auth=Auth: 
cls

echo Hide coordinates? true or false
set /p showCoordinates=Show coordinates: 
cls

(
  echo {
  echo   "token": "%token%",
  echo   "clientID": "%clientID%",
  echo   "messages": "%messages%",
  echo   "events": "%events%",
  echo   "username": "%username%",
  echo   "address": "%address%",
  echo   "port": "%port%",
  echo   "version": "%version%"
  echo   "auth": "%auth%",
  echo   "showCoordinates": %showCoordinates%
  echo }
) > src/settings.json

cls
echo Saved settings to settings.json
echo You can now install the bot's dependencies by entering "npm install".
echo Make sure to enter "npm run register" in order to register commands to your Discord bot.

cmd /k

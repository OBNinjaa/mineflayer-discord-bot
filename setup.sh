#!/bin/sh
clear


read -p "Enter your Discord token:" TOKEN
read -p "Enter your Discord chat logs webhook URL:" WEBHOOK
read -p "Enter your Discord events webhook URL (Death events etc):" EVENTSHOOK
read -p "Enter your Minecraft email or username:" USERNAME
read -p "Enter your Minecraft password leave blank for cracked:" PASSWORD
read -p "Enter your Minecraft authentication type:" AUTH
read -p "Enter the Minecraft server host:" HOST
read -p "Enter the Minecraft server port:" PORT
read -p "Enter the Minecraft version:" VERSION
read -p "Enter the Minecraft view distance (far, normal, short or tiny):" VIEWDISTANCE
read -p "Enter \"true\" to hide errors or \"false\" to show errors:" HIDEERRORS
read -p "Enter \"true\" to log errors or \"false\" to not log errors:" LOGERRORS
read -p "Enter your Discord client ID:" CLIENTID
read -p "Enter your Discord server ID:" SERVERID

(
  echo {
  echo   \"token\": \"$TOKEN\",
  echo   \"webhook\": \"$WEBHOOK\",
  echo   \"eventshook\": \"$EVENTSHOOK\",
  echo   \"username\": \"$USERNAME\",
  echo   \"password\": \"$PASSWORD\",
  echo   \"auth\": \"$AUTH\",
  echo   \"host\": \"$HOST\",
  echo   \"port\": $PORT,
  echo   \"version\": \"$VERSION\",
  echo   \"viewDistance\": \"$VIEWDISTANCE\",
  echo   \"hideErrors\": $HIDEERRORS,
  echo   \"logErrors\": $LOGERRORS,
  echo   \"clientID\": \"$CLIENTID\",
  echo   \"serverID\": \"$SERVERID\"
  echo }
) > src/config.json


echo Configuration saved to config.json.
echo Installing Node Modules.
npm i > /dev/null 
echo Installation Done.

echo Registering commands to your Discord server
npm run dev

echo You can now launch the bot by starting start_bot.sh

(
  echo clear
  echo node src/client.js
) > start_bot.sh

chmod +x start_bot.sh


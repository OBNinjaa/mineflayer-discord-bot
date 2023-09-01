#!/bin/bash

echo "Make sure your Discord bot has the correct scopes before continuing"
echo

echo -n "Enter the Discord bot token: "
read -r token
clear

echo -n "Enter the Discord bot's ID: "
read -r clientID
clear

echo -n "Enter the messages webhook https://discord.com/api/webhooks/XXXX/XXXX: "
read -r messages
clear

echo -n "Enter the events webhook https://discord.com/api/webhooks/XXXX/XXXX: "
read -r events
clear

echo -n "Enter the bot's username: "
read -r username
clear

echo -n "Enter the server IP: "
read -r address
clear

echo -n "Enter the server PORT: "
read -r port
clear

echo -n "Enter either microsoft or offline: "
read -r auth
clear

(
  echo '{
    "token": "'"$token"'",
    "clientID": "'"$clientID"'",
    "messages": "'"$messages"'",
    "events": "'"$events"'",
    "username": "'"$username"'",
    "address": "'"$address"'",
    "port": "'"$port"'",
    "auth": "'"$auth"'"
  }'
) > src/settings.json

clear
echo "Saved settings to settings.json"
echo "You can now install the bot's dependencies by entering \"npm install\""
echo "Make sure to enter \"npm run register\" in order to register commands to your Discord bot."

exec bash

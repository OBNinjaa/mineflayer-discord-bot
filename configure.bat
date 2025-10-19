@echo off
setlocal enabledelayedexpansion

echo Enter your Minecraft bot username
set /p username=Username: 
cls

echo Enter your Minecraft server host
set /p host=Host: 
cls

echo Enter your Minecraft server port
set /p port=Port: 
cls

echo Enter your Minecraft server version
set /p version=Version: 
cls

echo Enter auth method (microsoft/offline)
set /p auth=Auth: 
cls

echo Enter your Discord bot token
set /p token=Token: 
cls

echo Enter your Discord bot client ID
set /p clientId=Client ID: 
cls

echo Enter managers (comma separated, e.g. OBNinjaa,Pix3lPirat3)
set /p managers=Managers: 
cls

echo Enter your in-game command prefix (e.g $)
set /p prefix=Prefix: 
cls

echo Enter Discord webhook URL
set /p webhook=Webhook: 
cls

echo Do you want the bot to send messages in the server (true/false)
set /p can_send_messages=Can Send Messages: 
cls

echo Do you want the bot to run commands in the server (true/false)
set /p can_run_commands=Can Run Commands: 
cls

echo Do you want the bot to expose its coordinates (true/false)
set /p show_coordinates=Show Coordinates: 
cls

set managersJson=
for %%A in (%managers%) do (
    if defined managersJson (
        set managersJson=!managersJson!, "%%A"
    ) else (
        set managersJson="%%A"
    )
)
set managersJson=[!managersJson!]

(
echo {
echo   "username": "!username!",
echo   "host": "!host!",
echo   "port": !port!,
echo   "version": "!version!",
echo   "auth": "!auth!",
echo   "token": "!token!",
echo   "clientId": "!clientId!",
echo   "managers": !managersJson!,
echo   "prefix": "!prefix!",
echo   "webhook": "!webhook!",
echo   "can_send_messages": !can_send_messages!,
echo   "can_run_commands": !can_run_commands!,
echo   "show_coordinates": !show_coordinates!
echo }
) > settings.json

cls
echo Your settings have been saved to src/settings.json
echo Press ENTER to begin installing modules
pause
call npm install
echo Press enter to register Discord commands
pause
call npm run register
cls
echo Installation complete.
echo You can now start the bot by running:
echo npm start
echo.
pause >nul
cmd /k
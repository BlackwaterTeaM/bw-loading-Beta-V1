@echo off
echo FiveM Loading Screen - Quick Restart Tool
echo =======================================
echo.

echo Step 1: Stopping loading-ui if it's running...
txadmin :stop loading-ui
timeout /t 1 > nul

echo Step 2: Starting loading-ui...
txadmin :ensure loading-ui
timeout /t 2 > nul

echo Step 3: Verifying configuration...
txadmin :exec verification.lua
echo.

echo Step 4: Done! Your loading screen should now be running with the latest config.
echo If you want to test it, connect to your server or open it in a browser.
echo.

echo Press any key to exit...
pause > nul 
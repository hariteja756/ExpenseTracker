@echo off
title Expense Tracker Startup
echo ===================================================
echo   EXPENSE TRACKER STARTUP SERVICES
echo ===================================================
echo.

:: Change directory to the server folder
cd /d "%~dp0server"

:: Start the Express Backend Server in a new window
echo [1/2] Starting backend server on port 5000...
start "Expense Tracker Server" cmd /k "npm run dev"

:: Wait 3 seconds for server to initialize
echo Waiting for server startup...
timeout /t 3 /nobreak >nul
echo.

:: Start the Ngrok Tunnel in a new window
echo [2/2] Starting ngrok tunnel...
start "Expense Tracker Tunnel" cmd /k "npm run tunnel"

echo.
echo ===================================================
echo   Services are running!
echo   You can access your app on any device here:
echo   https://deuce-agenda-underline.ngrok-free.dev
echo ===================================================
echo.
pause

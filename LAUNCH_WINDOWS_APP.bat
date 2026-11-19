@echo off
setlocal
title WHITE COLLARS - AUTONOMOUS WORKSPACE OS

REM Change directory to the folder of this script
cd /d "%~dp0"

echo ======================================================================
echo WHITE COLLARS - AUTONOMOUS WORKSPACE OS
echo RUNTIME: ELECTRON 34+ FRAMELESS WINDOWS DESKTOP
echo DISCIPLINE: STRICT MONOCHROME - ZERO LATENCY - PRODUCTION RUNTIME
echo ======================================================================
echo.

where node >nul 2>nul
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in PATH.
    echo Please install Node.js v20+ from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

if not exist node_modules (
    echo [SETUP] Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo [ERROR] npm install failed.
        echo.
        pause
        exit /b 1
    )
)

echo [LAUNCH] Starting Vite server and Electron native desktop shell...
echo Press Ctrl+C at any time to close.
echo.
call npm run electron:dev

if errorlevel 1 (
    echo.
    echo [ERROR] Application closed with an error.
)

echo.
echo ======================================================================
echo SESSION CONCLUDED
echo ======================================================================
pause

endlocal

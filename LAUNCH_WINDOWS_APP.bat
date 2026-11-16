@echo off
setlocal
title WHITE COLLARS (WHITESPACE) // AUTONOMOUS WORKSPACE OS

echo ======================================================================
echo WHITE COLLARS (WHITESPACE) // AUTONOMOUS WORKSPACE OS
echo RUNTIME: ELECTRON 34+ FRAMELESS WINDOWS DESKTOP (.EXE)
echo DISCIPLINE: STRICT MONOCHROME // ZERO LATENCY // PRODUCTION RUNTIME
echo ======================================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH.
    echo Please install Node.js v20+ from https://nodejs.org/
    pause
    exit /b 1
)

if not exist node_modules (
    echo [SETUP] Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] npm install failed.
        pause
        exit /b 1
    )
)

echo [LAUNCH] Starting Vite server and Electron native desktop shell...
echo.
call npm run electron:dev

endlocal

@echo off
setlocal
title WHITE COLLARS - BUILD STANDALONE WINDOWS APP

REM Change directory to the folder of this script
cd /d "%~dp0"

echo ======================================================================
echo WHITE COLLARS - PACKAGER
echo TARGET: STANDALONE PORTABLE WINDOWS APP - WhiteCollarsOS.exe
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

echo [1/2] Compiling TypeScript and Vite production bundle...
call npm run build
if errorlevel 1 (
    echo [ERROR] Vite build failed.
    echo.
    pause
    exit /b 1
)

echo.
echo [2/2] Packaging Electron portable Windows executable and NSIS installer...
call npx electron-builder --win --x64
if errorlevel 1 (
    echo [ERROR] Electron packaging failed.
    echo.
    pause
    exit /b 1
)

echo.
echo ======================================================================
echo BUILD COMPLETE - OUTPUT LOCATED IN: dist-electron\
echo ======================================================================
echo Portable executable: dist-electron\win-unpacked\WhiteCollarsOS.exe
echo Standalone package:  dist-electron\WhiteCollarsOS_v1.0.0_x64.exe
echo ======================================================================
pause

endlocal

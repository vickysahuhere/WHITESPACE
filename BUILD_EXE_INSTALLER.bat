@echo off
setlocal
title WHITE COLLARS // BUILD STANDALONE WINDOWS APP (.EXE)

echo ======================================================================
echo WHITE COLLARS (WHITESPACE) // PACKAGER
echo TARGET: STANDALONE PORTABLE WINDOWS APP (WhiteCollarsOS.exe)
echo ======================================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH.
    pause
    exit /b 1
)

echo [1/2] Compiling TypeScript and Vite production bundle...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Vite build failed.
    pause
    exit /b 1
)

echo.
echo [2/2] Packaging Electron portable Windows executable and NSIS installer...
call npx electron-builder --win --x64
if %errorlevel% neq 0 (
    echo [ERROR] Electron packaging failed.
    pause
    exit /b 1
)

echo.
echo ======================================================================
echo BUILD COMPLETE // OUTPUT LOCATED IN: dist-electron/
echo ======================================================================
pause

endlocal

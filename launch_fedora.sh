#!/usr/bin/env bash
# White Collars (WHITESPACE) // Linux / Fedora Desktop Launcher
# Enables hardware-accelerated Wayland / X11 rendering

set -e

echo "======================================================================"
echo "WHITE COLLARS (WHITESPACE) // AUTONOMOUS WORKSPACE OS"
echo "TARGET: LINUX / FEDORA DESKTOP RUNTIME"
echo "======================================================================"

if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed. Install Node.js v20+ to proceed."
    exit 1
fi

if [ ! -d "node_modules" ]; then
    echo "[SETUP] Installing dependencies..."
    npm install
fi

echo "[LAUNCH] Starting Vite dev server and Electron desktop shell..."
export ELECTRON_EXTRA_FLAGS="--ozone-platform-hint=auto --enable-features=VaapiVideoDecoder,WebAssemblySimd"
npm run electron:dev

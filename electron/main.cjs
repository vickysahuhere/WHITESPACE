/**
 * White Collars (WHITESPACE) // Native Desktop Runtime
 * Electron 34+ Main Process
 * ----------------------------------------------------------------
 * - Frameless window discipline (#000000 background)
 * - Session-level HTTP header stripping (removes X-Frame-Options & CSP for arbitrary web embedding)
 * - Auto-granted media permissions (AudioContext, microphone, camera, screen-share)
 * - IPC window control bridges (minimize, maximize/restore, close)
 */

const { app, BrowserWindow, ipcMain, session } = require('electron');
const path = require('path');

// Disable hardware acceleration issues on specific VMs if needed, but enable high-performance GPU
app.commandLine.appendSwitch('enable-features', 'VaapiVideoDecoder,WebAssemblySimd');
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
app.commandLine.appendSwitch('ignore-certificate-errors');

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    frame: false, // Strict frameless monochrome aesthetic
    backgroundColor: '#000000',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webviewTag: true,
      webSecurity: false // Strip CORS/X-Frame-Options in native desktop wrapper
    }
  });

  // Automatically show when ready to avoid white flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // 1. Session Header Stripper: Remove X-Frame-Options & CSP for iframe embedding
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const responseHeaders = { ...details.responseHeaders };
    
    // Delete headers that block iframes or external embedding
    delete responseHeaders['x-frame-options'];
    delete responseHeaders['X-Frame-Options'];
    delete responseHeaders['frame-options'];
    delete responseHeaders['content-security-policy'];
    delete responseHeaders['Content-Security-Policy'];
    delete responseHeaders['content-security-policy-report-only'];

    callback({
      cancel: false,
      responseHeaders
    });
  });

  // 2. Permission Auto-Grant Handler (Mic, Camera, Screen Capture, Notifications)
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    const allowedPermissions = [
      'media',
      'mediaKeySystem',
      'display-capture',
      'notifications',
      'clipboard-read',
      'clipboard-sanitized-write',
      'fullscreen',
      'pointerLock'
    ];

    if (allowedPermissions.includes(permission)) {
      callback(true);
    } else {
      callback(true); // Permissive native desktop runtime
    }
  });

  // 3. Load target URL
  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
  if (isDev) {
    const devUrl = process.env.ELECTRON_DEV_URL || 'http://localhost:5173';
    mainWindow.loadURL(devUrl).catch(() => {
      // Retry in 1s if Vite dev server is still compiling
      setTimeout(() => mainWindow.loadURL(devUrl), 1000);
    });
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// IPC Window Controls
ipcMain.on('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('window-maximize', () => {
  if (!mainWindow) return;
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

ipcMain.on('window-close', () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.handle('is-maximized', () => {
  return mainWindow ? mainWindow.isMaximized() : false;
});

ipcMain.handle('get-platform', () => {
  return process.platform;
});

// App lifecycle
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

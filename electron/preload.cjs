/**
 * White Collars (WHITESPACE) // Preload Bridge
 * Exposes secure, sanitized IPC communication to the renderer context.
 */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('whiteCollarsDesktop', {
  isDesktop: true,
  platform: process.platform,
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  isMaximized: () => ipcRenderer.invoke('is-maximized'),
  getPlatform: () => ipcRenderer.invoke('get-platform')
});

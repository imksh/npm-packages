import { contextBridge, ipcRenderer } from 'electron';

/**
 * Expose a safe, typed API to the renderer via window.electronAPI.
 * Never expose ipcRenderer directly — that would allow any renderer code
 * to send arbitrary IPC messages.
 */
contextBridge.exposeInMainWorld('electronAPI', {
  // ── Window controls ────────────────────────────────────────────────────────
  minimize: () => ipcRenderer.send('window:minimize'),
  maximize: () => ipcRenderer.send('window:maximize'),
  close:    () => ipcRenderer.send('window:close'),

  // ── Window state ───────────────────────────────────────────────────────────
  isMaximized: () => ipcRenderer.invoke('window:isMaximized'),

  // ── App info ───────────────────────────────────────────────────────────────
  getVersion:  () => ipcRenderer.invoke('app:version'),
  getPlatform: () => ipcRenderer.invoke('app:platform'),

  // ── Shell ──────────────────────────────────────────────────────────────────
  openExternal: (url) => ipcRenderer.invoke('shell:openExternal', url),

  // ── Event subscriptions ────────────────────────────────────────────────────
  /** @param {(isMaximized: boolean) => void} callback */
  onMaximizeChange: (callback) => {
    ipcRenderer.on('window:maximized-change', (_event, value) => callback(value));
  },

  /** @param {(data: { label: string }) => void} callback */
  onMenuAction: (callback) => {
    ipcRenderer.on('menu:preferences', (_event, data) => callback({ label: 'preferences', ...data }));
  },

  // ── Cleanup ────────────────────────────────────────────────────────────────
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
});

import { contextBridge, ipcRenderer } from 'electron';

/**
 * ElectronAPI — typed interface exposed to the renderer via window.electronAPI.
 * Declare this in vite-env.d.ts to get full type safety in the renderer.
 */
export interface ElectronAPI {
  // Window controls
  minimize: () => void;
  maximize: () => void;
  close: () => void;

  // Window state
  isMaximized: () => Promise<boolean>;

  // App info
  getVersion: () => Promise<string>;
  getPlatform: () => Promise<NodeJS.Platform>;

  // Shell
  openExternal: (url: string) => Promise<void>;

  // Event subscriptions
  onMaximizeChange: (callback: (isMaximized: boolean) => void) => void;
  onMenuAction: (callback: (data: { label: string }) => void) => void;

  // Cleanup
  removeAllListeners: (channel: string) => void;
}

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.send('window:minimize'),
  maximize: () => ipcRenderer.send('window:maximize'),
  close:    () => ipcRenderer.send('window:close'),

  isMaximized: () => ipcRenderer.invoke('window:isMaximized'),

  getVersion:  () => ipcRenderer.invoke('app:version'),
  getPlatform: () => ipcRenderer.invoke('app:platform'),

  openExternal: (url: string) => ipcRenderer.invoke('shell:openExternal', url),

  onMaximizeChange: (callback: (isMaximized: boolean) => void) => {
    ipcRenderer.on('window:maximized-change', (_event, value: boolean) => callback(value));
  },

  onMenuAction: (callback: (data: { label: string }) => void) => {
    ipcRenderer.on('menu:preferences', (_event, data) => callback({ label: 'preferences', ...data }));
  },

  removeAllListeners: (channel: string) => ipcRenderer.removeAllListeners(channel),
} satisfies ElectronAPI);

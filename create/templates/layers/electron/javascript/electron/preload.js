import { contextBridge, ipcRenderer } from "electron";

/**
 * ElectronAPI — typed interface exposed to the renderer via window.electronAPI.
 * Declare this in vite-env.d.ts to get full type safety in the renderer.
 */

contextBridge.exposeInMainWorld("electronAPI", {
  minimize: () => ipcRenderer.send("window:minimize"),
  maximize: () => ipcRenderer.send("window:maximize"),
  close: () => ipcRenderer.send("window:close"),
  isMaximized: () => ipcRenderer.invoke("window:isMaximized"),
  getVersion: () => ipcRenderer.invoke("app:version"),
  getPlatform: () => ipcRenderer.invoke("app:platform"),
  openExternal: (url) => ipcRenderer.invoke("shell:openExternal", url),
  onMaximizeChange: (callback) => {
    ipcRenderer.on("window:maximized-change", (_event, value) =>
      callback(value),
    );
  },
  onMenuAction: (callback) => {
    ipcRenderer.on("menu:preferences", (_event, data) =>
      callback({
        label: "preferences",
        ...data,
      }),
    );
  },
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
});

import { useEffect } from "react";

/**
 * useElectron — safely access window.electronAPI in the renderer.
 *
 * Returns typed wrappers for all IPC calls. Every method is a no-op
 * (or returns a resolved promise) when running outside of Electron
 * (e.g. during browser-based development or testing).
 *
 * @returns {{ isElectron: boolean } & ElectronAPI}
 */
export function useElectron() {
  const isElectron = typeof window !== "undefined" && Boolean(window.electronAPI);

  return {
    isElectron,

    // Window controls
    minimize: () => window.electronAPI?.minimize(),
    maximize: () => window.electronAPI?.maximize(),
    close:    () => window.electronAPI?.close(),

    // Window state
    isMaximized: () => window.electronAPI?.isMaximized() ?? Promise.resolve(false),

    // App info
    getVersion:  () => window.electronAPI?.getVersion() ?? Promise.resolve("web"),
    getPlatform: () => window.electronAPI?.getPlatform() ?? Promise.resolve("web"),

    // Shell
    openExternal: (url) =>
      window.electronAPI?.openExternal(url) ?? Promise.resolve(),

    // Event subscription helpers
    onMaximizeChange: (cb) => window.electronAPI?.onMaximizeChange(cb),
    onMenuAction:     (cb) => window.electronAPI?.onMenuAction(cb),

    // Cleanup
    removeAllListeners: (channel) =>
      window.electronAPI?.removeAllListeners(channel),
  };
}

/**
 * useElectronEvent — subscribe to an Electron IPC event in a React component.
 *
 * Automatically cleans up the listener on unmount.
 *
 * @param {"maximize" | "menu"} event
 * @param {Function} callback
 */
export function useElectronEvent(event, callback) {
  const electron = useElectron();

  useEffect(() => {
    if (!electron.isElectron) return;

    if (event === "maximize") {
      electron.onMaximizeChange(callback);
      return () => electron.removeAllListeners("window:maximized-change");
    }

    if (event === "menu") {
      electron.onMenuAction(callback);
      return () => electron.removeAllListeners("menu:preferences");
    }
  }, [event, callback, electron.isElectron]);
}

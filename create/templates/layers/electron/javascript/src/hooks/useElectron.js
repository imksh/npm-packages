import { useEffect } from "react";
/**
 * useElectron — safely access window.electronAPI in the renderer.
 *
 * Returns typed wrappers for all IPC calls. Every method is a no-op
 * (or returns a resolved promise) when running outside of Electron.
 */
export function useElectron() {
  const isElectron =
    typeof window !== "undefined" && Boolean(window.electronAPI);
  return {
    isElectron,
    minimize: () => window.electronAPI?.minimize(),
    maximize: () => window.electronAPI?.maximize(),
    close: () => window.electronAPI?.close(),
    isMaximized: () =>
      window.electronAPI?.isMaximized() ?? Promise.resolve(false),
    getVersion: () =>
      window.electronAPI?.getVersion() ?? Promise.resolve("web"),
    getPlatform: () =>
      window.electronAPI?.getPlatform() ?? Promise.resolve("web"),
    openExternal: (url) =>
      window.electronAPI?.openExternal(url) ?? Promise.resolve(),
    onMaximizeChange: (cb) => window.electronAPI?.onMaximizeChange(cb),
    onMenuAction: (cb) => window.electronAPI?.onMenuAction(cb),
    removeAllListeners: (channel) =>
      window.electronAPI?.removeAllListeners(channel),
  };
}
/**
 * useElectronEvent — subscribe to an Electron IPC event in a React component.
 * Automatically cleans up the listener on unmount.
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
  }, [event, electron.isElectron]);
}

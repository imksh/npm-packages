import { useEffect } from "react";

type Platform = "darwin" | "win32" | "linux" | "web";

interface UseElectronReturn {
  isElectron: boolean;
  minimize: () => void;
  maximize: () => void;
  close: () => void;
  isMaximized: () => Promise<boolean>;
  getVersion: () => Promise<string>;
  getPlatform: () => Promise<Platform>;
  openExternal: (url: string) => Promise<void>;
  onMaximizeChange: (cb: (isMax: boolean) => void) => void;
  onMenuAction: (cb: (data: { label: string }) => void) => void;
  removeAllListeners: (channel: string) => void;
}

/**
 * useElectron — safely access window.electronAPI in the renderer.
 *
 * Returns typed wrappers for all IPC calls. Every method is a no-op
 * (or returns a resolved promise) when running outside of Electron.
 */
export function useElectron(): UseElectronReturn {
  const isElectron = typeof window !== "undefined" && Boolean(window.electronAPI);

  return {
    isElectron,
    minimize:           () => window.electronAPI?.minimize(),
    maximize:           () => window.electronAPI?.maximize(),
    close:              () => window.electronAPI?.close(),
    isMaximized:        () => window.electronAPI?.isMaximized() ?? Promise.resolve(false),
    getVersion:         () => window.electronAPI?.getVersion() ?? Promise.resolve("web"),
    getPlatform:        () => (window.electronAPI?.getPlatform() ?? Promise.resolve("web")) as Promise<Platform>,
    openExternal:       (url) => window.electronAPI?.openExternal(url) ?? Promise.resolve(),
    onMaximizeChange:   (cb) => window.electronAPI?.onMaximizeChange(cb),
    onMenuAction:       (cb) => window.electronAPI?.onMenuAction(cb),
    removeAllListeners: (channel) => window.electronAPI?.removeAllListeners(channel),
  };
}

type ElectronEvent = "maximize" | "menu";

/**
 * useElectronEvent — subscribe to an Electron IPC event in a React component.
 * Automatically cleans up the listener on unmount.
 */
export function useElectronEvent(
  event: ElectronEvent,
  callback: (value: boolean | { label: string }) => void,
): void {
  const electron = useElectron();

  useEffect(() => {
    if (!electron.isElectron) return;

    if (event === "maximize") {
      electron.onMaximizeChange(callback as (v: boolean) => void);
      return () => electron.removeAllListeners("window:maximized-change");
    }

    if (event === "menu") {
      electron.onMenuAction(callback as (d: { label: string }) => void);
      return () => electron.removeAllListeners("menu:preferences");
    }
  }, [event, electron.isElectron]);
}

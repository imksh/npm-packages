/// <reference types="vite/client" />

import type { ElectronAPI } from '../electron/preload';

/**
 * Augment the Window interface to include the Electron context bridge API.
 * This gives full type safety when accessing window.electronAPI in the renderer.
 */
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

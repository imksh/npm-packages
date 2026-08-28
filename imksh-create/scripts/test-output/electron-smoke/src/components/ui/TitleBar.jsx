import React, { useEffect, useState } from "react";
import { Minus, Square, X, Maximize2, Minimize2 } from "lucide-react";
import { useUiStore } from "../../store/useUiStore";
import appConfig from "../../config/appConfig";

/**
 * TitleBar — custom frameless window title bar for Electron.
 *
 * Renders a draggable title bar with:
 *  - App icon + name on the left
 *  - Window controls (minimize / maximize / close) positioned per platform:
 *    · macOS: right side (native traffic lights are hidden via frame: false)
 *    · Windows/Linux: right side (Windows style)
 *
 * Only renders when running inside Electron (window.electronAPI is present).
 */
const TitleBar = () => {
  const { windowMaximized, setWindowMaximized, minimizeWindow, maximizeWindow, closeWindow } =
    useUiStore();
  const [platform, setPlatform] = useState("win32");

  const isElectron = Boolean(window.electronAPI);

  // Don't render in browser
  if (!isElectron) return null;

  useEffect(() => {
    // Get platform for conditional layout
    window.electronAPI.getPlatform().then(setPlatform);

    // Sync initial maximize state
    window.electronAPI.isMaximized().then(setWindowMaximized);

    // Listen for window state changes from main process
    window.electronAPI.onMaximizeChange((isMax) => {
      setWindowMaximized(isMax);
    });

    return () => {
      window.electronAPI.removeAllListeners("window:maximized-change");
    };
  }, []);

  const isMac = platform === "darwin";

  const windowControls = (
    <div className={`flex items-center gap-1.5 ${isMac ? "mr-3" : "ml-auto"}`}>
      {/* Minimize */}
      <button
        id="titlebar-minimize"
        onClick={minimizeWindow}
        className="w-7 h-7 flex items-center justify-center rounded-full
                   text-base-content/50 hover:bg-warning/20 hover:text-warning
                   transition-all duration-150 group"
        title="Minimize"
      >
        <Minus size={12} className="group-hover:scale-110 transition-transform" />
      </button>

      {/* Maximize / Restore */}
      <button
        id="titlebar-maximize"
        onClick={maximizeWindow}
        className="w-7 h-7 flex items-center justify-center rounded-full
                   text-base-content/50 hover:bg-success/20 hover:text-success
                   transition-all duration-150 group"
        title={windowMaximized ? "Restore" : "Maximize"}
      >
        {windowMaximized ? (
          <Minimize2 size={11} className="group-hover:scale-110 transition-transform" />
        ) : (
          <Maximize2 size={11} className="group-hover:scale-110 transition-transform" />
        )}
      </button>

      {/* Close */}
      <button
        id="titlebar-close"
        onClick={closeWindow}
        className="w-7 h-7 flex items-center justify-center rounded-full
                   text-base-content/50 hover:bg-error/20 hover:text-error
                   transition-all duration-150 group"
        title="Close"
      >
        <X size={12} className="group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );

  return (
    <div
      id="electron-titlebar"
      className="h-10 shrink-0 flex items-center px-3
                 bg-base-200 border-b border-base-300
                 select-none"
      // The entire bar is draggable except the buttons (buttons set no-drag via CSS)
      style={{ WebkitAppRegion: "drag" }}
    >
      {/* macOS: controls on left */}
      {isMac && (
        <div style={{ WebkitAppRegion: "no-drag" }}>
          {windowControls}
        </div>
      )}

      {/* App name — centered */}
      <div className="flex items-center gap-2 mx-auto">
        {appConfig.app.logo ? (
          <img src={appConfig.app.logo} alt="" className="w-4 h-4 rounded" />
        ) : (
          <div className="w-4 h-4 rounded bg-primary flex items-center justify-center text-primary-content text-[8px] font-bold">
            {appConfig.app.name.charAt(0)}
          </div>
        )}
        <span className="text-xs font-semibold text-base-content/70">
          {appConfig.app.name}
        </span>
      </div>

      {/* Windows/Linux: controls on right */}
      {!isMac && (
        <div style={{ WebkitAppRegion: "no-drag" }}>
          {windowControls}
        </div>
      )}
    </div>
  );
};

export default TitleBar;

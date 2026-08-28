import { app, BrowserWindow, Menu, Tray, shell, ipcMain, nativeImage } from 'electron';
import { fileURLToPath } from 'url';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Constants ────────────────────────────────────────────────────────────────
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
const preloadPath = path.join(__dirname, 'preload.js');

/** @type {BrowserWindow | null} */
let mainWindow = null;
/** @type {Tray | null} */
let tray = null;

// ─── Window ───────────────────────────────────────────────────────────────────
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    frame: false,           // Custom title bar in renderer
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 16, y: 16 }, // macOS traffic lights position
    backgroundColor: '#0f172a',
    show: false,            // Don't show until ready-to-show
    icon: path.join(__dirname, '../public/icon.png'),
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  // Show window once ready to avoid white flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (isDev) mainWindow.webContents.openDevTools({ mode: 'detach' });
  });

  // Notify renderer when window maximize state changes
  mainWindow.on('maximize',   () => mainWindow?.webContents.send('window:maximized-change', true));
  mainWindow.on('unmaximize', () => mainWindow?.webContents.send('window:maximized-change', false));

  // Open external links in the default browser instead of Electron
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Load app
  if (isDev && VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

// ─── Native Application Menu ──────────────────────────────────────────────────
function buildMenu() {
  const isMac = process.platform === 'darwin';

  const template = [
    // App menu (macOS only)
    ...(isMac
      ? [{
          label: app.name,
          submenu: [
            { role: 'about' },
            { type: 'separator' },
            { label: 'Preferences…', accelerator: 'CmdOrCtrl+,', click: () => mainWindow?.webContents.send('menu:preferences') },
            { type: 'separator' },
            { role: 'services' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideOthers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' },
          ],
        }]
      : []),

    // File
    {
      label: 'File',
      submenu: [
        {
          label: 'New Window',
          accelerator: 'CmdOrCtrl+Shift+N',
          click: () => createWindow(),
        },
        { type: 'separator' },
        isMac ? { role: 'close' } : { role: 'quit' },
      ],
    },

    // Edit
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        ...(isMac
          ? [{ role: 'pasteAndMatchStyle' }, { role: 'delete' }, { role: 'selectAll' }]
          : [{ role: 'delete' }, { type: 'separator' }, { role: 'selectAll' }]),
      ],
    },

    // View
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },

    // Window
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac
          ? [{ type: 'separator' }, { role: 'front' }, { type: 'separator' }, { role: 'window' }]
          : [{ role: 'close' }]),
      ],
    },

    // Help
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: () => shell.openExternal('https://github.com/imksh/create'),
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: isMac ? 'Alt+Cmd+I' : 'Alt+Shift+I',
          click: () => mainWindow?.webContents.toggleDevTools(),
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// ─── System Tray ──────────────────────────────────────────────────────────────
function createTray() {
  // Use a simple nativeImage as placeholder — replace public/tray-icon.png with your 16x16 icon
  const iconPath = path.join(__dirname, '../public/icon.png');
  const trayIcon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 });
  tray = new Tray(trayIcon);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => {
        mainWindow?.show();
        mainWindow?.focus();
      },
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.isQuiting = true;
        app.quit();
      },
    },
  ]);

  tray.setToolTip(app.name);
  tray.setContextMenu(contextMenu);

  // Double-click tray icon to show window
  tray.on('double-click', () => {
    mainWindow?.show();
    mainWindow?.focus();
  });
}

// ─── IPC Handlers ─────────────────────────────────────────────────────────────
function registerIpcHandlers() {
  // Window controls
  ipcMain.on('window:minimize', () => mainWindow?.minimize());
  ipcMain.on('window:maximize', () => {
    if (mainWindow?.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow?.maximize();
    }
  });
  ipcMain.on('window:close', () => mainWindow?.close());

  // Window state queries
  ipcMain.handle('window:isMaximized', () => mainWindow?.isMaximized() ?? false);

  // App info
  ipcMain.handle('app:version',  () => app.getVersion());
  ipcMain.handle('app:platform', () => process.platform);

  // Shell
  ipcMain.handle('shell:openExternal', (_event, url) => {
    if (typeof url === 'string' && url.startsWith('http')) {
      return shell.openExternal(url);
    }
  });
}

// ─── App Lifecycle ────────────────────────────────────────────────────────────
app.whenReady().then(() => {
  // macOS About panel
  if (process.platform === 'darwin') {
    app.setAboutPanelOptions({
      applicationName: app.name,
      applicationVersion: app.getVersion(),
      copyright: `© ${new Date().getFullYear()} imksh`,
    });
  }

  registerIpcHandlers();
  buildMenu();
  createWindow();
  createTray();

  app.on('activate', () => {
    // On macOS re-create window when dock icon is clicked and no windows are open
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Minimize to tray on close (Windows/Linux)
app.on('before-quit', () => {
  app.isQuiting = true;
});

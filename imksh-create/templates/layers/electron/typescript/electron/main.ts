import {
  app,
  BrowserWindow,
  Menu,
  Tray,
  shell,
  ipcMain,
  nativeImage,
  MenuItemConstructorOptions,
} from 'electron';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Constants ────────────────────────────────────────────────────────────────
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
const preloadPath = path.join(__dirname, 'preload.js');

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

// ─── Window ───────────────────────────────────────────────────────────────────
function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    frame: false,
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 16, y: 16 },
    backgroundColor: '#0f172a',
    show: false,
    icon: path.join(__dirname, '../public/icon.png'),
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow!.show();
    if (isDev) mainWindow!.webContents.openDevTools({ mode: 'detach' });
  });

  mainWindow.on('maximize',   () => mainWindow?.webContents.send('window:maximized-change', true));
  mainWindow.on('unmaximize', () => mainWindow?.webContents.send('window:maximized-change', false));

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  if (isDev && VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

// ─── Native Application Menu ──────────────────────────────────────────────────
function buildMenu(): void {
  const isMac = process.platform === 'darwin';

  const template: MenuItemConstructorOptions[] = [
    ...(isMac
      ? [{
          label: app.name,
          submenu: [
            { role: 'about' as const },
            { type: 'separator' as const },
            { label: 'Preferences…', accelerator: 'CmdOrCtrl+,', click: () => mainWindow?.webContents.send('menu:preferences') },
            { type: 'separator' as const },
            { role: 'services' as const },
            { type: 'separator' as const },
            { role: 'hide' as const },
            { role: 'hideOthers' as const },
            { role: 'unhide' as const },
            { type: 'separator' as const },
            { role: 'quit' as const },
          ],
        }]
      : []),

    {
      label: 'File',
      submenu: [
        { label: 'New Window', accelerator: 'CmdOrCtrl+Shift+N', click: () => createWindow() },
        { type: 'separator' },
        isMac ? { role: 'close' as const } : { role: 'quit' as const },
      ],
    },

    {
      label: 'Edit',
      submenu: [
        { role: 'undo' as const },
        { role: 'redo' as const },
        { type: 'separator' as const },
        { role: 'cut' as const },
        { role: 'copy' as const },
        { role: 'paste' as const },
        ...(isMac
          ? [{ role: 'pasteAndMatchStyle' as const }, { role: 'delete' as const }, { role: 'selectAll' as const }]
          : [{ role: 'delete' as const }, { type: 'separator' as const }, { role: 'selectAll' as const }]),
      ],
    },

    {
      label: 'View',
      submenu: [
        { role: 'reload' as const },
        { role: 'forceReload' as const },
        { role: 'toggleDevTools' as const },
        { type: 'separator' as const },
        { role: 'resetZoom' as const },
        { role: 'zoomIn' as const },
        { role: 'zoomOut' as const },
        { type: 'separator' as const },
        { role: 'togglefullscreen' as const },
      ],
    },

    {
      label: 'Window',
      submenu: [
        { role: 'minimize' as const },
        { role: 'zoom' as const },
        ...(isMac
          ? [{ type: 'separator' as const }, { role: 'front' as const }, { type: 'separator' as const }, { role: 'window' as const }]
          : [{ role: 'close' as const }]),
      ],
    },

    {
      role: 'help' as const,
      submenu: [
        { label: 'Learn More', click: () => shell.openExternal('https://github.com/imksh/create') },
        {
          label: 'Toggle Developer Tools',
          accelerator: isMac ? 'Alt+Cmd+I' : 'Alt+Shift+I',
          click: () => mainWindow?.webContents.toggleDevTools(),
        },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// ─── System Tray ──────────────────────────────────────────────────────────────
function createTray(): void {
  const iconPath = path.join(__dirname, '../public/icon.png');
  const trayIcon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 });
  tray = new Tray(trayIcon);

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show App', click: () => { mainWindow?.show(); mainWindow?.focus(); } },
    { type: 'separator' },
    { label: 'Quit', click: () => { (app as any).isQuiting = true; app.quit(); } },
  ]);

  tray.setToolTip(app.name);
  tray.setContextMenu(contextMenu);
  tray.on('double-click', () => { mainWindow?.show(); mainWindow?.focus(); });
}

// ─── IPC Handlers ─────────────────────────────────────────────────────────────
function registerIpcHandlers(): void {
  ipcMain.on('window:minimize', () => mainWindow?.minimize());
  ipcMain.on('window:maximize', () => {
    mainWindow?.isMaximized() ? mainWindow.unmaximize() : mainWindow?.maximize();
  });
  ipcMain.on('window:close', () => mainWindow?.close());

  ipcMain.handle('window:isMaximized', () => mainWindow?.isMaximized() ?? false);
  ipcMain.handle('app:version',  () => app.getVersion());
  ipcMain.handle('app:platform', () => process.platform);

  ipcMain.handle('shell:openExternal', (_event, url: string) => {
    if (typeof url === 'string' && url.startsWith('http')) {
      return shell.openExternal(url);
    }
  });
}

// ─── App Lifecycle ────────────────────────────────────────────────────────────
app.whenReady().then(() => {
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
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

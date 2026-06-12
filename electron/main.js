import { app, BrowserWindow, Tray, Menu, ipcMain, shell, Notification, screen } from 'electron';
import path from 'path';
import fs from 'fs';
import squirrelStartup from 'electron-squirrel-startup';
import { icons } from './icons';
import { createMqttRuntime, aggregateItemsStatus } from '../src/lib/mqttClient.js';

if (squirrelStartup) app.quit();

process.on('uncaughtException', (err) => {
  console.error('[FATAL] Uncaught exception:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('[FATAL] Unhandled promise rejection:', reason);
});

// ─── Settings ────────────────────────────────────────────────────────────────

const SETTINGS_FILE = path.join(app.getPath('userData'), 'settings.json');

const DEFAULT_SETTINGS = {
  theme: 'dark',
  removedTopics: [],
  mqttHost: '24.121.212.206',
  mqttPort: 1883,
  mqttWsPort: 9001,
  mqttWsPath: '/ws',
  mqttProtocol: 'mqtt',
  mqttUsername: '',
  mqttPassword: '',
  sources: [
    {
      id: 'proc',
      projectId: 'cc098b5e-72be-4b91-b272-7303616aaa1f',
      systemId: '82b0c530-21bc-4840-adfe-7e462b3dfa36',
      label: 'Process Monitor',
      type: 'process_status',
    },
    {
      id: 'conn',
      projectId: '1bb37209-8136-44a1-9361-d4e7d25c3d26',
      systemId: 'aed0a884-ef2f-47cb-b7d6-01350079320c',
      label: 'Connection Monitor',
      type: 'connection_status',
    },
  ],
};

function loadSettings() {
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8')) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function saveSettings(settings) {
  fs.mkdirSync(path.dirname(SETTINGS_FILE), { recursive: true });
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
}

// ─── Autostart (launch at login) ─────────────────────────────────────────────

// Squirrel.Windows installs land in a versioned `app-x.y.z` folder and update
// in place, so login items must point at the stable `Update.exe` shim rather
// than the current version's exe — see Squirrel.Windows auto-startup docs.
function loginItemSettingsFor(openAtLogin) {
  if (process.platform !== 'win32') return { openAtLogin };

  const appFolder = path.dirname(process.execPath);
  const updateExe = path.resolve(appFolder, '..', 'Update.exe');
  const exeName = path.basename(process.execPath);

  if (fs.existsSync(updateExe)) {
    return { openAtLogin, path: updateExe, args: ['--processStart', `"${exeName}"`] };
  }
  return { openAtLogin };
}

function getAutostart() {
  return app.getLoginItemSettings(loginItemSettingsFor(false)).openAtLogin;
}

function setAutostart(enabled) {
  app.setLoginItemSettings(loginItemSettingsFor(enabled));
  return getAutostart();
}

// ─── App state ────────────────────────────────────────────────────────────────

let tray = null;
let mainWindow = null;
let isQuitting = false;
let settings = loadSettings();

let currentConnectionState = 'grey'; // 'grey' | 'live' | 'black'
let currentItems = {};               // topicKey → item, last broadcast from the runtime

function currentTrayStatus() {
  if (currentConnectionState === 'black') return 'black';
  if (currentConnectionState === 'grey')  return 'grey';
  return aggregateItemsStatus(currentItems);
}

// ─── Tray ─────────────────────────────────────────────────────────────────────

function statusLabel(s) {
  const labels = {
    green:  'All Systems OK',
    yellow: 'Degraded',
    red:    'Issues Detected',
    grey:   'Connecting…',
    black:  'Broker Unreachable',
  };
  return labels[s] || 'Unknown';
}

function buildContextMenu(status) {
  return Menu.buildFromTemplate([
    { label: 'Ping Monitor',                         enabled: false },
    { label: `Status: ${statusLabel(status)}`,       enabled: false },
    { type: 'separator' },
    { label: 'Open Details', click: () => showWindow() },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() },
  ]);
}

function updateTray(status) {
  if (!tray) return;
  tray.setImage(icons[status] || icons.grey);
  tray.setToolTip(`Ping Monitor — ${statusLabel(status)}`);
  tray.setContextMenu(buildContextMenu(status));
}

// ─── Main window ──────────────────────────────────────────────────────────────

function createWindow() {
  // Frameless tray-anchored popup: not user-resizable (resizing would fight
  // the tray-relative repositioning in showWindow), so size it generously
  // relative to the display instead of using a fixed height.
  const trayBounds = tray ? tray.getBounds() : null;
  const display = trayBounds && trayBounds.width
    ? screen.getDisplayNearestPoint({ x: trayBounds.x, y: trayBounds.y })
    : screen.getPrimaryDisplay();
  const height = Math.round(display.workAreaSize.height * 0.9);

  mainWindow = new BrowserWindow({
    width: 460,
    height,
    resizable: false,
    skipTaskbar: true,
    show: false,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  mainWindow.on('close', (e) => {
    if (isQuitting) return;
    e.preventDefault();
    mainWindow.hide();
  });

  mainWindow.on('blur', () => {
    if (!mainWindow.webContents.isDevToolsOpened()) mainWindow.hide();
  });
}

function showWindow() {
  if (!mainWindow) createWindow();
  const trayBounds = tray.getBounds();
  const windowBounds = mainWindow.getBounds();
  const x = Math.round(trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2);
  const y = trayBounds.y > 400
    ? trayBounds.y - windowBounds.height - 4
    : trayBounds.y + trayBounds.height + 4;
  mainWindow.setPosition(x, y);
  mainWindow.show();
  mainWindow.focus();
}

function broadcastItems(itemsObj) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('mqtt:items', itemsObj);
  }
}

function broadcastRemovedTopics(removedTopicsArray) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('mqtt:removedTopics', removedTopicsArray);
  }
}

function broadcastConnectionState(state) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('mqtt:connection', state);
  }
}

// ─── Notifications ────────────────────────────────────────────────────────────

function sendProcessNotification(sourceLabel, status, payload) {
  if (!Notification.isSupported()) return;
  const titles = { green: 'Pipeline OK', yellow: 'Pipeline Warning', red: 'Pipeline Error' };
  new Notification({
    title: `${sourceLabel} — ${titles[status] || 'Status Changed'}`,
    body: payload.detail || '',
    urgency: status === 'red' ? 'critical' : 'normal',
  }).show();
}

// ─── MQTT runtime ─────────────────────────────────────────────────────────────

// Connects on creation and reconnects on settings:save. Connection
// state/items/removed-topics changes flow back through these handlers to
// update the tray, push to the renderer over IPC, and persist removedTopics.
const runtime = createMqttRuntime(settings, settings.removedTopics || [], {
  onItems: (itemsObj) => {
    currentItems = itemsObj;
    updateTray(currentTrayStatus());
    broadcastItems(itemsObj);
  },
  onConnectionState: (state) => {
    currentConnectionState = state;
    updateTray(currentTrayStatus());
    broadcastConnectionState(state);
  },
  onRemovedTopics: (removedTopicsArray) => {
    settings = { ...settings, removedTopics: removedTopicsArray };
    saveSettings(settings);
    broadcastRemovedTopics(removedTopicsArray);
  },
  onProcessStatusChange: sendProcessNotification,
});

// ─── App lifecycle ─────────────────────────────────────────────────────────────

app.whenReady().then(() => {
  if (app.dock) app.dock.hide();

  tray = new Tray(icons.grey);
  updateTray(currentTrayStatus());

  tray.on('click', () => {
    if (mainWindow && mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      showWindow();
    }
  });
});

app.on('before-quit', () => { isQuitting = true; });
app.on('window-all-closed', () => {});
app.on('will-quit', () => runtime.end());

// ─── IPC handlers ─────────────────────────────────────────────────────────────

ipcMain.handle('items:get', () => runtime.getSnapshot());

ipcMain.handle('settings:get', () => settings);

ipcMain.handle('settings:save', (_e, newSettings) => {
  settings = { ...settings, ...newSettings };
  saveSettings(settings);
  runtime.reconnect(settings);
  return { ok: true };
});

ipcMain.handle('items:remove', (_e, topicKey) => {
  runtime.removeItem(topicKey);
  return { ok: true };
});

ipcMain.handle('items:removeMany', (_e, topicKeys) => {
  const keys = Array.isArray(topicKeys) ? topicKeys : [];
  runtime.removeItems(keys);
  return { ok: true, removed: keys.length };
});

ipcMain.handle('items:getRemovedTopics', () => runtime.getSnapshot().removedTopics);

ipcMain.handle('items:restore', (_e, topicKey) => {
  runtime.restoreItem(topicKey);
  return { ok: true };
});

ipcMain.handle('shell:openExternal', (_e, url) => shell.openExternal(url));

ipcMain.handle('autostart:get', () => getAutostart());
ipcMain.handle('autostart:set', (_e, enabled) => ({ ok: true, enabled: setAutostart(!!enabled) }));

ipcMain.handle('theme:get', () => settings.theme || 'dark');
ipcMain.handle('theme:set', (_e, mode) => {
  settings = { ...settings, theme: mode === 'light' ? 'light' : 'dark' };
  saveSettings(settings);
  return { ok: true, theme: settings.theme };
});

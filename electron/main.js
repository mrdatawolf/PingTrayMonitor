import { app, BrowserWindow, Tray, Menu, ipcMain, shell, Notification, screen, powerMonitor } from 'electron';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import squirrelStartup from 'electron-squirrel-startup';
import { icons } from './icons';
import { createMqttRuntime, aggregateItemsStatus } from '../src/lib/mqttClient.js';
import { createHistoryStore } from './historyStore.js';

// Only present in a dev checkout (gitignored, never packaged into a
// distributed build) — silently a no-op otherwise, leaving persisted
// settings.json / the in-app Settings panel as the credential source.
dotenv.config();

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
let historyWindow = null;
let isQuitting = false;
let settings = loadSettings();

// .env credentials, when present, are the source of truth — they override
// whatever is currently persisted in settings.json (e.g. blank from before
// the broker required auth) without being written back to disk, so the
// Settings panel still reflects and can locally override them per install.
if (process.env.MQTT_USERNAME) settings.mqttUsername = process.env.MQTT_USERNAME;
if (process.env.MQTT_PASSWORD) settings.mqttPassword = process.env.MQTT_PASSWORD;

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
    { label: 'Open History', click: () => showHistoryWindow() },
    { label: 'Reload Windows', click: () => reloadAllWindows() },
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

// ─── Window health ────────────────────────────────────────────────────────────

// Packaged builds have no DevTools or menu, so a renderer that dies during
// startup (GPU process not ready at login, a thrown error, a failed load)
// leaves a blank window with no way out. Every window gets: a log of what
// went wrong, automatic reloads on crash/failed load/empty page, and a
// Ctrl+R / F5 reload shortcut.

const LOG_FILE = path.join(app.getPath('userData'), 'logs', 'renderer.log');
const LOG_MAX_BYTES = 512 * 1024;

function logEvent(msg) {
  const line = `${new Date().toISOString()} ${msg}\n`;
  console.error('[Window]', msg);
  try {
    fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
    try {
      if (fs.statSync(LOG_FILE).size > LOG_MAX_BYTES) fs.renameSync(LOG_FILE, `${LOG_FILE}.1`);
    } catch { /* no log yet */ }
    fs.appendFileSync(LOG_FILE, line);
  } catch { /* logging must never break the app */ }
}

const MAX_AUTO_RELOADS = 3;
const EMPTY_CHECK_MS = 4000;

function guardWindow(win, name) {
  const wc = win.webContents;
  let autoReloads = 0;
  let emptyTimer = null;

  const reload = (why) => {
    if (win.isDestroyed()) return;
    if (autoReloads >= MAX_AUTO_RELOADS) {
      logEvent(`${name}: ${why} — auto-reload limit reached, press Ctrl+R to retry`);
      return;
    }
    autoReloads += 1;
    logEvent(`${name}: ${why} — reloading (${autoReloads}/${MAX_AUTO_RELOADS})`);
    setTimeout(() => { if (!win.isDestroyed()) wc.reloadIgnoringCache(); }, 500 * autoReloads);
  };

  wc.on('render-process-gone', (_e, d) => reload(`renderer gone (${d.reason}, code ${d.exitCode})`));
  wc.on('did-fail-load', (_e, code, desc, url, isMainFrame) => {
    if (isMainFrame && code !== -3) reload(`load failed ${code} ${desc} ${url}`); // -3 = aborted by a newer load
  });
  wc.on('unresponsive', () => logEvent(`${name}: unresponsive`));
  wc.on('preload-error', (_e, p, err) => logEvent(`${name}: preload error ${p}: ${err?.stack || err}`));
  wc.on('console-message', (_e, level, message, line, sourceId) => {
    if (level >= 3) logEvent(`${name}: console error: ${message} (${sourceId}:${line})`);
  });

  // The page loaded but React never rendered anything: treat as a failed start.
  wc.on('did-finish-load', () => {
    clearTimeout(emptyTimer);
    emptyTimer = setTimeout(async () => {
      if (win.isDestroyed()) return;
      try {
        const n = await wc.executeJavaScript(
          "(document.getElementById('root') || {}).childElementCount || 0", true);
        if (n === 0) reload('page rendered nothing');
        else autoReloads = 0; // healthy — allow future auto-recoveries
      } catch (err) {
        reload(`health check failed: ${err.message}`);
      }
    }, EMPTY_CHECK_MS);
  });

  wc.on('before-input-event', (e, input) => {
    if (input.type !== 'keyDown') return;
    const mod = input.control || input.meta;
    const key = input.key.toLowerCase();
    if (key === 'f5' || (mod && key === 'r')) {
      e.preventDefault();
      autoReloads = 0;
      logEvent(`${name}: manual reload`);
      wc.reloadIgnoringCache();
    } else if (key === 'f12' || (mod && input.shift && key === 'i')) {
      e.preventDefault();
      wc.toggleDevTools();
    }
  });

  win.on('closed', () => clearTimeout(emptyTimer));
}

function reloadAllWindows() {
  for (const win of [mainWindow, historyWindow]) {
    if (win && !win.isDestroyed()) win.webContents.reloadIgnoringCache();
  }
}

app.on('child-process-gone', (_e, d) => {
  logEvent(`${d.type} process gone (${d.reason}, code ${d.exitCode})`);
  // Windows painted by a crashed GPU process can stay blank; repaint them.
  if (d.type === 'GPU') setTimeout(reloadAllWindows, 1000);
});

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
  guardWindow(mainWindow, 'details');

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

// ─── History window ───────────────────────────────────────────────────────────

// A normal, resizable window (unlike the tray popup) — the same renderer
// bundle, routed to the History view by the #history hash.
function showHistoryWindow() {
  if (historyWindow && !historyWindow.isDestroyed()) {
    if (historyWindow.isMinimized()) historyWindow.restore();
    historyWindow.show();
    historyWindow.focus();
    return;
  }

  historyWindow = new BrowserWindow({
    width: 1180,
    height: 820,
    minWidth: 760,
    minHeight: 520,
    title: 'Ping Monitor — History',
    autoHideMenuBar: true,
    backgroundColor: settings.theme === 'light' ? '#f0f2f5' : '#141414',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  guardWindow(historyWindow, 'history');

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    historyWindow.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}#history`);
  } else {
    historyWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
      { hash: 'history' },
    );
  }

  historyWindow.on('closed', () => { historyWindow = null; });
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

// Local history: recording starts before the runtime connects so no early
// messages are missed. PINGTRAY_HISTORY_DIR overrides the location (dev / testing).
const history = createHistoryStore(
  process.env.PINGTRAY_HISTORY_DIR || path.join(app.getPath('userData'), 'history'),
);
history.start(currentConnectionState);

// Connects on creation and reconnects on settings:save. Connection
// state/items/removed-topics changes flow back through these handlers to
// update the tray, push to the renderer over IPC, and persist removedTopics.
const runtime = createMqttRuntime(settings, settings.removedTopics || [], {
  onItems: (itemsObj) => {
    currentItems = itemsObj;
    history.observe(itemsObj);
    updateTray(currentTrayStatus());
    broadcastItems(itemsObj);
  },
  onConnectionState: (state) => {
    currentConnectionState = state;
    history.connection(state);
    updateTray(currentTrayStatus());
    broadcastConnectionState(state);
  },
  onRemovedTopics: (removedTopicsArray) => {
    history.removed(removedTopicsArray.map((r) => r.topicKey));
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

  // Load the details popup in the background now so the first tray click
  // shows a page that has already rendered (and been health-checked).
  createWindow();

  // Sleep isn't a clean stop for the recorder: mark it so the History view
  // shows the gap, then resume with the current broker state.
  powerMonitor.on('suspend', () => history.stop());
  powerMonitor.on('resume', () => history.start(currentConnectionState));

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
app.on('will-quit', () => {
  runtime.end();
  history.stop();
});

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

ipcMain.handle('items:setAcknowledged', (_e, topicKey, on) => {
  runtime.setAcknowledged(topicKey, !!on);
  return { ok: true };
});

// History queries span at most 31 days (retention is 30).
const clampRange = (rangeMs) => Math.max(60_000, Math.min(Number(rangeMs) || 86_400_000, 31 * 86_400_000));
ipcMain.handle('history:open', () => { showHistoryWindow(); return { ok: true }; });
ipcMain.handle('history:query', (_e, rangeMs) => history.query({
  rangeMs: clampRange(rangeMs),
  hidden: runtime.getSnapshot().removedTopics.map((r) => r.topicKey),
}));
ipcMain.handle('history:baselines', () => history.baselines());
ipcMain.handle('history:patterns', (_e, rangeMs) => history.patterns({ rangeMs: clampRange(rangeMs) }));
ipcMain.handle('history:samples', (_e, keys, from, to) => history.samples({
  keys: (Array.isArray(keys) ? keys : [keys]).map(String), from: Number(from), to: Number(to),
}));

ipcMain.handle('shell:openExternal', (_e, url) => shell.openExternal(url));

ipcMain.handle('autostart:get', () => getAutostart());
ipcMain.handle('autostart:set', (_e, enabled) => ({ ok: true, enabled: setAutostart(!!enabled) }));

ipcMain.handle('theme:get', () => settings.theme || 'dark');
ipcMain.handle('theme:set', (_e, mode) => {
  settings = { ...settings, theme: mode === 'light' ? 'light' : 'dark' };
  saveSettings(settings);
  return { ok: true, theme: settings.theme };
});

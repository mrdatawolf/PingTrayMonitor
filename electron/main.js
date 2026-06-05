import { app, BrowserWindow, Tray, Menu, ipcMain, shell, Notification } from 'electron';
import path from 'path';
import fs from 'fs';
import mqtt from 'mqtt';
import squirrelStartup from 'electron-squirrel-startup';
import { icons } from './icons';

if (squirrelStartup) app.quit();

// ─── Settings ────────────────────────────────────────────────────────────────

const SETTINGS_FILE = path.join(app.getPath('userData'), 'settings.json');

const DEFAULT_SETTINGS = {
  mqttHost: '24.121.212.206',
  mqttPort: 1883,
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

// ─── App state ────────────────────────────────────────────────────────────────

let tray = null;
let mainWindow = null;
let mqttClient = null;
let currentConnectionState = 'grey'; // 'grey' | 'live' | 'black'
let settings = loadSettings();
let isQuitting = false;

// items: topicKey → { topicKey, messageType, sourceLabel, payload, computedStatus, lastReceivedTracked, lastUpdated }
const items = new Map();

// ─── Status computation ───────────────────────────────────────────────────────

function computeConnectionItemStatus(payload, trackedLastReceived) {
  const lr = trackedLastReceived || payload.lastReceived;
  if (!lr) return 'red';
  const age = Date.now() - new Date(lr).getTime();
  const refreshMs = (payload.refreshMinutes || 1) * 60_000;
  if (age < 3 * refreshMs) return 'green';
  if (age < 5 * refreshMs) return 'yellow';
  return 'red';
}

function aggregateItemsStatus() {
  if (!items.size) return 'grey';
  const statuses = [...items.values()].map((i) => i.computedStatus).filter(Boolean);
  if (!statuses.length) return 'grey';
  if (statuses.includes('red'))    return 'red';
  if (statuses.includes('yellow')) return 'yellow';
  return 'green';
}

function currentTrayStatus() {
  if (currentConnectionState === 'black') return 'black';
  if (currentConnectionState === 'grey')  return 'grey';
  return aggregateItemsStatus();
}

// ─── MQTT topic helpers ───────────────────────────────────────────────────────

function topicsForSource(source) {
  const base = `${source.projectId}/${source.systemId}`;
  if (source.type === 'process_status')   return [`${base}/status`];
  if (source.type === 'connection_status') return [`${base}/checks/+`];
  return [`${base}/status`, `${base}/checks/+`]; // fallback: subscribe both
}

function messageTypeForTopic(topic, source) {
  const base = `${source.projectId}/${source.systemId}`;
  if (source.type === 'process_status'   && topic === `${base}/status`)         return 'process_status';
  if (source.type === 'connection_status' && topic.startsWith(`${base}/checks/`)) return 'connection_status';
  // Fallback for sources without an explicit type configured
  if (topic === `${base}/status`)         return 'process_status';
  if (topic.startsWith(`${base}/checks/`)) return 'connection_status';
  return null;
}

function findSourceForTopic(topic) {
  for (const source of (settings.sources || [])) {
    const type = messageTypeForTopic(topic, source);
    if (type) return { source, type };
  }
  return null;
}

// ─── MQTT ─────────────────────────────────────────────────────────────────────

function setConnectionState(state) {
  currentConnectionState = state;
  broadcastConnectionState(state);
  updateTray(currentTrayStatus());
}

function connectMqtt() {
  if (mqttClient) {
    mqttClient.end(true);
    mqttClient = null;
  }

  items.clear();
  broadcastItems();
  setConnectionState('grey');

  const sources = settings.sources || [];
  if (!sources.length) return;

  const url = `mqtt://${settings.mqttHost}:${settings.mqttPort}`;
  const opts = { clean: true, reconnectPeriod: 15_000 };
  if (settings.mqttUsername) {
    opts.username = settings.mqttUsername;
    opts.password = settings.mqttPassword || '';
  }

  console.log(`[MQTT] Connecting to ${url}`);
  mqttClient = mqtt.connect(url, opts);

  mqttClient.on('connect', () => {
    console.log('[MQTT] Connected — subscribing to all source topics');
    for (const source of sources) {
      for (const topic of topicsForSource(source)) {
        mqttClient.subscribe(topic, { qos: 1 });
        console.log(`[MQTT] Subscribed: ${topic}`);
      }
    }
  });

  mqttClient.on('message', (topic, message) => {
    let payload;
    try { payload = JSON.parse(message.toString()); } catch { return; }

    const match = findSourceForTopic(topic);
    if (!match) return;

    const { source, type } = match;
    const existing = items.get(topic);

    let computedStatus;
    let lastReceivedTracked = existing?.lastReceivedTracked ?? null;

    if (type === 'connection_status') {
      if (payload.lastReceived) lastReceivedTracked = payload.lastReceived;
      computedStatus = computeConnectionItemStatus(payload, lastReceivedTracked);
    } else {
      // process_status: use payload.status directly
      computedStatus = payload.status || 'grey';
    }

    items.set(topic, {
      topicKey: topic,
      messageType: type,
      sourceLabel: source.label || source.id,
      payload,
      computedStatus,
      lastReceivedTracked,
      lastUpdated: new Date().toISOString(),
    });

    if (currentConnectionState !== 'live') setConnectionState('live');
    updateTray(currentTrayStatus());
    broadcastItems();

    if (type === 'process_status') {
      const prev = existing;
      if (prev && prev.computedStatus !== computedStatus && currentConnectionState === 'live') {
        sendProcessNotification(source.label, computedStatus, payload);
      }
    }
  });

  mqttClient.on('error', (err) => {
    console.error('[MQTT] Error:', err.message);
    setConnectionState('black');
  });

  mqttClient.on('close', () => {
    if (currentConnectionState === 'live') {
      currentConnectionState = 'grey';
      broadcastConnectionState('grey');
      updateTray('grey');
    }
  });
}

// ─── Staleness check ──────────────────────────────────────────────────────────

// Runs every 60s to recompute connection_status items that may have aged
// into yellow/red without new MQTT messages arriving.
function startStalenessCheck() {
  setInterval(() => {
    if (currentConnectionState !== 'live') return;
    let changed = false;
    for (const [key, item] of items) {
      if (item.messageType !== 'connection_status') continue;
      const newStatus = computeConnectionItemStatus(item.payload, item.lastReceivedTracked);
      if (newStatus !== item.computedStatus) {
        items.set(key, { ...item, computedStatus: newStatus });
        changed = true;
      }
    }
    if (changed) {
      updateTray(currentTrayStatus());
      broadcastItems();
    }
  }, 60_000);
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
  mainWindow = new BrowserWindow({
    width: 460,
    height: 560,
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

function broadcastItems() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('mqtt:items', Object.fromEntries(items));
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

// ─── App lifecycle ─────────────────────────────────────────────────────────────

app.whenReady().then(() => {
  if (app.dock) app.dock.hide();

  tray = new Tray(icons.grey);
  updateTray('grey');

  tray.on('click', () => {
    if (mainWindow && mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      showWindow();
    }
  });

  startStalenessCheck();
  connectMqtt();
});

app.on('before-quit', () => { isQuitting = true; });
app.on('window-all-closed', () => {});
app.on('will-quit', () => { if (mqttClient) mqttClient.end(true); });

// ─── IPC handlers ─────────────────────────────────────────────────────────────

ipcMain.handle('items:get', () => ({
  items: Object.fromEntries(items),
  connectionState: currentConnectionState,
}));

ipcMain.handle('settings:get', () => settings);

ipcMain.handle('settings:save', (_e, newSettings) => {
  settings = { ...settings, ...newSettings };
  saveSettings(settings);
  connectMqtt();
  return { ok: true };
});

ipcMain.handle('items:remove', (_e, topicKey) => {
  items.delete(topicKey);

  // Publish an empty retained payload — this tells the broker to delete the
  // retained message so the ghost doesn't come back on reconnect.
  if (mqttClient?.connected) {
    mqttClient.publish(topicKey, '', { retain: true, qos: 1 }, (err) => {
      if (err) console.error(`[MQTT] Failed to clear retained: ${topicKey}`, err.message);
      else     console.log(`[MQTT] Cleared retained message: ${topicKey}`);
    });
  } else {
    console.warn(`[MQTT] Not connected — removed locally but could not clear retained: ${topicKey}`);
  }

  updateTray(currentTrayStatus());
  broadcastItems();
  return { ok: true };
});

ipcMain.handle('shell:openExternal', (_e, url) => shell.openExternal(url));

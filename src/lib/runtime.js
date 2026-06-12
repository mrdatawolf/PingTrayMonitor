// Unified data-layer API for the renderer. In Electron, everything is
// delegated to the main process over the `window.electron` IPC bridge. In a
// browser (GitHub Pages), there is no main process — settings live in
// localStorage and the MQTT runtime (mqttClient.js) connects directly over
// wss. Components should use this module instead of touching
// `window.electron` or localStorage directly.
import { createMqttRuntime } from './mqttClient';
import { useMonitorStore, useSettingsStore } from '../store';

export const isElectron = typeof window !== 'undefined' && !!window.electron;

const STORAGE_KEY = 'pingtray.settings';

const WEB_DEFAULT_SETTINGS = {
  theme: 'dark',
  removedTopics: [],
  mqttHost: '',
  mqttPort: 1883,
  mqttWsPort: 9001,
  mqttWsPath: '/ws',
  mqttProtocol: 'wss', // browsers can't open raw TCP, and https pages require wss
  mqttUsername: '',
  mqttPassword: '',
  sources: [],
};

function loadWebSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore — fall back to defaults */ }
  return null;
}

function saveWebSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch { /* localStorage unavailable — settings won't persist */ }
}

let webRuntime = null;

// Connects the data layer and wires live updates into the monitor/settings
// stores. Call once when the app mounts.
export function init() {
  const { setItems, setConnectionState, setRemovedTopics } = useMonitorStore.getState();
  const { setSettings, setTheme } = useSettingsStore.getState();

  if (isElectron) {
    window.electron.getItems().then(({ items, connectionState, removedTopics }) => {
      setItems(items || {});
      setConnectionState(connectionState);
      setRemovedTopics(removedTopics || []);
    });
    window.electron.getSettings().then((s) => { if (s) setSettings(s); });
    window.electron.getTheme().then((t) => { if (t) setTheme(t); });

    window.electron.onItems((items) => setItems(items));
    window.electron.onConnection((state) => setConnectionState(state));
    window.electron.onRemovedTopics((topics) => setRemovedTopics(topics));
    return;
  }

  const stored = loadWebSettings();
  const settings = { ...WEB_DEFAULT_SETTINGS, ...(stored || {}), mqttProtocol: 'wss' };
  setSettings(settings);
  setTheme(settings.theme);

  webRuntime = createMqttRuntime(settings, settings.removedTopics, {
    onItems: (items) => setItems(items),
    onConnectionState: (state) => setConnectionState(state),
    onRemovedTopics: (removedTopics) => {
      setRemovedTopics(removedTopics);
      saveWebSettings({ ...loadWebSettings(), removedTopics });
    },
  });

  const snapshot = webRuntime.getSnapshot();
  setItems(snapshot.items);
  setConnectionState(snapshot.connectionState);
  setRemovedTopics(snapshot.removedTopics);
}

export async function saveSettings(newSettings) {
  if (isElectron) return window.electron.saveSettings(newSettings);

  const merged = { ...loadWebSettings(), ...newSettings, mqttProtocol: 'wss' };
  saveWebSettings(merged);
  webRuntime?.reconnect(merged);
  return { ok: true };
}

export function removeItem(topicKey) {
  if (isElectron) return window.electron.removeItem(topicKey);
  webRuntime?.removeItem(topicKey);
}

export function removeItems(topicKeys) {
  if (isElectron) return window.electron.removeItems(topicKeys);
  webRuntime?.removeItems(topicKeys);
}

export function restoreItem(topicKey) {
  if (isElectron) return window.electron.restoreItem(topicKey);
  webRuntime?.restoreItem(topicKey);
}

export async function setTheme(mode) {
  const theme = mode === 'light' ? 'light' : 'dark';
  if (isElectron) return window.electron.setTheme(theme);

  saveWebSettings({ ...loadWebSettings(), theme });
  return { ok: true, theme };
}

export async function getAutostart() {
  if (isElectron) return window.electron.getAutostart();
  return false;
}

export async function setAutostart(enabled) {
  if (isElectron) return window.electron.setAutostart(enabled);
  return { ok: true, enabled: false };
}

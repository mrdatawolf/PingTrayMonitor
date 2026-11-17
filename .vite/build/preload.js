"use strict";
const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("electron", {
  // Live pushes from main process
  onItems: (cb) => ipcRenderer.on("mqtt:items", (_e, items) => cb(items)),
  onConnection: (cb) => ipcRenderer.on("mqtt:connection", (_e, state) => cb(state)),
  // One-time fetch for initial render
  getItems: () => ipcRenderer.invoke("items:get"),
  // Settings
  getSettings: () => ipcRenderer.invoke("settings:get"),
  saveSettings: (settings) => ipcRenderer.invoke("settings:save", settings),
  removeItem: (topicKey) => ipcRenderer.invoke("items:remove", topicKey),
  removeItems: (topicKeys) => ipcRenderer.invoke("items:removeMany", topicKeys),
  getRemovedTopics: () => ipcRenderer.invoke("items:getRemovedTopics"),
  restoreItem: (topicKey) => ipcRenderer.invoke("items:restore", topicKey),
  setAcknowledged: (topicKey, on) => ipcRenderer.invoke("items:setAcknowledged", topicKey, on),
  onRemovedTopics: (cb) => ipcRenderer.on("mqtt:removedTopics", (_e, topics) => cb(topics)),
  // Launch at login
  getAutostart: () => ipcRenderer.invoke("autostart:get"),
  setAutostart: (enabled) => ipcRenderer.invoke("autostart:set", enabled),
  // Light / dark mode
  getTheme: () => ipcRenderer.invoke("theme:get"),
  setTheme: (mode) => ipcRenderer.invoke("theme:set", mode),
  // History window
  openHistory: () => ipcRenderer.invoke("history:open"),
  getHistory: (rangeMs) => ipcRenderer.invoke("history:query", rangeMs),
  getHistoryBaselines: () => ipcRenderer.invoke("history:baselines"),
  getHistoryPatterns: (rangeMs) => ipcRenderer.invoke("history:patterns", rangeMs),
  getHistorySamples: (keys, from, to) => ipcRenderer.invoke("history:samples", keys, from, to),
  // → { topicKey: samples[] }
  openExternal: (url) => ipcRenderer.invoke("shell:openExternal", url)
});

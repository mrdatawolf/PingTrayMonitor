import { create } from 'zustand';

export const useMonitorStore = create((set) => ({
  items: {},              // topicKey → item data from main process
  connectionState: 'grey', // 'grey' | 'live' | 'black'

  setItems: (items) => set({ items }),
  setConnectionState: (connectionState) => set({ connectionState }),
}));

export const useSettingsStore = create((set) => ({
  mqttHost:     '',
  mqttPort:     1883,
  mqttUsername: '',
  mqttPassword: '',
  sources:      [],

  setSettings: (s) => set({
    mqttHost:     s.mqttHost     || '',
    mqttPort:     s.mqttPort     || 1883,
    mqttUsername: s.mqttUsername || '',
    mqttPassword: s.mqttPassword || '',
    sources:      s.sources      || [],
  }),
}));

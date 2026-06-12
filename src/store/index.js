import { create } from 'zustand';
import { getColors } from '../theme';

export const useMonitorStore = create((set) => ({
  items: {},              // topicKey → item data from main process
  connectionState: 'grey', // 'grey' | 'live' | 'black'
  removedTopics: [],      // [{ topicKey, sourceLabel, label }]

  setItems: (items) => set({ items }),
  setConnectionState: (connectionState) => set({ connectionState }),
  setRemovedTopics: (removedTopics) => set({ removedTopics }),
}));

export const useSettingsStore = create((set) => ({
  theme:        'dark', // 'dark' | 'light' — UI mode, stored per device
  mqttHost:     '',
  mqttPort:     1883,
  mqttWsPort:   9001,
  mqttWsPath:   '/ws',
  mqttUsername: '',
  mqttPassword: '',
  sources:      [],

  setTheme: (theme) => set({ theme: theme === 'light' ? 'light' : 'dark' }),

  setSettings: (s) => set({
    mqttHost:     s.mqttHost     || '',
    mqttPort:     s.mqttPort     || 1883,
    mqttWsPort:   s.mqttWsPort   || 9001,
    mqttWsPath:   s.mqttWsPath   || '/ws',
    mqttUsername: s.mqttUsername || '',
    mqttPassword: s.mqttPassword || '',
    sources:      s.sources      || [],
  }),
}));

// Resolves the persisted theme preference to its semantic color palette.
export function useThemeColors() {
  return getColors(useSettingsStore((s) => s.theme));
}

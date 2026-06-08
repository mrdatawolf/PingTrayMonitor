import React, { useState, useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';
import StatusPanel from './components/StatusPanel';
import BlockedPanel from './components/BlockedPanel';
import Settings from './components/Settings';
import { useMonitorStore, useSettingsStore } from './store';
import { getColors } from './theme';

function aggregateFromItems(items) {
  const statuses = Object.values(items).map((i) => i.computedStatus).filter(Boolean);
  if (!statuses.length) return null;
  if (statuses.includes('red'))    return 'red';
  if (statuses.includes('yellow')) return 'yellow';
  return 'green';
}

export default function App() {
  const [view, setView] = useState('status');
  const setItems = useMonitorStore((s) => s.setItems);
  const setConnectionState = useMonitorStore((s) => s.setConnectionState);
  const setRemovedTopics = useMonitorStore((s) => s.setRemovedTopics);
  const removedTopics = useMonitorStore((s) => s.removedTopics);
  const setSettings = useSettingsStore((s) => s.setSettings);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const mode = useSettingsStore((s) => s.theme);
  const connectionState = useMonitorStore((s) => s.connectionState);
  const items = useMonitorStore((s) => s.items);

  const c = getColors(mode);
  const aggregate = aggregateFromItems(items);

  const headerDotColor =
    connectionState === 'black' ? '#3a3a3a' :
    connectionState === 'grey'  ? '#595959' :
    aggregate === 'red'    ? '#ff4d4f' :
    aggregate === 'yellow' ? '#faad14' :
    aggregate === 'green'  ? '#52c41a' : '#595959';

  useEffect(() => {
    window.electron?.getItems().then(({ items, connectionState, removedTopics }) => {
      setItems(items || {});
      setConnectionState(connectionState);
      setRemovedTopics(removedTopics || []);
    });
    window.electron?.getSettings().then((s) => {
      if (s) setSettings(s);
    });
    window.electron?.getTheme().then((t) => { if (t) setTheme(t); });
  }, []);

  useEffect(() => {
    window.electron?.onItems((incoming) => setItems(incoming));
    window.electron?.onConnection((state) => setConnectionState(state));
    window.electron?.onRemovedTopics((topics) => setRemovedTopics(topics));
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  return (
    <ConfigProvider
      theme={{
        algorithm: mode === 'light' ? theme.defaultAlgorithm : theme.darkAlgorithm,
        token: {
          colorPrimary: '#52c41a',
          borderRadius: 6,
          colorBgContainer: c.panelBg,
          colorBgElevated: c.headerBg,
        },
      }}
    >
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: c.pageBg }}>
        <header className="app-header">
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: headerDotColor, flexShrink: 0,
            transition: 'background 0.4s',
          }} />
          <span style={{ fontSize: 14, fontWeight: 700, color: c.textPrimary, flex: 1 }}>
            Ping Monitor
          </span>
          {/* Blocked items button — only shown when there are blocked items or we're on that view */}
          {(view === 'blocked' || removedTopics.length > 0) && (
            <button
              onClick={() => setView(view === 'blocked' ? 'status' : 'blocked')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: view === 'blocked' ? c.textPrimary : c.textTertiary,
                fontSize: 11, padding: '0 6px',
                WebkitAppRegion: 'no-drag',
                display: 'flex', alignItems: 'center', gap: 3,
              }}
              title={view === 'blocked' ? 'Back to status' : 'Blocked items'}
            >
              <span style={{ fontSize: 14, lineHeight: 1 }}>⊗</span>
              {removedTopics.length > 0 && (
                <span style={{
                  fontSize: 10,
                  background: c.borderSubtle,
                  borderRadius: 8,
                  padding: '1px 5px',
                  color: c.textSecondary,
                }}>
                  {removedTopics.length}
                </span>
              )}
            </button>
          )}
          <button
            onClick={() => setView(view === 'settings' ? 'status' : 'settings')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: c.textSecondary, fontSize: 18, padding: '0 4px',
              WebkitAppRegion: 'no-drag',
            }}
            title={view === 'settings' ? 'Back' : 'Settings'}
          >
            {view === 'settings' ? '←' : '⚙'}
          </button>
        </header>

        <div className="app-content" style={{ flex: 1, overflow: 'auto' }}>
          {view === 'status'   && <StatusPanel />}
          {view === 'blocked'  && <BlockedPanel />}
          {view === 'settings' && <Settings onSaved={() => setView('status')} />}
        </div>
      </div>
    </ConfigProvider>
  );
}

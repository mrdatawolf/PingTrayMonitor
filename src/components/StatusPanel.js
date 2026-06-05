import React, { useState, useEffect } from 'react';
import { Divider, Tag, Tooltip } from 'antd';
import {
  CheckCircleFilled, WarningFilled, CloseCircleFilled,
  ClockCircleOutlined, WifiOutlined, DisconnectOutlined,
  ApiOutlined,
} from '@ant-design/icons';
import { useMonitorStore } from '../store';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatRelative(isoString) {
  if (!isoString) return 'Never';
  const diff = Date.now() - new Date(isoString).getTime();
  const hours = Math.floor(diff / 3_600_000);
  const mins  = Math.floor((diff % 3_600_000) / 60_000);
  const secs  = Math.floor((diff % 60_000) / 1_000);
  if (hours > 48) return `${Math.floor(hours / 24)}d ago`;
  if (hours > 0)  return `${hours}h ${mins}m ago`;
  if (mins > 0)   return `${mins}m ago`;
  if (secs > 10)  return `${secs}s ago`;
  return 'Just now';
}

function formatDate(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleString(undefined, {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

// Recompute connection item status based on current time (mirrors main.js logic)
function computeConnectionStatus(item, now) {
  const lr = item.lastReceivedTracked || item.payload?.lastReceived;
  if (!lr) return 'red';
  const age = now - new Date(lr).getTime();
  const refreshMs = (item.payload?.refreshMinutes || 1) * 60_000;
  if (age < 3 * refreshMs) return 'green';
  if (age < 5 * refreshMs) return 'yellow';
  return 'red';
}

const STATUS_COLORS = {
  green:  '#52c41a',
  yellow: '#faad14',
  red:    '#ff4d4f',
  grey:   '#595959',
};

const STATUS_BG = {
  green:  '#162312',
  yellow: '#2b2111',
  red:    '#2a1215',
  grey:   '#1a1a1a',
};

const STATUS_BORDER = {
  green:  '#274916',
  yellow: '#443111',
  red:    '#431418',
  grey:   '#2a2a2a',
};

function StatusIcon({ status, size = 16 }) {
  if (status === 'green')  return <CheckCircleFilled style={{ color: '#52c41a', fontSize: size }} />;
  if (status === 'yellow') return <WarningFilled     style={{ color: '#faad14', fontSize: size }} />;
  if (status === 'red')    return <CloseCircleFilled style={{ color: '#ff4d4f', fontSize: size }} />;
  return <ClockCircleOutlined style={{ color: '#595959', fontSize: size }} />;
}

function SmallDot({ status }) {
  return (
    <span
      className={`status-dot ${status || 'grey'}`}
      style={{ width: 10, height: 10, marginTop: 2, flexShrink: 0 }}
    />
  );
}

// ─── Grey state ───────────────────────────────────────────────────────────────

function GreyPanel() {
  return (
    <div style={{ padding: 24, textAlign: 'center', color: '#595959' }}>
      <span className="status-dot grey" style={{ width: 44, height: 44, margin: '0 auto 16px', display: 'block' }} />
      <p style={{ fontSize: 13, color: '#8c8c8c' }}>Connecting…</p>
      <p style={{ fontSize: 11, marginTop: 8, color: '#595959' }}>
        Waiting for data from MQTT broker.
      </p>
    </div>
  );
}

// ─── Black state ──────────────────────────────────────────────────────────────

function BlackPanel() {
  return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <span className="status-dot black" style={{ width: 44, height: 44, margin: '0 auto 16px', display: 'block' }} />
      <div style={{ fontSize: 14, fontWeight: 600, color: '#595959', marginBottom: 8 }}>
        Broker Unreachable
      </div>
      <p style={{ fontSize: 12, color: '#434343', lineHeight: 1.6 }}>
        Cannot connect to the MQTT broker.<br />Check Settings and verify the broker is online.
      </p>
    </div>
  );
}

// ─── Delete button (hover-reveal) ────────────────────────────────────────────

function DeleteButton({ topicKey }) {
  const [hovered, setHovered] = useState(false);
  const [confirming, setConfirming] = useState(false);

  function handleClick(e) {
    e.stopPropagation();
    if (!confirming) { setConfirming(true); return; }
    window.electron?.removeItem(topicKey);
    setConfirming(false);
  }

  function handleBlur() { setConfirming(false); }

  return (
    <button
      onClick={handleClick}
      onBlur={handleBlur}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setConfirming(false); }}
      title={confirming ? 'Click again to confirm removal' : 'Remove this item (clears retained MQTT message)'}
      style={{
        background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px',
        fontSize: 12, lineHeight: 1, flexShrink: 0, marginLeft: 2,
        color: confirming ? '#ff4d4f' : hovered ? '#8c8c8c' : '#3a3a3a',
        transition: 'color 0.15s',
        WebkitAppRegion: 'no-drag',
      }}
    >
      {confirming ? '✕?' : '✕'}
    </button>
  );
}

// ─── Connection status item row ───────────────────────────────────────────────

function ConnectionRow({ item, now }) {
  const status = computeConnectionStatus(item, now);
  const { payload } = item;

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      padding: '7px 0', borderBottom: '1px solid #1f1f1f',
    }}>
      <SmallDot status={status} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, color: '#d9d9d9', fontWeight: 500, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {payload.label || payload.id}
          </span>
        </div>
        <div style={{ fontSize: 10, color: '#595959', marginTop: 2, display: 'flex', gap: 10 }}>
          {payload.latencyMs != null && (
            <span>{Math.round(payload.latencyMs)}ms</span>
          )}
          {payload.packetLoss != null && payload.packetLoss > 0 && (
            <span style={{ color: '#faad14' }}>{payload.packetLoss}% loss</span>
          )}
          <span>last: {formatRelative(item.lastReceivedTracked || payload.lastReceived)}</span>
        </div>
      </div>
      <DeleteButton topicKey={item.topicKey} />
    </div>
  );
}

// ─── Process status item row ──────────────────────────────────────────────────

const PROCESS_STATUS_CONFIG = {
  green:  { color: '#52c41a', label: 'OK' },
  yellow: { color: '#faad14', label: 'Warning' },
  red:    { color: '#ff4d4f', label: 'Error' },
};

function ProcessRow({ item }) {
  const { payload, sourceLabel } = item;
  const cfg = PROCESS_STATUS_CONFIG[payload.status] || { color: '#595959', label: 'Unknown' };

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      padding: '7px 0', borderBottom: '1px solid #1f1f1f',
    }}>
      <SmallDot status={payload.status} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, color: '#d9d9d9', fontWeight: 500, flex: 1 }}>
            {sourceLabel}
          </span>
          <Tag
            color={payload.status === 'green' ? 'success' : payload.status === 'yellow' ? 'warning' : 'error'}
            style={{ fontSize: 10, padding: '0 4px', lineHeight: '16px', flexShrink: 0 }}
          >
            {cfg.label}
          </Tag>
        </div>
        <div style={{ fontSize: 10, color: '#595959', marginTop: 2, display: 'flex', gap: 10 }}>
          {payload.stage && <span style={{ color: '#8c8c8c' }}>stage: {payload.stage}</span>}
          <span>checked: {formatRelative(payload.checkedAt)}</span>
        </div>
        {payload.detail && (
          <div style={{ fontSize: 10, color: '#8c8c8c', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {payload.detail}
          </div>
        )}
      </div>
      <DeleteButton topicKey={item.topicKey} />
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({ icon, title, count, statusSummary }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '8px 0 4px',
      fontSize: 10, color: '#595959',
      textTransform: 'uppercase', letterSpacing: 1,
    }}>
      <span style={{ fontSize: 12 }}>{icon}</span>
      <span style={{ flex: 1 }}>{title}</span>
      <span style={{ fontSize: 10, color: '#434343' }}>{count} checks</span>
      {statusSummary}
    </div>
  );
}

// ─── Main panel ───────────────────────────────────────────────────────────────

export default function StatusPanel() {
  const { items, connectionState } = useMonitorStore();

  // Tick every 30s so connection status ages display correctly
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  if (connectionState === 'black') return <BlackPanel />;

  const allItems = Object.values(items);
  if (!allItems.length) return <GreyPanel />;

  const connectionItems = allItems
    .filter((i) => i.messageType === 'connection_status')
    .sort((a, b) => (a.payload?.label || a.payload?.id || '').localeCompare(b.payload?.label || b.payload?.id || ''));

  const processItems = allItems
    .filter((i) => i.messageType === 'process_status')
    .sort((a, b) => a.sourceLabel.localeCompare(b.sourceLabel));

  // Aggregate across all items (recomputing connection items with current time)
  const connectionStatuses = connectionItems.map((i) => computeConnectionStatus(i, now));
  const processStatuses = processItems.map((i) => i.computedStatus);
  const allStatuses = [...connectionStatuses, ...processStatuses].filter(Boolean);
  const aggregate =
    allStatuses.includes('red')    ? 'red' :
    allStatuses.includes('yellow') ? 'yellow' :
    allStatuses.length             ? 'green' : 'grey';

  const heroColor  = STATUS_COLORS[aggregate] || '#595959';
  const heroBg     = STATUS_BG[aggregate]     || '#1a1a1a';
  const heroBorder = STATUS_BORDER[aggregate] || '#2a2a2a';

  const heroLabels = {
    green:  'All Systems OK',
    yellow: 'Degraded',
    red:    'Issues Detected',
    grey:   'No Data',
  };

  const redCount    = allStatuses.filter((s) => s === 'red').length;
  const yellowCount = allStatuses.filter((s) => s === 'yellow').length;
  const greenCount  = allStatuses.filter((s) => s === 'green').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Hero */}
      <div style={{
        padding: '16px 20px',
        background: heroBg,
        borderBottom: `1px solid ${heroBorder}`,
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <span className={`status-dot ${aggregate}`} style={{ width: 40, height: 40 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: heroColor, lineHeight: 1.2 }}>
            {heroLabels[aggregate]}
          </div>
          <div style={{ fontSize: 11, color: '#8c8c8c', marginTop: 4, display: 'flex', gap: 10 }}>
            {greenCount  > 0 && <span style={{ color: '#52c41a' }}>{greenCount} OK</span>}
            {yellowCount > 0 && <span style={{ color: '#faad14' }}>{yellowCount} degraded</span>}
            {redCount    > 0 && <span style={{ color: '#ff4d4f' }}>{redCount} down</span>}
          </div>
        </div>
        <StatusIcon status={aggregate} size={22} />
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0 20px 16px' }}>

        {/* Connection checks section */}
        {connectionItems.length > 0 && (
          <>
            <SectionHeader
              icon={<WifiOutlined />}
              title="Connection Checks"
              count={connectionItems.length}
            />
            {connectionItems.map((item) => (
              <ConnectionRow key={item.topicKey} item={item} now={now} />
            ))}
          </>
        )}

        {/* Process status section */}
        {processItems.length > 0 && (
          <>
            <div style={{ height: connectionItems.length > 0 ? 12 : 0 }} />
            <SectionHeader
              icon={<ApiOutlined />}
              title="Process Status"
              count={processItems.length}
            />
            {processItems.map((item) => (
              <ProcessRow key={item.topicKey} item={item} />
            ))}
          </>
        )}

      </div>
    </div>
  );
}

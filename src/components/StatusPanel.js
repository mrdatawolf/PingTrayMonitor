import React, { useState, useEffect } from 'react';
import { Tag } from 'antd';
import {
  CheckCircleFilled, WarningFilled, CloseCircleFilled,
  ClockCircleOutlined, ThunderboltFilled,
} from '@ant-design/icons';
import { useMonitorStore, useThemeColors } from '../store';
import {
  computeConnectionStatus, hasRecentInstability, groupConnectionsBySubject,
  formatRelative, isGhostItem,
} from '../lib/connectionStatus';
import StaleCleanupModal from './StaleCleanupModal';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatAge(seconds) {
  if (seconds < 60)    return `${Math.round(seconds)}s`;
  if (seconds < 3600)  return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  return `${Math.floor(seconds / 86400)}d`;
}

// Saturated status colors stay constant across themes — only the chrome
// (panels, borders, text) needs to adapt; see STATUS_BG/STATUS_BORDER below
// which are theme-dependent and computed from the palette at render time.
const STATUS_COLORS = {
  green:  '#52c41a',
  yellow: '#faad14',
  orange: '#fa8c16',
  red:    '#ff4d4f',
  grey:   '#595959',
};

const TYPE_CHIP_LABELS = {
  icmp:              'ICMP',
  tcp:               'TCP',
  file_mtime:        'FILE',
  dated_file_exists: 'FILE',
  db_currency:       'DB',
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

// Small "this was unstable recently" indicator — shown regardless of the
// current up/down status, so a check that's green right now but flapped
// in the last hour (or is showing recent packet loss) doesn't look silently
// fine.
function InstabilityBadge({ payload }) {
  if (!hasRecentInstability(payload)) return null;
  const parts = [];
  if (payload.transitions1h > 0) {
    parts.push(`flapped ${payload.transitions1h}x in the last hour`);
  }
  if (payload.rollingPacketLoss10 > 0) {
    parts.push(`${payload.rollingPacketLoss10}% loss (last 10 checks)`);
  }
  return (
    <span title={parts.join(' · ')} style={{ color: '#fa8c16', display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>
      <ThunderboltFilled style={{ fontSize: 10 }} />
    </span>
  );
}

// ─── Grey / Black states ───────────────────────────────────────────────────────

function GreyPanel() {
  const c = useThemeColors();
  return (
    <div style={{ padding: 24, textAlign: 'center', color: c.textTertiary }}>
      <span className="status-dot grey" style={{ width: 44, height: 44, margin: '0 auto 16px', display: 'block' }} />
      <p style={{ fontSize: 13, color: c.textSecondary }}>Connecting…</p>
      <p style={{ fontSize: 11, marginTop: 8, color: c.textTertiary }}>
        Waiting for data from MQTT broker.
      </p>
    </div>
  );
}

function BlackPanel() {
  const c = useThemeColors();
  return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <span className="status-dot black" style={{ width: 44, height: 44, margin: '0 auto 16px', display: 'block' }} />
      <div style={{ fontSize: 14, fontWeight: 600, color: c.textTertiary, marginBottom: 8 }}>
        Broker Unreachable
      </div>
      <p style={{ fontSize: 12, color: c.textFaint, lineHeight: 1.6 }}>
        Cannot connect to the MQTT broker.<br />Check Settings and verify the broker is online.
      </p>
    </div>
  );
}

// ─── Delete button (hover-reveal) ────────────────────────────────────────────

function DeleteButton({ topicKey }) {
  const c = useThemeColors();
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
        color: confirming ? '#ff4d4f' : hovered ? c.textSecondary : c.border,
        transition: 'color 0.15s',
        WebkitAppRegion: 'no-drag',
      }}
    >
      {confirming ? '✕?' : '✕'}
    </button>
  );
}

// ─── Connection item row ──────────────────────────────────────────────────────

function ConnectionRow({ item, now }) {
  const c = useThemeColors();
  const status = computeConnectionStatus(item, now);
  const { payload } = item;
  const type = payload.type;

  let detail;
  if (type === 'icmp' || type === 'tcp') {
    detail = (
      <>
        {payload.latencyMs != null && <span>{Math.round(payload.latencyMs)}ms</span>}
        {payload.packetLoss != null && payload.packetLoss > 0 && (
          <span style={{ color: '#faad14' }}>{payload.packetLoss}% loss</span>
        )}
        <span>checked: {formatRelative(payload.checkedAt)}</span>
      </>
    );
  } else if (type === 'dated_file_exists') {
    detail = (
      <>
        {payload.error
          ? <span style={{ color: '#ff4d4f', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180 }}>{payload.error}</span>
          : payload.exists
            ? <span>{payload.sizeBytes != null ? `${(payload.sizeBytes / 1024).toFixed(1)} KB` : 'exists'}</span>
            : <span style={{ color: '#ff4d4f' }}>file missing</span>
        }
        <span style={{ flexShrink: 0 }}>checked: {formatRelative(payload.checkedAt)}</span>
      </>
    );
  } else if (type === 'file_mtime') {
    detail = (
      <>
        {payload.fileCount != null && <span>{payload.fileCount} file{payload.fileCount !== 1 ? 's' : ''}</span>}
        {payload.ageSeconds != null
          ? <span>age: {formatAge(payload.ageSeconds)}</span>
          : <span style={{ color: '#ff4d4f' }}>no file</span>
        }
        <span style={{ flexShrink: 0 }}>checked: {formatRelative(payload.checkedAt)}</span>
      </>
    );
  } else if (type === 'db_currency') {
    detail = (
      <>
        {payload.error
          ? <span style={{ color: '#ff4d4f', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180 }}>{payload.error}</span>
          : payload.ageSeconds != null
            ? <span>record age: {formatAge(payload.ageSeconds)}</span>
            : <span style={{ color: '#ff4d4f' }}>no records</span>
        }
        <span style={{ flexShrink: 0 }}>checked: {formatRelative(payload.checkedAt)}</span>
      </>
    );
  } else {
    detail = (
      <>
        {payload.latencyMs != null && <span>{Math.round(payload.latencyMs)}ms</span>}
        {payload.packetLoss != null && payload.packetLoss > 0 && (
          <span style={{ color: '#faad14' }}>{payload.packetLoss}% loss</span>
        )}
        <span>last: {formatRelative(item.lastReceivedTracked || payload.lastReceived)}</span>
      </>
    );
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      padding: '7px 0', borderBottom: `1px solid ${c.rowBorder}`,
    }}>
      <SmallDot status={status} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, color: c.textBody, fontWeight: 500, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {payload.label || payload.id}
          </span>
          {payload.available !== undefined && (
            <Tag
              color={payload.available ? 'success' : 'error'}
              style={{ fontSize: 10, padding: '0 4px', lineHeight: '16px', flexShrink: 0 }}
            >
              {payload.available ? 'UP' : 'DOWN'}

            </Tag>
          )}
        </div>
        <div style={{ fontSize: 10, color: c.textTertiary, marginTop: 2, display: 'flex', alignItems: 'center', gap: 10 }}>
          {detail}
          <InstabilityBadge payload={payload} />
        </div>
      </div>
      <DeleteButton topicKey={item.topicKey} />
    </div>
  );
}

// ─── Process item row ─────────────────────────────────────────────────────────

const PROCESS_STATUS_CONFIG = {
  green:  { label: 'OK' },
  yellow: { label: 'Warning' },
  red:    { label: 'Error' },
};

function ProcessRow({ item }) {
  const c = useThemeColors();
  const { payload, sourceLabel } = item;
  const cfg = PROCESS_STATUS_CONFIG[payload.status] || { label: 'Unknown' };

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      padding: '7px 0', borderBottom: `1px solid ${c.rowBorder}`,
    }}>
      <SmallDot status={payload.status} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, color: c.textBody, fontWeight: 500, flex: 1 }}>
            {sourceLabel}
          </span>
          <Tag
            color={payload.status === 'green' ? 'success' : payload.status === 'yellow' ? 'warning' : 'error'}
            style={{ fontSize: 10, padding: '0 4px', lineHeight: '16px', flexShrink: 0 }}
          >
            {cfg.label}
          </Tag>
        </div>
        <div style={{ fontSize: 10, color: c.textTertiary, marginTop: 2, display: 'flex', gap: 10 }}>
          {payload.stage && <span style={{ color: c.textSecondary }}>stage: {payload.stage}</span>}
          <span>checked: {formatRelative(payload.checkedAt)}</span>
        </div>
        {payload.detail && (
          <div style={{ fontSize: 10, color: c.textSecondary, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {payload.detail}
          </div>
        )}
      </div>
      <DeleteButton topicKey={item.topicKey} />
    </div>
  );
}

// ─── Source section ───────────────────────────────────────────────────────────

function SourceSection({ label, sourceItems, now, isLast }) {
  const c = useThemeColors();
  const statuses = sourceItems.map(item =>
    item.messageType === 'connection_status'
      ? computeConnectionStatus(item, now)
      : (item.computedStatus || 'grey')
  );
  const agg =
    statuses.includes('red')    ? 'red' :
    statuses.includes('yellow') ? 'yellow' :
    statuses.length             ? 'green' : 'grey';

  const sorted = [...sourceItems].sort((a, b) => {
    const aLabel = a.messageType === 'connection_status'
      ? (a.payload?.label || a.payload?.id || '')
      : a.sourceLabel;
    const bLabel = b.messageType === 'connection_status'
      ? (b.payload?.label || b.payload?.id || '')
      : b.sourceLabel;
    return aLabel.localeCompare(bLabel);
  });

  return (
    <div style={{ marginBottom: isLast ? 0 : 16 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '8px 0 4px',
        borderBottom: `1px solid ${c.borderFaint}`,
      }}>
        <SmallDot status={agg} />
        <span style={{ flex: 1, fontSize: 10, color: c.textSecondary, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
          {label}
        </span>
        <span style={{ fontSize: 10, color: c.textFaint }}>
          {sourceItems.length} check{sourceItems.length !== 1 ? 's' : ''}
        </span>
      </div>
      {sorted.map(item =>
        item.messageType === 'connection_status'
          ? <ConnectionRow key={item.topicKey} item={item} now={now} />
          : <ProcessRow key={item.topicKey} item={item} />
      )}
    </div>
  );
}

// ─── Connections (multi-location) subject group ───────────────────────────────

// One "subject" (e.g. a WAN circuit) checked from one or more locations.
// The subject-level dot/summary applies the down-from-N-locations rule;
// each location's own check is shown as a normal connection row below.
function ConnectionsSubjectGroup({ subjectLabel, items, total, downCount, instableCount, status, now, isLast }) {
  const c = useThemeColors();

  let summary = null;
  if (downCount > 0 && total > 1) {
    summary = status === 'red'
      ? `Down from ${downCount} of ${total} locations — likely the connection itself`
      : `Down from ${downCount} of ${total} location${downCount !== 1 ? 's' : ''} — likely a path issue from ${downCount === 1 ? 'that location' : 'those locations'}, not the connection`;
  } else if (downCount === 0 && instableCount > 0) {
    summary = `Up now, but ${instableCount} of ${total} location${instableCount !== 1 ? 's' : ''} flapped recently`;
  }

  const summaryColor =
    status === 'red'    ? '#ff4d4f' :
    status === 'orange' ? '#fa8c16' :
    instableCount > 0   ? '#fa8c16' : c.textTertiary;

  const sorted = [...items].sort((a, b) =>
    (a.payload?.label || '').localeCompare(b.payload?.label || '')
  );

  return (
    <div style={{ marginBottom: isLast ? 0 : 16 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '8px 0 4px',
        borderBottom: `1px solid ${c.borderFaint}`,
      }}>
        <SmallDot status={status} />
        <span style={{ flex: 1, fontSize: 10, color: c.textSecondary, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
          {subjectLabel}
        </span>
        <span style={{ fontSize: 10, color: c.textFaint }}>
          {total} location{total !== 1 ? 's' : ''}
        </span>
      </div>
      {summary && (
        <div style={{ fontSize: 10, color: summaryColor, padding: '4px 0' }}>
          {summary}
        </div>
      )}
      {sorted.map(item => <ConnectionRow key={item.topicKey} item={item} now={now} />)}
    </div>
  );
}

// ─── Main panel ───────────────────────────────────────────────────────────────

export default function StatusPanel() {
  const c = useThemeColors();
  const { items, connectionState } = useMonitorStore();

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  const [cleanupModalOpen, setCleanupModalOpen] = useState(false);

  if (connectionState === 'black') return <BlackPanel />;

  const allItems = Object.values(items);
  if (!allItems.length) return <GreyPanel />;

  // Items whose underlying check hasn't reported in a long time — likely
  // abandoned/decommissioned sources. Surfaced via a banner offering a
  // one-click bulk cleanup.
  const ghostItems = allItems.filter(item => isGhostItem(item, now));

  // "connections" items are a multi-location view of a shared subject (e.g.
  // a WAN circuit checked from several sites) — group those by subject
  // rather than by reporting source.
  const connectionsItems = allItems.filter(item => item.messageType === 'connections_status');
  const regularItems = allItems.filter(item => item.messageType !== 'connections_status');
  const subjects = groupConnectionsBySubject(connectionsItems, now)
    .sort((a, b) => a.subjectLabel.localeCompare(b.subjectLabel));

  // Group remaining items by source label, sorted alphabetically
  const sourceMap = new Map();
  for (const item of regularItems) {
    const key = item.sourceLabel;
    if (!sourceMap.has(key)) sourceMap.set(key, []);
    sourceMap.get(key).push(item);
  }
  const sources = [...sourceMap.entries()].sort(([a], [b]) => a.localeCompare(b));

  // Overall aggregate across everything — each "connections" subject
  // collapses to a single status (orange folds into yellow here, same as
  // the tray icon) so one localized path issue doesn't read as a full outage.
  const regularStatuses = regularItems.map(item =>
    item.messageType === 'connection_status'
      ? computeConnectionStatus(item, now)
      : (item.computedStatus || 'grey')
  ).filter(Boolean);

  const subjectStatuses = subjects.map(s => s.status === 'orange' ? 'yellow' : s.status);

  const allStatuses = [...regularStatuses, ...subjectStatuses];

  const aggregate =
    allStatuses.includes('red')    ? 'red' :
    allStatuses.includes('yellow') ? 'yellow' :
    allStatuses.length             ? 'green' : 'grey';

  const heroColor  = STATUS_COLORS[aggregate]   || c.textTertiary;
  const heroBg     = c.statusBg[aggregate]      || c.panelBg;
  const heroBorder = c.statusBorder[aggregate]  || c.border;

  const heroLabels = { green: 'All Systems OK', yellow: 'Degraded', red: 'Issues Detected', grey: 'No Data' };

  const redCount    = allStatuses.filter(s => s === 'red').length;
  const yellowCount = allStatuses.filter(s => s === 'yellow').length;
  const greenCount  = allStatuses.filter(s => s === 'green').length;

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
          <div style={{ fontSize: 11, color: c.textSecondary, marginTop: 4, display: 'flex', gap: 10 }}>
            {greenCount  > 0 && <span style={{ color: '#52c41a' }}>{greenCount} OK</span>}
            {yellowCount > 0 && <span style={{ color: '#faad14' }}>{yellowCount} degraded</span>}
            {redCount    > 0 && <span style={{ color: '#ff4d4f' }}>{redCount} down</span>}
          </div>
        </div>
        <StatusIcon status={aggregate} size={22} />
      </div>

      {/* Stale entries banner */}
      {ghostItems.length > 0 && (
        <div
          onClick={() => setCleanupModalOpen(true)}
          style={{
            padding: '8px 20px',
            background: c.statusBg.yellow,
            borderBottom: `1px solid ${c.statusBorder.yellow}`,
            display: 'flex', alignItems: 'center', gap: 8,
            cursor: 'pointer', fontSize: 11, color: '#faad14',
          }}
        >
          <WarningFilled style={{ fontSize: 13, flexShrink: 0 }} />
          <span style={{ flex: 1 }}>
            {ghostItems.length} stale {ghostItems.length === 1 ? 'entry hasn\'t' : 'entries haven\'t'} reported in over a day
          </span>
          <span style={{ fontWeight: 600, textDecoration: 'underline', flexShrink: 0 }}>
            Review &amp; Clean
          </span>
        </div>
      )}

      {/* Scrollable content — multi-location subjects, then one section per source */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0 20px 16px' }}>
        {subjects.map((subject, i) => (
          <ConnectionsSubjectGroup
            key={subject.subjectId}
            {...subject}
            now={now}
            isLast={i === subjects.length - 1 && sources.length === 0}
          />
        ))}
        {sources.map(([label, sourceItems], i) => (
          <SourceSection
            key={label}
            label={label}
            sourceItems={sourceItems}
            now={now}
            isLast={i === sources.length - 1}
          />
        ))}
      </div>

      <StaleCleanupModal
        open={cleanupModalOpen}
        onClose={() => setCleanupModalOpen(false)}
        ghostItems={ghostItems}
      />
    </div>
  );
}

import React from 'react';
import { Modal } from 'antd';
import { useMonitorStore, useThemeColors } from '../store';

function BlockedRow({ item }) {
  const c = useThemeColors();

  function handleRestore() {
    Modal.confirm({
      title: `Restore "${item.label}"?`,
      content: (
        <span style={{ fontSize: 13 }}>
          This item will be tracked again, but it won&apos;t appear in the status
          view until the monitoring agent sends its next update.
          Depending on your check interval, that may take a few minutes.
        </span>
      ),
      okText: 'Restore',
      cancelText: 'Cancel',
      onOk: () => window.electron?.restoreItem(item.topicKey),
    });
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 0', borderBottom: `1px solid ${c.rowBorder}`,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 12, color: c.textBody, fontWeight: 500,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {item.label}
        </div>
        {item.sourceLabel && (
          <div style={{ fontSize: 10, color: c.textTertiary, marginTop: 2 }}>
            {item.sourceLabel}
          </div>
        )}
      </div>
      <button
        onClick={handleRestore}
        style={{
          background: 'none',
          border: `1px solid ${c.border}`,
          borderRadius: 4,
          cursor: 'pointer',
          padding: '2px 8px',
          fontSize: 11,
          color: c.textSecondary,
          flexShrink: 0,
          transition: 'border-color 0.15s, color 0.15s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#52c41a';
          e.currentTarget.style.color = '#52c41a';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = c.border;
          e.currentTarget.style.color = c.textSecondary;
        }}
      >
        Restore
      </button>
    </div>
  );
}

export default function BlockedPanel() {
  const c = useThemeColors();
  const removedTopics = useMonitorStore((s) => s.removedTopics);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{
        padding: '12px 20px',
        borderBottom: `1px solid ${c.borderFaint}`,
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: c.textPrimary }}>
          Blocked Items
        </div>
        <div style={{ fontSize: 11, color: c.textTertiary, marginTop: 4 }}>
          Removed from the status view. Restoring will resubscribe and show the item again on the next update.
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '0 20px 16px' }}>
        {removedTopics.length === 0 ? (
          <div style={{ padding: '32px 0', textAlign: 'center', color: c.textTertiary, fontSize: 12 }}>
            No blocked items.
          </div>
        ) : (
          removedTopics.map((item) => (
            <BlockedRow key={item.topicKey} item={item} />
          ))
        )}
      </div>
    </div>
  );
}

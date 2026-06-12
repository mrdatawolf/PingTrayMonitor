import React, { useState, useEffect } from 'react';
import { Modal, Checkbox, Button } from 'antd';
import { useThemeColors } from '../store';
import { formatRelative } from '../lib/connectionStatus';
import * as runtime from '../lib/runtime';

function GhostRow({ item, checked, onToggle }) {
  const c = useThemeColors();
  const label = item.payload?.label || item.payload?.id || item.sourceLabel || item.topicKey;

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      padding: '8px 0', borderBottom: `1px solid ${c.rowBorder}`,
    }}>
      <Checkbox checked={checked} onChange={() => onToggle(item.topicKey)} style={{ marginTop: 2 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, color: c.textBody, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {label}
        </div>
        <div style={{ fontSize: 10, color: c.textTertiary, marginTop: 2 }}>
          {item.sourceLabel} · last seen {formatRelative(item.lastUpdated)}
        </div>
      </div>
    </div>
  );
}

export default function StaleCleanupModal({ open, onClose, ghostItems }) {
  const c = useThemeColors();
  const [selected, setSelected] = useState(() => new Set());

  // Pre-check everything when the modal opens. Intentionally NOT
  // re-seeded when ghostItems changes (e.g. the 30s tick or a new
  // message arrives) — that would silently re-check items the user
  // already unchecked. Items that drop out of ghostItems while the
  // modal is open simply stop being rendered (see liveGhosts below)
  // and are excluded from the removal call.
  useEffect(() => {
    if (open) setSelected(new Set(ghostItems.map((i) => i.topicKey)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function toggle(topicKey) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(topicKey)) next.delete(topicKey);
      else next.add(topicKey);
      return next;
    });
  }

  const liveGhosts = ghostItems;
  const selectedCount = liveGhosts.filter((i) => selected.has(i.topicKey)).length;

  function handleRemove() {
    const keys = liveGhosts.filter((i) => selected.has(i.topicKey)).map((i) => i.topicKey);
    runtime.removeItems(keys);
    onClose();
  }

  return (
    <Modal
      title={`Review stale entries (${liveGhosts.length})`}
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>Cancel</Button>,
        <Button key="remove" type="primary" danger onClick={handleRemove} disabled={selectedCount === 0}>
          Remove Selected ({selectedCount})
        </Button>,
      ]}
    >
      <p style={{ fontSize: 12, color: c.textSecondary, marginBottom: 12 }}>
        These haven't sent any update in over 24 hours and are likely
        decommissioned. Uncheck any you want to keep.
      </p>
      <div style={{ maxHeight: 320, overflow: 'auto' }}>
        {liveGhosts.map((item) => (
          <GhostRow
            key={item.topicKey}
            item={item}
            checked={selected.has(item.topicKey)}
            onToggle={toggle}
          />
        ))}
      </div>
    </Modal>
  );
}

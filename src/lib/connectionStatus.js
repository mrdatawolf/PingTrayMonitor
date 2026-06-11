// Shared connection-status helpers for the renderer (App.js + StatusPanel.js).
// Mirrors computeConnectionItemStatus / subjectAggregateStatus in
// electron/main.js — keep in sync.

export function computeConnectionStatus(item, now) {
  const { payload } = item;
  const refreshMs = (payload?.refreshMinutes || 5) * 60_000;
  const type = payload?.type;

  if (type === 'icmp' || type === 'tcp' || type === 'dated_file_exists' || type === 'file_mtime' || type === 'db_currency') {
    if (payload.checkedAt) {
      const staleness = now - new Date(payload.checkedAt).getTime();
      if (staleness > 5 * refreshMs) return 'red';
      if (staleness > 3 * refreshMs) return 'yellow';
    }
    if (type === 'icmp' || type === 'tcp') return payload.available ? 'green' : 'red';
    if (type === 'dated_file_exists') {
      if (payload.error) return 'red';
      return payload.exists ? 'green' : 'red';
    }
    if (payload.error) return 'red';
    if (payload.ageSeconds == null) return 'red';
    const ageMs = payload.ageSeconds * 1000;
    if (ageMs < 3 * refreshMs) return 'green';
    if (ageMs < 5 * refreshMs) return 'yellow';
    return 'red';
  }

  // Legacy lastReceived-based checks
  const lr = item.lastReceivedTracked || payload?.lastReceived;
  if (!lr) return 'red';
  const age = now - new Date(lr).getTime();
  if (age < 3 * refreshMs) return 'green';
  if (age < 5 * refreshMs) return 'yellow';
  return 'red';
}

// Aggregate status for a "connections" subject checked from multiple
// locations: majority down means the subject itself is likely down (red),
// a minority means it's more likely a path issue local to those locations
// (orange) rather than the connection being monitored.
export function subjectAggregateStatus(downCount, total) {
  if (downCount === 0) return 'green';
  return downCount / total > 0.5 ? 'red' : 'orange';
}

// True if the check flapped or saw packet loss recently, even if it's
// currently up — surfaces "was this stable?" independent of "is it up now?"
export function hasRecentInstability(payload) {
  return (payload?.transitions1h || 0) > 0 || (payload?.rollingPacketLoss10 || 0) > 0;
}

// Groups items by payload.subjectId and reduces each group's per-location
// computedStatus values down to a single subject-level status.
export function groupConnectionsBySubject(connectionsItems, now) {
  const subjectMap = new Map();
  for (const item of connectionsItems) {
    const sid = item.payload?.subjectId;
    if (!subjectMap.has(sid)) {
      subjectMap.set(sid, { subjectId: sid, subjectLabel: item.payload?.subjectLabel || sid, items: [] });
    }
    subjectMap.get(sid).items.push(item);
  }

  return [...subjectMap.values()].map((group) => {
    const downCount = group.items.filter((item) => computeConnectionStatus(item, now) === 'red').length;
    const instableCount = group.items.filter((item) => hasRecentInstability(item.payload)).length;
    return {
      ...group,
      downCount,
      instableCount,
      total: group.items.length,
      status: subjectAggregateStatus(downCount, group.items.length),
    };
  });
}

// Formats an ISO timestamp as a short "X ago" string for display.
export function formatRelative(isoString) {
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

// ─── Ghost / stale-entry detection ─────────────────────────────────────────

// The last time this item's underlying check actually ran/reported,
// independent of when *our app* last received a message about it. An
// agent that's still alive (even if reporting "down") refreshes
// payload.checkedAt / lastReceived on every check; an item where this is
// frozen in the past is one whose source has stopped reporting entirely.
// Falls back to lastUpdated (when we last received any message for this
// topic) for payloads that carry no timestamp of their own.
function lastActivityTimestamp(item) {
  const { payload } = item;
  return payload?.checkedAt || item.lastReceivedTracked || payload?.lastReceived || item.lastUpdated;
}

// An item whose underlying check hasn't reported in this long is treated
// as an abandoned/decommissioned source rather than a real outage — a real
// outage would still produce periodic "down" reports. Renderer-only review
// concern: main.js's tray/aggregate status doesn't depend on "ghost"
// status, so there's no main.js mirror to keep in sync here.
export const GHOST_THRESHOLD_MS = 24 * 60 * 60 * 1000; // 24 hours

export function isGhostItem(item, now) {
  const ts = lastActivityTimestamp(item);
  if (!ts) return false;
  return now - new Date(ts).getTime() > GHOST_THRESHOLD_MS;
}

// ─── Focus mode (hide "everything's fine" items) ───────────────────────────

// True if this item is currently healthy with nothing noteworthy to
// report — the "everything's fine, nothing to look at" case that focus
// mode hides by default.
export function isQuietItem(item, now) {
  if (item.messageType === 'connection_status') {
    return computeConnectionStatus(item, now) === 'green' && !hasRecentInstability(item.payload);
  }
  return (item.computedStatus || 'grey') === 'green';
}

// Same idea for a "connections" subject (multi-location group): quiet only
// if every location is up and none flapped recently. Subjects are shown or
// hidden as a whole.
export function isQuietSubject(subject) {
  return subject.status === 'green' && subject.instableCount === 0;
}

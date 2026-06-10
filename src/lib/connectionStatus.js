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

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

// True once an item hasn't reported recently enough to trust its last
// self-reported fields (e.g. payload.available) as current — mirrors the
// same 3x-refresh threshold computeConnectionStatus uses to escalate to
// yellow/red, so UI reading "stale" lines up with why the dot did.
export function isStale(item, now) {
  const { payload } = item;
  const refreshMs = (payload?.refreshMinutes || 5) * 60_000;
  const type = payload?.type;

  if (type === 'icmp' || type === 'tcp' || type === 'dated_file_exists' || type === 'file_mtime' || type === 'db_currency') {
    if (!payload.checkedAt) return false;
    return now - new Date(payload.checkedAt).getTime() > 3 * refreshMs;
  }

  const lr = item.lastReceivedTracked || payload?.lastReceived;
  if (!lr) return true;
  return now - new Date(lr).getTime() >= 3 * refreshMs;
}

// Aggregate status for a "connections" subject checked from multiple
// locations: majority down means the subject itself is likely down (red),
// a minority means it's more likely a path issue local to those locations
// (orange) rather than the connection being monitored.
export function subjectAggregateStatus(downCount, total) {
  if (downCount === 0) return 'green';
  return downCount / total > 0.5 ? 'red' : 'orange';
}

const ORANGE_LIGHT = { r: 0xff, g: 0xd8, b: 0xa8 }; // light amber, ratio 0
const ORANGE_FULL  = { r: 0xfa, g: 0x8c, b: 0x16 }; // #fa8c16, ratio >= 0.5

// Interpolates a hex color for the 'orange' (minority-down) status, scaled
// by how close the down-ratio is to subjectAggregateStatus's 0.5 red
// cutover. Stays in the amber/orange family, distinct from `yellow`
// (reserved for per-item staleness) so the two meanings never look alike.
export function orangeSeverityColor(downCount, total) {
  const ratio = total ? Math.min(downCount / total, 0.5) / 0.5 : 0;
  const lerp = (a, b) => Math.round(a + (b - a) * ratio);
  const r = lerp(ORANGE_LIGHT.r, ORANGE_FULL.r);
  const g = lerp(ORANGE_LIGHT.g, ORANGE_FULL.g);
  const b = lerp(ORANGE_LIGHT.b, ORANGE_FULL.b);
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

// Per-item status for a connection_status item (computed live) or any
// other item type (already-computed status).
export function itemStatus(item, now) {
  if (item.originOffline) return 'grey';
  return item.messageType === 'connection_status'
    ? computeConnectionStatus(item, now)
    : (item.computedStatus || 'grey');
}

// Acknowledged ("seen") items: the user marked this item's current problem
// as seen. The runtime clears item.acknowledged the next time the item
// reports green, so it's only ever set on a not-green item. Acknowledged
// items display as 'blue' and are left out of the tray/aggregate status, so
// a known issue doesn't mask new ones.
export function effectiveItemStatus(item, now) {
  if (item.originOffline) return 'grey';
  return item.acknowledged ? 'blue' : itemStatus(item, now);
}

// True if a source's down items look like one shared/correlated failure
// (e.g. a location's uplink is down, so every check from that location
// reports down together) rather than independent problems. Reuses
// subjectAggregateStatus's >50% majority rule. Requires more than one
// check total — a single check can't be "correlated."
export function isLikelyCorrelatedFailure(downCount, total) {
  return total > 1 && downCount / total > 0.5;
}

// True if the check flapped or saw packet loss recently, even if it's
// currently up — surfaces "was this stable?" independent of "is it up now?"
export function hasRecentInstability(payload) {
  return (payload?.transitions1h || 0) > 0 || (payload?.rollingPacketLoss10 || 0) > 0;
}

// Groups items by payload.subjectId and reduces each group's per-location
// computedStatus values down to a single subject-level status. Locations
// whose reporting server is offline (item.originOffline, see
// withOriginStatus) are left out of the vote entirely — `total` counts only
// live locations — and a subject with no live locations is 'grey'.
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
    const liveItems = group.items.filter((item) => !item.originOffline);
    const downCount = liveItems.filter((item) => !item.acknowledged && computeConnectionStatus(item, now) === 'red').length;
    const ackedCount = liveItems.filter((item) => item.acknowledged).length;
    const instableCount = liveItems.filter((item) => hasRecentInstability(item.payload)).length;
    return {
      ...group,
      downCount,
      ackedCount,
      instableCount,
      offlineCount: group.items.length - liveItems.length,
      total: liveItems.length,
      status: liveItems.length ? subjectAggregateStatus(downCount, liveItems.length) : 'grey',
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
  return payload?.checkedAt || payload?.publishedAt || item.lastReceivedTracked || payload?.lastReceived || item.lastUpdated;
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
  // Offline-origin items aren't actionable on their own — the server row in
  // the Servers section carries that problem.
  if (item.originOffline) return true;
  if (item.messageType === 'connection_status') {
    return computeConnectionStatus(item, now) === 'green' && !hasRecentInstability(item.payload);
  }
  return (item.computedStatus || 'grey') === 'green';
}

// Same idea for a "connections" subject (multi-location group): quiet only
// if every location is up and none flapped recently. Subjects are shown or
// hidden as a whole.
export function isQuietSubject(subject) {
  return (subject.status === 'green' || subject.status === 'grey') && subject.instableCount === 0 && subject.ackedCount === 0;
}

// ─── Server heartbeats ─────────────────────────────────────────────────────

// Each reporting server publishes <projectId>/<systemId>/heartbeat about
// once a minute. Every check/connection topic carries the same
// projectId/systemId, so we can tell whether the server that produced an
// item is still alive before trusting (or alarming on) what it last said.

const DEFAULT_HEARTBEAT_INTERVAL_SECONDS = 60;
export const HEARTBEAT_STALE_MULTIPLIER = 3;

// A just-(re)started server gets this long to publish every check it lists
// in its heartbeat before the missing ones are flagged.
const MISSING_CHECK_GRACE_MS = 10 * 60_000;

export function isHeartbeatTopic(topicKey) {
  const parts = (topicKey || '').split('/');
  return parts.length === 3 && parts[2] === 'heartbeat';
}

// "projectId/systemId" of the server that published a topic:
//   connections/<subjectId>/<projectId>/<systemId>/<id>
//   <projectId>/<systemId>/checks/<id> | /status | /heartbeat
export function originKeyForTopic(topicKey) {
  const parts = (topicKey || '').split('/');
  if (parts[0] === 'connections') return parts.length >= 5 ? `${parts[2]}/${parts[3]}` : null;
  return parts.length >= 3 ? `${parts[0]}/${parts[1]}` : null;
}

// Judged by the server's own publishedAt rather than when we received it,
// so a retained heartbeat replayed on reconnect doesn't make a dead server
// look alive.
export function heartbeatLastSeen(hb) {
  return hb.payload?.publishedAt || hb.lastUpdated;
}

export function isHeartbeatStale(hb, now) {
  const ts = heartbeatLastSeen(hb);
  if (!ts) return true;
  const intervalMs = (hb.payload?.intervalSeconds || DEFAULT_HEARTBEAT_INTERVAL_SECONDS) * 1000;
  return now - new Date(ts).getTime() > HEARTBEAT_STALE_MULTIPLIER * intervalMs;
}

// Returns the items with `originOffline: true` set on every non-heartbeat
// item whose server has a stale heartbeat. Servers we've never seen a
// heartbeat from are left alone (old behavior), so a server that doesn't
// publish heartbeats yet isn't greyed out.
export function withOriginStatus(items, now) {
  const offline = new Set();
  for (const item of items) {
    if (item.messageType === 'heartbeat' && isHeartbeatStale(item, now)) {
      offline.add(originKeyForTopic(item.topicKey));
    }
  }
  if (!offline.size) return items;
  return items.map((item) =>
    item.messageType !== 'heartbeat' && offline.has(originKeyForTopic(item.topicKey))
      ? { ...item, originOffline: true }
      : item);
}

// One entry per heartbeat-publishing server:
//   green  — heartbeat current, every check it lists is reporting
//   yellow — heartbeat current, but some listed checks never showed up
//   red    — heartbeat stale AND the subjects that ping this server's site
//            are down (majority rule) — its internet is likely down
//   brown  — heartbeat stale but the site still answers pings (or we have
//            no reachability data) — the monitoring service itself stopped
// `items` must already be passed through withOriginStatus; `subjects` is
// groupConnectionsBySubject's output for the same items.
export function computeServers(items, subjects, now) {
  const present = new Set(items.map((i) => i.topicKey));
  const subjectById = new Map(subjects.map((s) => [s.subjectId, s]));

  return items.filter((i) => i.messageType === 'heartbeat').map((hb) => {
    const origin = originKeyForTopic(hb.topicKey);
    const p = hb.payload || {};
    const stale = isHeartbeatStale(hb, now);

    const expected = [
      ...(p.checks || []).map((c) => ({ topicKey: `${origin}/checks/${c.id}`, label: c.label || c.id })),
      ...(p.connectionTests || []).filter((t) => t.subjectId).map((t) => ({
        topicKey: `connections/${t.subjectId}/${origin}/${t.id}`, label: t.label || t.id,
      })),
    ];
    const blocked = new Set(hb.blockedTopics || []);
    const startedAt = p.serverStarted ? new Date(p.serverStarted).getTime() : 0;
    const pastGrace = now - startedAt > MISSING_CHECK_GRACE_MS;
    const missing = stale || !pastGrace
      ? []
      : expected.filter((e) => !present.has(e.topicKey) && !blocked.has(e.topicKey));

    const reachSubjectIds = [...new Set([...(hb.reachabilitySubjects || []), ...(p.siteSubjectIds || [])])];
    const reachSubjects = reachSubjectIds.map((id) => subjectById.get(id)).filter((s) => s && s.status !== 'grey');
    const reachability =
      !reachSubjects.length                          ? 'unknown' :
      reachSubjects.some((s) => s.status !== 'red') ? 'up' : 'down';

    const status = !stale
      ? (missing.length ? 'yellow' : 'green')
      : (reachability === 'down' ? 'red' : 'brown');

    return {
      topicKey: hb.topicKey,
      originKey: origin,
      label: hb.sourceLabel || origin,
      lastSeen: heartbeatLastSeen(hb),
      serverStarted: p.serverStarted || null,
      stale,
      expectedCount: expected.length,
      missing,
      reachSubjects,
      reachability,
      status,
    };
  });
}

// Everything the tray, header, and hero need, computed once with the same
// rules. Grey (offline-origin) items and brown (not-reporting but
// reachable) servers never move the overall status; acknowledged ('blue')
// items count as OK.
export function summarizeItems(items, now) {
  const all = withOriginStatus(items, now);
  const connectionsItems = all.filter((i) => i.messageType === 'connections_status');
  const regularItems = all.filter((i) => i.messageType !== 'connections_status' && i.messageType !== 'heartbeat');
  const subjects = groupConnectionsBySubject(connectionsItems, now);
  const servers = computeServers(all, subjects, now);

  const regularStatuses = regularItems.map((i) => effectiveItemStatus(i, now));
  // 'orange' (localized path issue) degrades to 'yellow' rather than 'red'.
  const subjectStatuses = subjects.map((s) => (s.status === 'orange' ? 'yellow' : s.status));
  const serverStatuses = servers.map((s) => s.status);

  const counted = [...regularStatuses, ...subjectStatuses, ...serverStatuses]
    .filter((s) => s === 'red' || s === 'yellow' || s === 'green' || s === 'blue');

  const aggregate =
    counted.includes('red')    ? 'red' :
    counted.includes('yellow') ? 'yellow' :
    counted.length             ? 'green' : 'grey';

  return {
    all, regularItems, subjects, servers, aggregate,
    redCount:    counted.filter((s) => s === 'red').length,
    yellowCount: counted.filter((s) => s === 'yellow').length,
    greenCount:  counted.filter((s) => s === 'green').length,
    ackedCount:  regularStatuses.filter((s) => s === 'blue').length + subjects.reduce((sum, s) => sum + s.ackedCount, 0),
    offlineServerCount: servers.filter((s) => s.stale).length,
  };
}

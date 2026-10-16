// Self-contained fake data source for `start.sh --demo`. Implements the same
// interface as createMqttRuntime (mqttClient.js) — getSnapshot/reconnect/
// removeItem/removeItems/setAcknowledged/restoreItem/end — so runtime.js can swap it in
// without the rest of the app knowing the difference. No broker, no network:
// it fabricates a fixed cast of checks and walks them through a scripted
// "story" of scenes on a timer, looping forever, so a screen left running at
// a booth/kiosk keeps cycling through the product's interesting states.
import { computeConnectionStatus, itemStatus } from './connectionStatus';

const BOOT_MS = 2_500;   // initial "Connecting…" flash before the story starts
const JITTER_MS = 4_000; // how often numbers wiggle within the current scene

function isoNow() {
  return new Date().toISOString();
}

function isoAgo(ms) {
  return new Date(Date.now() - ms).toISOString();
}

function jitter(base, spread) {
  return Math.round(base + (Math.random() * 2 - 1) * spread);
}

function itemsFromList(list) {
  return Object.fromEntries(list.map((item) => [item.topicKey, item]));
}

// ─── Item builders — mirror the shapes createMqttRuntime stores ───────────────

function connectionItem(topicKey, sourceLabel, payload) {
  return {
    topicKey,
    messageType: 'connection_status',
    sourceLabel,
    payload,
    computedStatus: computeConnectionStatus({ payload }, Date.now()),
    lastReceivedTracked: null,
    lastUpdated: isoNow(),
  };
}

function subjectItem(topicKey, subjectId, subjectLabel, payload) {
  return {
    ...connectionItem(topicKey, subjectLabel, { ...payload, subjectId, subjectLabel }),
    messageType: 'connections_status',
  };
}

function processItem(topicKey, sourceLabel, { status, detail, stage, ageMs = 0 }) {
  return {
    topicKey,
    messageType: 'process_status',
    sourceLabel,
    payload: { status, detail, stage, checkedAt: isoAgo(ageMs) },
    computedStatus: status,
    lastReceivedTracked: null,
    lastUpdated: isoNow(),
  };
}

// Server liveness beacon. `ageMs` past ~3 minutes reads as a stopped
// heartbeat; `reachabilitySubjects` mirrors the per-source "Reached via"
// setting the real runtime attaches.
function heartbeatItem(origin, sourceLabel, { ageMs = 0, checks = [], connectionTests = [], reachabilitySubjects = [] } = {}) {
  return {
    topicKey: `${origin}/heartbeat`,
    messageType: 'heartbeat',
    sourceLabel,
    payload: {
      serverStarted: isoAgo(30 * 86_400_000),
      checks,
      connectionTests,
      publishedAt: isoAgo(ageMs),
    },
    computedStatus: ageMs > 3 * 60_000 ? 'stale' : 'alive',
    reachabilitySubjects,
    blockedTopics: [],
    lastUpdated: isoNow(),
  };
}

function icmp(id, label, { available, latencyMs, packetLoss = 0, transitions1h = 0, rollingPacketLoss10 = 0, ageMs = 0 }) {
  return { id, label, type: 'icmp', available, latencyMs, packetLoss, checkedAt: isoAgo(ageMs), refreshMinutes: 1, transitions1h, rollingPacketLoss10 };
}

function tcp(id, label, opts) {
  return { ...icmp(id, label, opts), type: 'tcp' };
}

// refreshMinutes here isn't "how often we check" so much as "how old is this
// file allowed to get before it's suspicious" — computeConnectionStatus reads
// ageSeconds against 3x/5x refreshMinutes, so a once-nightly drop needs a
// refresh window measured in hours, not the ~1min used for live ping checks.
function fileMtime(id, label, { fileCount, ageSeconds, ageMs = 0, refreshMinutes = 480 }) {
  return { id, label, type: 'file_mtime', fileCount, ageSeconds, checkedAt: isoAgo(ageMs), refreshMinutes };
}

function datedFileExists(id, label, { exists, error, sizeBytes, ageMs = 0 }) {
  return { id, label, type: 'dated_file_exists', exists, error, sizeBytes, checkedAt: isoAgo(ageMs), refreshMinutes: 1 };
}

function dbCurrency(id, label, { ageSeconds, error, ageMs = 0 }) {
  return { id, label, type: 'db_currency', ageSeconds, error, checkedAt: isoAgo(ageMs), refreshMinutes: 1 };
}

// ─── The story: an ordered, looping reel of scenes ─────────────────────────────
// Each scene fully replaces the item set (rather than patching it) — simplest
// way to guarantee every scene renders a coherent, self-consistent picture.

const CIRCUIT_ID = 'wan-circuit-1';
const CIRCUIT_LABEL = 'Branch A ↔ HQ Circuit';

// Each location's server publishes under demo/<location>/..., and its leg of
// the shared circuit under connections/<subjectId>/demo/<location>/<id>, so
// the origin-server lookup works the same as with real topics.
function baseItems({
  branchADown = false, circuitDownLocations = [], branchAHeartbeatAgeMs = 0, hqMissingCheck = false,
} = {}) {
  const circuitLeg = (location, id, label) => subjectItem(
    `connections/${CIRCUIT_ID}/demo/${location}/${id}`, CIRCUIT_ID, CIRCUIT_LABEL,
    icmp(id, label, circuitDownLocations.includes(id)
      ? { available: false, latencyMs: null, ageMs: 0 }
      : { available: true, latencyMs: jitter(10, 3), ageMs: 0 }),
  );

  return [
    branchADown
      ? connectionItem('demo/branch-a/checks/icmp-gateway', 'Branch A', icmp('icmp-gateway', 'Gateway Router', { available: false, latencyMs: null }))
      : connectionItem('demo/branch-a/checks/icmp-gateway', 'Branch A', icmp('icmp-gateway', 'Gateway Router', { available: true, latencyMs: jitter(14, 4) })),
    branchADown
      ? connectionItem('demo/branch-a/checks/tcp-pos', 'Branch A', tcp('tcp-pos', 'POS Terminal Link', { available: false, latencyMs: null }))
      : connectionItem('demo/branch-a/checks/tcp-pos', 'Branch A', tcp('tcp-pos', 'POS Terminal Link', { available: true, latencyMs: jitter(22, 5) })),
    branchADown
      ? connectionItem('demo/branch-a/checks/file-backup', 'Branch A', fileMtime('file-backup', 'Nightly Backup Drop', { fileCount: 0, ageSeconds: null }))
      : connectionItem('demo/branch-a/checks/file-backup', 'Branch A', fileMtime('file-backup', 'Nightly Backup Drop', { fileCount: 1, ageSeconds: jitter(25_200, 3_600) })),

    processItem('demo/hq/status', 'HQ Datacenter', branchADown
      ? { status: 'red', detail: 'Nightly ETL job failed: upstream connection timeout', stage: 'transform' }
      : { status: 'green', detail: 'All jobs completed successfully', stage: 'complete' }),
    connectionItem('demo/hq/checks/orders-db', 'HQ Datacenter', dbCurrency('orders-db', 'Orders DB Freshness', { ageSeconds: jitter(60, 20) })),
    connectionItem('demo/hq/checks/eod-report', 'HQ Datacenter', datedFileExists('eod-report', 'End-of-Day Report', { exists: true, sizeBytes: 184_320 })),

    circuitLeg('branch-a', 'from-branch-a', 'From Branch A'),
    circuitLeg('branch-b', 'from-branch-b', 'From Branch B'),
    circuitLeg('hq', 'from-hq', 'From HQ'),

    heartbeatItem('demo/branch-a', 'Branch A', {
      ageMs: branchAHeartbeatAgeMs,
      checks: [
        { id: 'icmp-gateway', type: 'icmp', label: 'Gateway Router' },
        { id: 'tcp-pos', type: 'tcp', label: 'POS Terminal Link' },
        { id: 'file-backup', type: 'file_mtime', label: 'Nightly Backup Drop' },
      ],
      connectionTests: [{ id: 'from-branch-a', type: 'icmp', label: 'From Branch A', subjectId: CIRCUIT_ID }],
      reachabilitySubjects: [CIRCUIT_ID],
    }),
    heartbeatItem('demo/hq', 'HQ Datacenter', {
      checks: [
        { id: 'orders-db', type: 'db_currency', label: 'Orders DB Freshness' },
        { id: 'eod-report', type: 'dated_file_exists', label: 'End-of-Day Report' },
        ...(hqMissingCheck ? [{ id: 'tape-backup', type: 'file_mtime', label: 'Tape Backup Log' }] : []),
      ],
      connectionTests: [{ id: 'from-hq', type: 'icmp', label: 'From HQ', subjectId: CIRCUIT_ID }],
    }),
    heartbeatItem('demo/branch-b', 'Branch B', {
      connectionTests: [{ id: 'from-branch-b', type: 'icmp', label: 'From Branch B', subjectId: CIRCUIT_ID }],
    }),
  ];
}

const STORY = [
  {
    name: 'all-good',
    duration: 14_000,
    connectionState: 'live',
    build: () => itemsFromList(baseItems()),
  },
  {
    name: 'flapping-link',
    duration: 13_000,
    connectionState: 'live',
    build: () => {
      const list = baseItems();
      const gateway = list.find((i) => i.topicKey === 'demo/branch-a/checks/icmp-gateway');
      gateway.payload.transitions1h = 5;
      gateway.payload.rollingPacketLoss10 = 14;
      gateway.payload.latencyMs = jitter(30, 12);
      return itemsFromList(list);
    },
  },
  {
    name: 'partial-outage',
    duration: 13_000,
    connectionState: 'live',
    build: () => itemsFromList(baseItems({ circuitDownLocations: ['from-branch-a'] })),
  },
  {
    name: 'full-outage',
    duration: 15_000,
    connectionState: 'live',
    build: () => itemsFromList(baseItems({ branchADown: true, circuitDownLocations: ['from-branch-a', 'from-branch-b'] })),
  },
  {
    // Branch A's monitoring service stops but the site still answers pings
    // from the other locations: Branch A's checks go grey and its server
    // row goes brown, with no change to the overall/tray status.
    name: 'server-not-reporting',
    duration: 14_000,
    connectionState: 'live',
    build: () => {
      const list = baseItems({ branchAHeartbeatAgeMs: 6 * 60_000 });
      for (const item of list) {
        if (item.topicKey.includes('/branch-a/') && item.messageType !== 'heartbeat') item.payload.checkedAt = isoAgo(6 * 60_000);
      }
      return itemsFromList(list);
    },
  },
  {
    // Branch A goes dark entirely: heartbeat stops AND the other locations
    // can't reach it, so the server row goes red (internet down).
    name: 'site-offline',
    duration: 14_000,
    connectionState: 'live',
    build: () => {
      const list = baseItems({ branchAHeartbeatAgeMs: 6 * 60_000, circuitDownLocations: ['from-branch-b', 'from-hq'] });
      for (const item of list) {
        if (item.topicKey.includes('/branch-a/') && item.messageType !== 'heartbeat') item.payload.checkedAt = isoAgo(6 * 60_000);
      }
      return itemsFromList(list);
    },
  },
  {
    // HQ's heartbeat lists a check that never publishes.
    name: 'missing-check',
    duration: 12_000,
    connectionState: 'live',
    build: () => itemsFromList(baseItems({ hqMissingCheck: true })),
  },
  {
    name: 'stale-ghosts',
    duration: 13_000,
    connectionState: 'live',
    build: () => {
      const list = baseItems();
      list.push(connectionItem(
        'demo/legacy/checks/old-probe', 'Legacy Site (decommissioned)',
        icmp('old-probe', 'Old Test Probe', { available: false, latencyMs: null, ageMs: 50 * 3_600_000 }),
      ));
      list.push(connectionItem(
        'demo/legacy/checks/old-db', 'Legacy Site (decommissioned)',
        dbCurrency('old-db', 'Decommissioned DB Check', { ageSeconds: null, error: 'connection refused', ageMs: 75 * 3_600_000 }),
      ));
      return itemsFromList(list);
    },
  },
  {
    name: 'broker-unreachable',
    duration: 8_000,
    connectionState: 'black',
    build: () => itemsFromList(baseItems()),
  },
];

// ─── Runtime ────────────────────────────────────────────────────────────────

export function createDemoRuntime(handlers = {}) {
  let items = {};
  let connectionState = 'grey';
  let sceneIndex = 0;
  const removedTopics = new Map();
  const acknowledged = new Set();

  let bootTimer = null;
  let jitterTimer = null;
  let sceneTimer = null;

  function emitItems() {
    handlers.onItems?.({ ...items });
  }

  function emitConnectionState(state) {
    if (connectionState === state) return;
    connectionState = state;
    handlers.onConnectionState?.(state);
  }

  function emitRemovedTopics() {
    handlers.onRemovedTopics?.([...removedTopics.values()]);
  }

  // Re-renders the current scene (fresh timestamps/jitter) without advancing
  // the story — also re-applies any removals the visitor made by hand so a
  // manual "remove" doesn't get instantly undone by the next tick.
  function renderCurrentScene() {
    const scene = STORY[sceneIndex];
    const next = scene.build();
    for (const topicKey of removedTopics.keys()) delete next[topicKey];
    const now = Date.now();
    for (const [topicKey, item] of Object.entries(next)) {
      if (itemStatus(item, now) === 'green') acknowledged.delete(topicKey);
      else if (acknowledged.has(topicKey)) item.acknowledged = true;
    }
    items = next;
    emitConnectionState(scene.connectionState);
    emitItems();
  }

  function scheduleNextScene() {
    sceneTimer = setTimeout(() => {
      sceneIndex = (sceneIndex + 1) % STORY.length;
      renderCurrentScene();
      scheduleNextScene();
    }, STORY[sceneIndex].duration);
  }

  function start() {
    connectionState = 'grey';
    handlers.onConnectionState?.('grey');
    items = {};
    emitItems();

    bootTimer = setTimeout(() => {
      sceneIndex = 0;
      renderCurrentScene();
      jitterTimer = setInterval(renderCurrentScene, JITTER_MS);
      scheduleNextScene();
    }, BOOT_MS);
  }

  function stop() {
    clearTimeout(bootTimer);
    clearInterval(jitterTimer);
    clearTimeout(sceneTimer);
  }

  start();

  return {
    getSnapshot() {
      return { items: { ...items }, connectionState, removedTopics: [...removedTopics.values()] };
    },

    // Settings changes don't mean anything to the demo (there's no broker to
    // point elsewhere) — just restart the story from the top so "Save" still
    // feels like it did something.
    reconnect() {
      stop();
      sceneIndex = 0;
      start();
    },

    removeItem(topicKey) {
      const item = items[topicKey];
      delete items[topicKey];
      removedTopics.set(topicKey, {
        topicKey,
        sourceLabel: item?.sourceLabel || '',
        label: item?.payload?.label || item?.payload?.id || topicKey,
      });
      emitItems();
      emitRemovedTopics();
    },

    removeItems(topicKeys) {
      for (const topicKey of (topicKeys || [])) {
        const item = items[topicKey];
        if (!item) continue;
        delete items[topicKey];
        removedTopics.set(topicKey, {
          topicKey,
          sourceLabel: item.sourceLabel || '',
          label: item.payload?.label || item.payload?.id || topicKey,
        });
      }
      emitItems();
      emitRemovedTopics();
    },

    setAcknowledged(topicKey, on) {
      const item = items[topicKey];
      if (!item) return;
      if (on) acknowledged.add(topicKey);
      else    acknowledged.delete(topicKey);
      items[topicKey] = { ...item, acknowledged: !!on };
      emitItems();
    },

    restoreItem(topicKey) {
      removedTopics.delete(topicKey);
      emitRemovedTopics();
    },

    end() {
      stop();
    },
  };
}

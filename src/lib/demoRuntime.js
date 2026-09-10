// Self-contained fake data source for `start.sh --demo`. Implements the same
// interface as createMqttRuntime (mqttClient.js) — getSnapshot/reconnect/
// removeItem/removeItems/restoreItem/end — so runtime.js can swap it in
// without the rest of the app knowing the difference. No broker, no network:
// it fabricates a fixed cast of checks and walks them through a scripted
// "story" of scenes on a timer, looping forever, so a screen left running at
// a booth/kiosk keeps cycling through the product's interesting states.
import { computeConnectionStatus } from './connectionStatus';

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

function baseItems({ branchADown = false, circuitDownLocations = [] } = {}) {
  const circuitLeg = (id, label) => subjectItem(
    `connections/${CIRCUIT_ID}/${id}`, CIRCUIT_ID, CIRCUIT_LABEL,
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

    circuitLeg('from-branch-a', 'From Branch A'),
    circuitLeg('from-branch-b', 'From Branch B'),
    circuitLeg('from-hq', 'From HQ'),
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

    restoreItem(topicKey) {
      removedTopics.delete(topicKey);
      emitRemovedTopics();
    },

    end() {
      stop();
    },
  };
}

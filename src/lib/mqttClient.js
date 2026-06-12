// Shared MQTT data layer: connects, subscribes to source topics, and turns
// incoming messages into the `items` map consumed by the UI. Used by both
// electron/main.js (Node, via the 'mqtt'/'ws' packages bundled for SSR) and
// the browser/GitHub Pages build (via mqtt.js's websocket transport) — so
// there's one place that knows how to talk to the broker.
import mqtt from 'mqtt';
import { computeConnectionStatus, subjectAggregateStatus } from './connectionStatus';

// "connections" is a broker-wide aggregation topic, independent of any
// configured source: connections/<subjectId>/<projectId>/<systemId>/<id>.
export const CONNECTIONS_WILDCARD = 'connections/#';

export function topicsForSource(source) {
  const base = `${source.projectId}/${source.systemId}`;
  if (source.type === 'process_status')    return [`${base}/status`];
  if (source.type === 'connection_status') return [`${base}/checks/+`];
  return [`${base}/status`, `${base}/checks/+`]; // fallback: subscribe both
}

export function messageTypeForTopic(topic, source) {
  const base = `${source.projectId}/${source.systemId}`;
  if (source.type === 'process_status'    && topic === `${base}/status`)          return 'process_status';
  if (source.type === 'connection_status' && topic.startsWith(`${base}/checks/`)) return 'connection_status';
  // Fallback for sources without an explicit type configured
  if (topic === `${base}/status`)          return 'process_status';
  if (topic.startsWith(`${base}/checks/`)) return 'connection_status';
  return null;
}

function findSourceForTopic(sources, topic) {
  for (const source of sources) {
    const type = messageTypeForTopic(topic, source);
    if (type) return { source, type };
  }
  return null;
}

// Builds the broker connection URL from settings. mqtt.js dispatches on the
// URL scheme, so 'mqtt'/'mqtts' get a raw TCP/TLS connection (Electron's
// usual default) while 'ws'/'wss' connect over the broker's websocket
// listener (required in the browser; also usable from Electron e.g. through
// a Cloudflare tunnel).
export function buildConnectionUrl(settings) {
  const protocol = settings.mqttProtocol || 'mqtt';
  if (protocol === 'ws' || protocol === 'wss') {
    const path = (settings.mqttWsPath || '/').trim();
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${protocol}://${settings.mqttHost}:${settings.mqttWsPort}${normalizedPath}`;
  }
  return `${protocol}://${settings.mqttHost}:${settings.mqttPort}`;
}

// Runs every 60s to recompute connection_status / connections_status items
// that may have aged into yellow/red without new MQTT messages arriving.
const STALENESS_CHECK_MS = 60_000;

// handlers:
//   onItems(itemsObj)
//   onConnectionState(state)            'grey' | 'live' | 'black'
//   onRemovedTopics(removedTopicsArray)
//   onProcessStatusChange(sourceLabel, computedStatus, payload)  — only while live
export function createMqttRuntime(initialSettings, initialRemovedTopics, handlers = {}) {
  let settings = initialSettings;
  let mqttClient = null;
  let connectionState = 'grey';
  let stalenessInterval = null;

  // topicKey → { topicKey, messageType, sourceLabel, payload, computedStatus, lastReceivedTracked, lastUpdated }
  const items = new Map();

  // topicKey → { topicKey, sourceLabel, label }
  const removedTopics = new Map((initialRemovedTopics || []).map((r) => [r.topicKey, r]));

  function emitItems() {
    handlers.onItems?.(Object.fromEntries(items));
  }

  function emitRemovedTopics() {
    handlers.onRemovedTopics?.([...removedTopics.values()]);
  }

  function setConnectionState(state) {
    if (connectionState === state) return;
    connectionState = state;
    handlers.onConnectionState?.(state);
  }

  function connect(newSettings) {
    settings = newSettings;

    if (mqttClient) {
      mqttClient.end(true);
      mqttClient = null;
    }

    items.clear();
    emitItems();
    setConnectionState('grey');

    const url = buildConnectionUrl(settings);
    const opts = { clean: true, reconnectPeriod: 15_000 };
    if (settings.mqttUsername) {
      opts.username = settings.mqttUsername;
      opts.password = settings.mqttPassword || '';
    }

    console.log(`[MQTT] Connecting to ${url}`);
    mqttClient = mqtt.connect(url, opts);

    mqttClient.on('connect', () => {
      console.log('[MQTT] Connected — subscribing to all source topics');
      for (const source of (settings.sources || [])) {
        for (const topic of topicsForSource(source)) {
          mqttClient.subscribe(topic, { qos: 1 });
          console.log(`[MQTT] Subscribed: ${topic}`);
        }
      }
      mqttClient.subscribe(CONNECTIONS_WILDCARD, { qos: 1 });
      console.log(`[MQTT] Subscribed: ${CONNECTIONS_WILDCARD}`);
    });

    mqttClient.on('message', (topic, message) => {
      if (removedTopics.has(topic)) return;

      // Broker-side retained-clear (empty payload): drop it from the live
      // view immediately rather than leaving a stale entry until restart.
      if (message.length === 0) {
        if (items.delete(topic)) emitItems();
        return;
      }

      let payload;
      try { payload = JSON.parse(message.toString()); } catch { return; }

      let type, sourceLabel;
      if (topic.startsWith('connections/')) {
        if (!payload.subjectId) return;
        type = 'connections_status';
        sourceLabel = payload.subjectLabel || payload.subjectId;
      } else {
        const match = findSourceForTopic(settings.sources || [], topic);
        if (!match) return;
        type = match.type;
        sourceLabel = match.source.label || match.source.id;
      }

      const existing = items.get(topic);

      let computedStatus;
      let lastReceivedTracked = existing?.lastReceivedTracked ?? null;

      if (type === 'connection_status' || type === 'connections_status') {
        if (payload.lastReceived) lastReceivedTracked = payload.lastReceived;
        computedStatus = computeConnectionStatus({ payload, lastReceivedTracked }, Date.now());
      } else {
        // process_status: use payload.status directly
        computedStatus = payload.status || 'grey';
      }

      items.set(topic, {
        topicKey: topic,
        messageType: type,
        sourceLabel,
        payload,
        computedStatus,
        lastReceivedTracked,
        lastUpdated: new Date().toISOString(),
      });

      setConnectionState('live');
      emitItems();

      if (type === 'process_status' && existing && existing.computedStatus !== computedStatus && connectionState === 'live') {
        handlers.onProcessStatusChange?.(sourceLabel, computedStatus, payload);
      }
    });

    mqttClient.on('error', (err) => {
      console.error('[MQTT] Error:', err.message);
      setConnectionState('black');
    });

    mqttClient.on('close', () => {
      if (connectionState === 'live') setConnectionState('grey');
    });
  }

  function recheckStaleness() {
    if (connectionState !== 'live') return;
    let changed = false;
    const now = Date.now();
    for (const [key, item] of items) {
      if (item.messageType !== 'connection_status' && item.messageType !== 'connections_status') continue;
      const newStatus = computeConnectionStatus(item, now);
      if (newStatus !== item.computedStatus) {
        items.set(key, { ...item, computedStatus: newStatus });
        changed = true;
      }
    }
    if (changed) emitItems();
  }

  // Shared by removeItem/removeItems. Does NOT emit — callers do that once
  // after processing one or more topics.
  function removeTopicInternal(topicKey) {
    const item = items.get(topicKey);
    items.delete(topicKey);
    removedTopics.set(topicKey, {
      topicKey,
      sourceLabel: item?.sourceLabel || '',
      label: item?.payload?.label || item?.payload?.id || topicKey,
    });

    // Publish an empty retained payload — tells the broker to delete the
    // retained message so the ghost doesn't come back on reconnect.
    if (mqttClient?.connected) {
      mqttClient.publish(topicKey, '', { retain: true, qos: 1 }, (err) => {
        if (err) console.error(`[MQTT] Failed to clear retained: ${topicKey}`, err.message);
        else     console.log(`[MQTT] Cleared retained message: ${topicKey}`);
      });
    } else {
      console.warn(`[MQTT] Not connected — removed locally but could not clear retained: ${topicKey}`);
    }
  }

  connect(settings);
  stalenessInterval = setInterval(recheckStaleness, STALENESS_CHECK_MS);

  return {
    getSnapshot() {
      return {
        items: Object.fromEntries(items),
        connectionState,
        removedTopics: [...removedTopics.values()],
      };
    },

    // Applies new settings (host/port/protocol/sources/credentials) and
    // reconnects from scratch.
    reconnect(newSettings) {
      connect(newSettings);
    },

    removeItem(topicKey) {
      removeTopicInternal(topicKey);
      emitItems();
      emitRemovedTopics();
    },

    removeItems(topicKeys) {
      for (const topicKey of (topicKeys || [])) {
        if (items.has(topicKey)) removeTopicInternal(topicKey);
      }
      emitItems();
      emitRemovedTopics();
    },

    restoreItem(topicKey) {
      removedTopics.delete(topicKey);
      // Re-subscribe to the specific topic to trigger retained message re-delivery
      if (mqttClient?.connected) {
        mqttClient.subscribe(topicKey, { qos: 1 }, (err) => {
          if (err) console.error(`[MQTT] Failed to re-subscribe: ${topicKey}`, err.message);
          else     console.log(`[MQTT] Re-subscribed (restored): ${topicKey}`);
        });
      }
      emitRemovedTopics();
    },

    end() {
      clearInterval(stalenessInterval);
      if (mqttClient) mqttClient.end(true);
    },
  };
}

// Aggregate connection state + per-item statuses down to a single tray/header
// color. Mirrors the per-item status rules in connectionStatus.js so
// "connections" subjects (checked from multiple locations) collapse the same
// way everywhere. `items` is the topicKey → item object as broadcast by the
// runtime (same shape used by the renderer's monitor store).
export function aggregateItemsStatus(items) {
  const values = Object.values(items || {});
  if (!values.length) return 'grey';

  const statuses = [];
  const subjectGroups = new Map();
  const now = Date.now();

  for (const item of values) {
    if (item.messageType === 'connections_status') {
      const sid = item.payload?.subjectId;
      if (!subjectGroups.has(sid)) subjectGroups.set(sid, []);
      subjectGroups.get(sid).push(item);
    } else if (item.messageType === 'connection_status') {
      statuses.push(computeConnectionStatus(item, now));
    } else {
      statuses.push(item.computedStatus || 'grey');
    }
  }

  for (const groupItems of subjectGroups.values()) {
    const downCount = groupItems.filter((i) => computeConnectionStatus(i, now) === 'red').length;
    const status = subjectAggregateStatus(downCount, groupItems.length);
    // 'orange' (localized path issue) degrades to 'yellow' rather than 'red'.
    statuses.push(status === 'orange' ? 'yellow' : status);
  }

  if (!statuses.length) return 'grey';
  if (statuses.includes('red'))    return 'red';
  if (statuses.includes('yellow')) return 'yellow';
  return 'green';
}
